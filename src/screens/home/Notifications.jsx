import { React, useEffect, useState } from 'react';
import {
    View, Text, ActivityIndicator, StyleSheet, TouchableOpacity,
    FlatList, Image, ScrollView
} from 'react-native';
import { Toolbar } from '../../components/nrf_app/Toolbar';
import { KEY, getData } from '../../utils/LocalStorage';
import { UserRole } from '../../utils/AppConstants';

const managerNoti = [
    {
        title: "Reminder: To review supplier contracts",
        time: 'Now',
        icon: require("../../assets/images/home/icon_noti_alert.png"),
    },
    {
        title: "PO was created successfully - Ref# 20241211",
        time: '2 mins ago',
        icon: require("../../assets/images/home/icon_noti_alert.png"),
    },
    {
        title: "A customer has requested assistance with a high-value purchase in the electronics section. John has been reassigned to assist",
        time: '10:15 AM',
        icon: require("../../assets/images/home/icon_noti_news.png"),
    },
];

const associateNoti = [
    {
        title: "A customer has requested assistance with a high-value purchase in the electronics section. John has been reassigned to assist",
        time: '10:15 AM',
        icon: require("../../assets/images/home/icon_noti_news.png"),
    },
];

const yestNoti = [
    {
        title: "Reminder: It's time for your scheduled lunch break. Please clock out and back in using the mobile app.",
        time: '1:00 PM',
        icon: require("../../assets/images/home/icon_noti_alert.png"),
    },
    {
        title: "Inventory levels for the new product are lower than expected. Please check for any discrepancies and restock as needed.",
        time: '11:30 AM',
        icon: require("../../assets/images/home/icon_noti_alert.png"),
    },
];

const Notifications = () => {
    const [notificationData, setNotificationData] = useState(managerNoti);

    // Function to fetch ResourceUrl
    useEffect(() => {
        const fetchStoredData = async () => {
            try {
                //const value = await AsyncStorage.getItem('@storage_Key');
                const role = await getData(KEY.USER_ROLE)
                const notificationArray = role === UserRole.MANAGER ? managerNoti : associateNoti;
                setNotificationData(notificationArray);
            } catch (e) {
                console.error('Failed to fetch the data from AsyncStorage:', e);
            }
        };
        fetchStoredData();
    }, []);

    const renderNotiItem = ({ item, index }) => {
        return (
            <View style={styles.itemContainer}>
                <TouchableOpacity
                    style={styles.rowContainer}>
                    <Image
                        source={item.icon}
                        style={styles.iconProfile}
                    />
                    <View style={{ flex: 1, marginStart: 16 }}>
                        <Text style={styles.title}>
                            {item.title}
                        </Text>
                        <Text style={[styles.subTitle, { marginTop: 4 }]}>
                            {item.time}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, width: '100%', height: '100%' }}>
            <Toolbar
                title={'Notifications'}
                showBot={false}
            />
            <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={[styles.rowContainer, {
                    backgroundColor: '#F5F5F5', padding: 16
                }]}>
                    <Text style={[styles.title, { flex: 1, fontWeight: 500, marginEnd: 10 }]}>
                        Today
                    </Text>
                </View>
                {/* <Image
                source={require('../../assets/images/report/icon_today.png')}
                style={{ width: '100%', height: '90' }}
            /> */}
                <FlatList
                    data={notificationData}
                    renderItem={renderNotiItem}
                    keyExtractor={(item) => item.id}
                />
                <View style={[styles.rowContainer, {
                    backgroundColor: '#F5F5F5', padding: 16
                }]}>
                    <Text style={[styles.title, { flex: 1, fontWeight: 500, marginEnd: 10 }]}>
                        Yesterday
                    </Text>
                </View>
                <FlatList
                    data={yestNoti}
                    renderItem={renderNotiItem}
                    keyExtractor={(item) => item.id}
                />
                {/* <Image
                source={require('../../assets/images/report/icon_yest.png')}
                style={{ width: '100%', height: '90' }}
            /> */}
            </ScrollView>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    video: {
        width: '100%',
        height: 'auto',
    },
    iframe: {
        border: 'none',
        width: '100%',
        height: '100%',
    },

    itemContainer: {
        paddingTop: 20,
        paddingBottom: 20,
        marginStart: 16,
        marginEnd: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#E0E0E0',
    },
    itemContainerWithBg: {
        backgroundColor: '#CFE4FA', // Background color applied to the wrapper
        paddingTop: 4,
        paddingBottom: 4,
        paddingStart: 8,
        paddingEnd: 8,
        borderRadius: 5, // Optional: Add rounded corners to the background
    },

    iconProfile: {
        width: 40, // Adjust icon size as needed
        height: 40,
    },
    title: {
        fontSize: 16,
        fontWeight: '400',
        color: '#242424'
    },
    subTitle: {
        fontSize: 14,
        fontWeight: '400',
        color: '#616161'
    },
});

export default Notifications;
