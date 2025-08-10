import React from 'react';
import { FlatList, Text, Image, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigate } from "react-router-dom";
import Utils from '../../../utils/Utils';
import { FloatingButtonAdd } from '../../../components/nrf_app/FloatingButton';
import { getUserNameByEmail } from '../../../utils/DummyData';

const Task = ({ task }) => {
    const navigate = useNavigate();
    const utils = new Utils();

    // Handle Learning click
    const handleItemClick = (item, index) => {
        // Route is defined as "/taskSummary/:taskIdnew" (lowercase); ensure casing matches
        navigate(`/taskSummary/${item.id}`);
    };

    const handleAddPress = () => {
        navigate("/createTask")
    };

    const renderItem = ({ item, index }) => {
        const email = item.assignedTo;
        //const username = email.split('@')[0];  // Split at '@' and take the first part
        const username = getUserNameByEmail(email)
        //console.log(username);  // Output: "user"
        const priorityTextColor = utils.getPriorityTextColor(item.priority)

        return (
            <View style={styles.itemContainer}>
                <TouchableOpacity
                    onPress={() => handleItemClick(item, index)}
                    style={styles.rowContainer}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        gap: 5,
                    }}>
                        <View style={styles.rowContainer}>
                            <Text style={styles.titleSmallStatus}>#TK{item.id}</Text>
                            <Text style={[styles.titleSmallStatus, { flex: 1, marginStart: 24 }]}>Due: {item.dueDate}</Text>
                            <View style={[styles.itemContainerWithBg, { marginEnd: 8 }]} >
                                <Text style={[styles.titleSmallStatus, {
                                    color: priorityTextColor
                                }]}>
                                    {utils.getPriorityText(item.priority)}
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.title, { marginTop: 5 }]}>{item.title}</Text>

                        {
                            utils.isEmptyOrNull(item.assignedTo) ? (
                                <Text style={[styles.titleSmallStatus, { color: '#0255DC' }]}>
                                    Unassigned
                                </Text>
                            ) : (<Text style={[styles.titleSmallStatus, { color: '#616161' }]}>
                                Assigned: {username}
                            </Text>)
                        }
                    </View>

                    {/* {
                        item.taskPriority == 1 && (
                            <Image
                                source={require('../../assets/images/home/icon_urgent_task.png')}
                                style={styles.iconSmallest}
                            />
                        )
                    } */}

                    <Image
                        source={require('../../../assets/images/home/icon_arrow.png')}
                        style={styles.iconSmallest}
                    />
                </TouchableOpacity>
            </View>
        );
    } 

    return (
        <View style={styles.mainContainer}>
            <View style={[styles.rowHeader, { padding: 16, marginTop: 16, marginBottom: 16 }]}>
                <Text style={[styles.title500, { flex: 1 }]}>
                    Tasks
                </Text>
                <TouchableOpacity>
                    <Image
                        source={require('../../../assets/images/home/icon_filter.png')}
                        style={styles.iconSmallest}
                    />
                </TouchableOpacity>
            </View>
            <FlatList
                style={{ paddingBottom: 40 }}
                data={task}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
            <FloatingButtonAdd
                onPress={handleAddPress}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    card: {
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 8,
        backgroundColor: '#fff',
        borderRadius: 4,
        elevation: 2, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
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
        backgroundColor: '#FDF3F4', // Background color applied to the wrapper
        paddingTop: 4,
        paddingBottom: 4,
        paddingStart: 8,
        paddingEnd: 8,
        borderRadius: 5, // Optional: Add rounded corners to the background
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
    titleSmall: {
        fontSize: 14,
        fontWeight: '500'
    },
    titleSmall600: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'right'
    },
    titleSmallStatus: {
        color: '#616161',
        fontSize: 14,
        fontWeight: '400',
    },
    iconMedium: {
        width: 40, // Adjust icon size as needed
        height: 40,
        marginEnd: 8,
    },
    iconSmall: {
        width: 32, // Adjust icon size as needed
        height: 32,
        marginEnd: 8
    },
    iconSmallest: {
        width: 24, // Adjust icon size as needed
        height: 24
    },
});

export default Task;
