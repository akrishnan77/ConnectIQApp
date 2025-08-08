import React, { useState, useEffect } from 'react';
import { FlatList, Text, Image, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { getTodoTasks } from "../../graph";

const Task = () => {
    const navigate = useNavigate();
    const { instance, accounts } = useMsal();

    const [allTasks, setAllTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            if (accounts.length > 0) {
                const request = {
                    scopes: ["Tasks.Read"],
                    account: accounts[0]
                };
                try {
                    const response = await instance.acquireTokenSilent(request);
                    const tasksResponse = await getTodoTasks(response.accessToken, "tasks");
                    if (tasksResponse && tasksResponse.value && Array.isArray(tasksResponse.value)) {
                        setAllTasks(tasksResponse.value);
                    }
                } catch (err) {
                    console.error("Failed to fetch tasks:", err);
                }
            }
            setIsLoading(false);
        };
        fetchTasks();
    }, [accounts, instance]);

    const isOverdue = (dueDateTime) => {
        if (!dueDateTime || !dueDateTime.dateTime) return false;
        // Compare dates only, ignoring time, to be consistent with how due dates are often displayed.
        const dueDate = new Date(dueDateTime.dateTime);
        dueDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return dueDate < today;
    };

    const getStatusText = (status) => {
        switch (status) {
            case "notStarted": return "Not Started";
            case "inProgress": return "In Progress";
            case "completed": return "Completed";
            default: return "Not Started";
        }
    };

    const getPriorityText = (importance) => {
        switch (importance) {
            case "high": return "High";
            case "normal": return "Normal";
            case "low": return "Low";
            default: return "Normal";
        }
    };

    const getStatusTextColor = (status) => {
        switch (status) {
            case "completed": return "#4CAF50"; // Green
            case "inProgress": return "#FFC107"; // Amber
            default: return "#616161";
        }
    };

    const getPriorityTextColor = (importance) => {
        if (importance === "high") return "#D32F2F"; // Red
        return "#616161";
    };

    const formatDueDate = (dueDateTime) => {
        if (!dueDateTime || !dueDateTime.dateTime) return "No due date";
        return new Date(dueDateTime.dateTime).toLocaleDateString();
    };

    const overdueTasks = allTasks.filter(task => task.status !== 'completed' && isOverdue(task.dueDateTime));
    const assignedTasks = allTasks.filter(task => !overdueTasks.some(overdueTask => overdueTask.id === task.id));

    const handleItemClick = (item) => {
        navigate(`/taskdetails/${item.id}`);
    };

    const renderItem = ({ item }) => {
        const statusTextColor = getStatusTextColor(item.status);
        const statusText = getStatusText(item.status);
        const priorityTextColor = getPriorityTextColor(item.importance);

        return (
            <View style={styles.itemContainer}>
                <TouchableOpacity
                    onPress={() => handleItemClick(item)}
                    style={styles.rowContainer}>
                    <View style={{ flex: 1, flexDirection: 'column', gap: 5 }}>
                        <View style={styles.rowContainer}>
                            <Text style={[styles.titleSmallStatus, { flex: 1 }]}>Due: {formatDueDate(item.dueDateTime)}</Text>
                            <View style={[styles.itemContainerWithBg, { marginEnd: 8 }]}>
                                <Text style={[styles.titleSmallStatus, { color: priorityTextColor }]}>
                                    {getPriorityText(item.importance)}
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.title, { marginTop: 5 }]}>{item.title}</Text>
                        <Text style={[styles.titleSmallStatus, { color: statusTextColor }]}>{statusText}</Text>
                    </View>
                    <Image
                        source={require('../../assets/images/home/icon_arrow.png')}
                        style={styles.iconSmallest}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.mainContainer}>
                <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <View style={[styles.rowHeader, { padding: 16, marginTop: 16, marginBottom: 16 }]}>
                <Text style={[styles.title500, { flex: 1 }]}>
                    Assigned Task
                </Text>
                <TouchableOpacity>
                    <Image
                        source={require('../../assets/images/home/icon_filter.png')}
                        style={styles.iconSmallest}
                    />
                </TouchableOpacity>
            </View>
            <FlatList
                data={assignedTasks}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.emptyListText}>No assigned tasks.</Text>}
            />
            <View style={[styles.rowHeader, { padding: 16, marginTop: 16, marginBottom: 16 }]}>
                <Text style={styles.title500}>
                    Overdue Task
                </Text>
            </View>
            <FlatList
                data={overdueTasks}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.emptyListText}>No overdue tasks.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 0,
        margin: 0
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rowHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5'
    },
    itemContainer: {
        padding: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#E0E0E0',
    },
    itemContainerWithBg: {
        backgroundColor: '#FDF3F4',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: '400',
    },
    title500: {
        fontSize: 16,
        fontWeight: '500',
        color: '#242424'
    },
    titleSmallStatus: {
        color: '#616161',
        fontSize: 14,
        fontWeight: '400',
    },
    iconSmallest: {
        width: 24,
        height: 24
    },
    emptyListText: {
        padding: 16,
        textAlign: 'center',
        color: '#616161'
    }
});

export default Task;
