import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const LandingScreenGrid = ({ gridItems, itemSelected, columns = 2 }) => {
    //const numColumns = 2; // You can change this to any number of columns
    // GridItemCard Component
    const GridItemCard = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => itemSelected(item, index)}
                style={styles.gridItemContainer}>
                <View style={styles.gridItemCardContainer}>
                    <Image
                        source={item.image} // Replace with the correct path to your local image
                        style={{ width: '50', height: 50 }}
                    />
                </View>
                <Text style={[styles.taskTitle, {
                    color: '#242424', marginTop: 16, marginStart: 4,
                    marginEnd: 4, textAlign: 'center'
                }]}>
                    {item.title}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            data={gridItems}
            numColumns={columns}
            renderItem={GridItemCard}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.gridContainer}
        />
    );
};

const TaskReportStatus = ({ gridItems, itemSelected, columns = 2 }) => {
    //const numColumns = 2; // You can change this to any number of columns
    // GridItemCard Component
    const GridItemCard = ({ item, index }) => {
        return (
            <TouchableOpacity
                //onPress={() => itemSelected(item, index)}
                style={[styles.taskGridItem, { backgroundColor: item.bgColor }]}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskTitleBig}>{item.taskCount}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            data={gridItems}
            numColumns={columns}
            renderItem={GridItemCard}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.gridContainer}
        />
    );
};

const TrainingMatrics = ({ gridItems, itemSelected, columns = 3 }) => {
    //const numColumns = 2; // You can change this to any number of columns
    // GridItemCard Component
    const GridItemCard = ({ item, index }) => {
        return (
            <TouchableOpacity
                //onPress={() => itemSelected(item, index)}
                style={[styles.taskGridItem, { flexDirection: 'column', backgroundColor: item.bgColor }]}>
                <Text style={[styles.taskTitle, { marginTop: 0, marginBottom: 12 }]}>{item.title}</Text>
                <Text style={styles.taskTitleBig}>{item.taskCount}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            data={gridItems}
            numColumns={columns}
            renderItem={GridItemCard}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.gridContainer}
        />
    );
};

const styles = StyleSheet.create({
    taskTitle: {
        color: "#3D3E78",
        fontSize: 14,
        marginTop: 4,
        fontWeight: 400
    },
    taskTitleBig: {
        color: "#242424",
        fontSize: 26,
        fontWeight: 700
    },
    gridContainer: {
        paddingHorizontal: 8,
        paddingVertical: 8,
        flex: 1,
    },
    taskGridItem: {
        flex: 1,
        flexDirection: "row",
        margin: 8,
        padding: 10,
        borderRadius: 4,
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    gridItemContainer: {
        flex: 1,
        flexDirection: 'column',
        margin: 8,
        backgroundColor: '#fff',
        borderRadius: 4,
        alignItems: 'center',
    },
    gridItemCardContainer: {
        width: '100%',
        height: 110,
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px -0.1px 2px rgba(0, 0, 0, 0.1)',
    },
    gridItemText: {
        padding: 8,
        fontSize: 16,
        fontWeight: "400",
    },
});

export { LandingScreenGrid, TaskReportStatus, TrainingMatrics }