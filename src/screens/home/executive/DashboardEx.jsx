import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Linking } from 'react-native';
import { Card, AnnouncementCard, WorkdayCard, StoreLayoutCard } from "../../../components/nrf_app/Card";
import { useNavigate } from "react-router-dom";
import Utils from "../../../utils/Utils";
import { TaskReportStatus } from '../../../components/nrf_app/GridView';
import { TaskPriority, TaskStatus } from '../../../utils/AppConstants';

// Icons from Assets 
import ShiftIcon from "../../../assets/images/home/icon_shift.png"
import WorkdayIcon from "../../../assets/images/home/icon_workday.png"
import StoreLayoutImg from "../../../assets/images/home/img_store_layout.png"
import ReportIcon from "../../../assets/images/home/icon_report.png"
import TrainingIcon from "../../../assets/images/home/icon_book.png"
import ViewMoreIcon from "../../../assets/images/task/icon_viewmore.png"
import ViewLessIcon from "../../../assets/images/task/icon_viewless.png"

const recommTasks = [
    {
        title: "Curbside Fulfillment"
    },
    {
        title: "Product Rotation"
    },
    {
        title: "Cart Retrieval"
    }
];
// Announcements - Associate

// "Your shift schedule for next week is updated. Please check."
// "Reminder: Mandatory customer service training tomorrow at 10 AM."
// "New inventory in. Restock electronics section by end of day."

// Announcements - Manager

// "New health and safety regulations implemented. Review updated policies in the app."
// "Scheduled POS maintenance tonight from 10 PM to 2 AM. Complete transactions before downtime."
// "Special holiday sale starts next week. Review promotional materials and prepare your team."

const announcementList = [
    {
        title: "New health and safety regulations implemented. Review updated policies in the app."
    },
    {
        title: "Scheduled POS maintenance tonight from 10 PM to 2 AM. Complete transactions before downtime."
    },
    {
        title: "Special holiday sale starts next week. Review promotional materials and prepare your team."
    }
];

const Dashboard = ({ changeTab, dashboardModel }) => {
    const navigate = useNavigate();
    const utils = new Utils();

    const [isViewMoreVisible, setIsViewMoreVisible] = useState(false);
    const [viewMoreIcon, setViewMoreIcon] = useState(ViewMoreIcon);
    const [viewMoreText, setViewMoreText] = useState('View More');

    const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
    const [currentAnnoucementIndex, setcurrentAnnoucementIndex] = useState(0);
    const [isPreviousDisabled, setIsPreviousDisabled] = useState(true);
    const [isNextDisabled, setIsNextDisabled] = useState(false);
    const [announcementCountStr, setAnnouncementCountStr] = useState('');
    const announCount = announcementList.length

    // Parsing API data
    let urgentTaskCount = 0
    let inProgressTaskCount = 0
    let completedTaskCount = 0
    let overDueTaskCount = 0
    const tasks = dashboardModel.task
    if (Array.isArray(tasks)) {
        urgentTaskCount = tasks.filter(task => task.priority === TaskPriority.URGENT).length
        inProgressTaskCount = tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length
        completedTaskCount = tasks.filter(task => task.status === TaskStatus.COMPLETED).length
        //overDueTaskCount = tasks.filter(task => utils.isOverdue(task.dueDate)).length
        overDueTaskCount = tasks.filter(task => task.status === TaskStatus.YET_TO_START).length
    }

    const taskGridItems = [
        {
            title: "Urgent",
            taskCount: urgentTaskCount,
            bgColor: "#FBEDED"
        },
        {
            title: "Yet To Start",
            taskCount: overDueTaskCount,
            bgColor: "#E7F3F9"
        },
        {
            title: "In Progress",
            taskCount: inProgressTaskCount,
            bgColor: "#F8F0E2"
        },
        {
            title: "Completed",
            taskCount: completedTaskCount,
            bgColor: "#E6F7EE"
        },
    ];

    // // Function to handle when the app is paused (backgrounded)
    // function handleVisibilityChange() {
    //   if (document.hidden) {
    //     // App is in the background (paused)
    //     console.log('App is paused (backgrounded)');
    //     // Perform actions like pausing a video, stopping timers, etc.
    //     // Optionally, you can send background data to the server or save the app state.
    //   } else {
    //     // App is in the foreground (active)
    //     console.log(`App is resumed (foreground) ${isScanClicked}`);
    //     // You might want to reload data or restart any paused tasks.
    //     if (isScanClicked) {
    //       openDialog()
    //     }
    //   }
    // }

    // // Register the event listener for visibility change
    // document.addEventListener('visibilitychange', handleVisibilityChange, false);

    const handleTaskPress = () => {
        //console.log('Pressed:');
        //Alert.alert('You pressed');
        changeTab(1);
        //navigate("/training")
        //navigate("/taskdetails")
    };

    const handleTrainingPress = () => {
        changeTab(2);
    };
    const handleReportsPress = () => {
        navigate('/report')
    };

    const handleWorkdayPress = () => {
        const url = 'https://wd3.myworkday.com/wday/authgwy/harman/login.htmld?returnTo=%2fharman%2fd%2fhome.htmld';
        //navigate("/openWebview", { state: url })
        Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
        //TeamsSDK.openDeepLink(url)
        //window.location.href = url;
    };

    const handleShiftPress = () => {
        const url = 'msteams://teams.microsoft.com/l/app/42f6c1da-a241-483a-a3cc-4f5be9185951?tenantId=c4a3b92b-74eb-473e-99a1-32d03e0e4632&openInMeeting=true';
        Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
        //TeamsSDK.openDeepLink(url)
        //window.location.href = url;
    };

    // Effect to detect when the isViewMoreVisible state changes
    useEffect(() => {
        setViewMoreIcon(isViewMoreVisible ? ViewLessIcon : ViewMoreIcon)
        setViewMoreText(isViewMoreVisible ? 'View Less' : 'View More')
    }, [isViewMoreVisible]); // This will run whenever `isVisible` changes
    const handleViewMorePress = () => {
        // Using !isViewMoreVisible based on the current change value as setIsViewMoreVisible takes some time to refect the value
        // setViewMoreIcon(!isViewMoreVisible ? ViewLessIcon : ViewMoreIcon)
        // setViewMoreText(!isViewMoreVisible ? 'View Less' : 'View More')
        setIsViewMoreVisible(isViewMoreVisible => !isViewMoreVisible);
    };

    const handleReviewTaskPress = () => {
        navigate(`/createTask/${2}`);
    };
    const handleRegenerateTaskPress = () => {

    };

    // Effect to detect when the currentAnnoucementIndex state changes
    useEffect(() => {
        const str = `${currentAnnoucementIndex + 1} of ${announCount}`
        setAnnouncementCountStr(str)
        setIsNextDisabled(currentAnnoucementIndex === announCount - 1)
        setIsPreviousDisabled(currentAnnoucementIndex === 0)
        //console.log('setAnnouncementCountStr: ', str)
        //console.log('currentAnnoucementIndex: ', currentAnnoucementIndex)
    }, [currentAnnoucementIndex]); // This will run whenever `currentAnnoucementIndex` changes
    const handleNextPress = () => {
        if (currentAnnoucementIndex < announCount - 1) {
            setcurrentAnnoucementIndex(currentAnnoucementIndex + 1)
        }
    };
    const handlePreviousPress = () => {
        if (currentAnnoucementIndex > 0) {
            setcurrentAnnoucementIndex(currentAnnoucementIndex - 1)
        }
    };

    return (
        <ScrollView>
            {isAnnouncementVisible && (
                <AnnouncementCard
                    title={announcementList[currentAnnoucementIndex].title}
                    countValue={announcementCountStr}
                    onClosePress={() => setIsAnnouncementVisible(false)}
                    onPreviousClick={handlePreviousPress}
                    onNextClick={handleNextPress}
                    isNextDisabled={isNextDisabled}
                    isPreviousDisabled={isPreviousDisabled}
                />
            )}

            <View style={{ margin: 5 }}>
                {/* Shift View */}
                <Card>
                    <View style={[styles.rowContainer, {
                        padding: 16, borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                    }]}>
                        <Image
                            source={ShiftIcon}
                            style={styles.iconSmall}
                        />
                        <Text style={[styles.titleSmall, { color: '#424242' }]}>
                            Shift
                        </Text>
                    </View>

                    <Text style={[styles.title, { fontWeight: 500, color: '#424242', paddingStart: 16, paddingTop: 16 }]}>
                        2 Clocked In
                    </Text>
                    <Text style={[styles.subTitle, { paddingStart: 16, paddingBottom: 8 }]}>
                        First shift -  8:00 AM - 5:00 PM
                    </Text>
                    <TouchableOpacity style={[styles.buttonWithMargin, { marginStart: 16, marginBottom: 16 }]}
                        onPress={handleShiftPress}>
                        <Text style={styles.buttonText}>Details</Text>
                    </TouchableOpacity>
                </Card>

                {/* Tasks View */}
                <Card>
                    <View style={[styles.rowContainer, {
                        padding: 16, borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                    }]}>
                        <Image
                            source={require('../../../assets/images/home/icon_task_list.png')}
                            style={styles.iconSmall}
                        />
                        <Text style={[styles.titleSmall, { color: '#424242' }]}>
                            Associate's Tasks
                        </Text>
                    </View>
                    <TaskReportStatus
                        gridItems={taskGridItems}
                    />
                    <TouchableOpacity style={[styles.buttonWithMargin, { marginStart: 16, marginBottom: 16 }]}
                        onPress={handleTaskPress}>
                        <Text style={styles.buttonText}>View</Text>
                    </TouchableOpacity>
                </Card>

                {/* Task Recomm View */}
                <Card>
                    <View style={[styles.rowContainer, {
                        padding: 16, borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                    }]}>
                        <Image
                            source={require('../../../assets/images/home/icon_task_recomm.png')}
                            style={styles.iconSmall}
                        />
                        <Text style={[styles.titleSmall, { color: '#424242' }]}>
                            Task Recommendation
                        </Text>
                    </View>

                    {isViewMoreVisible && (
                        <View style={{ padding: 16 }}>
                            <Text style={[styles.title, { fontWeight: 500, fontSize: 18, color: '#424242' }]}>
                                3 new identified tasks !
                            </Text>
                            <Text style={[styles.subTitle, { marginBottom: 16 }]}>
                                Report based on data collection at 9:15 AM
                            </Text>
                            <FlatList
                                data={recommTasks}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <Text style={styles.title}>{`• ${item.title}`}</Text>
                                )}
                            />
                            <View style={[styles.rowContainer, { marginTop: 16 }]}>
                                <TouchableOpacity style={styles.button}
                                    onPress={handleReviewTaskPress}>
                                    <Text style={styles.buttonText}>Review Task</Text>
                                </TouchableOpacity>
                                {/* <TouchableOpacity style={[styles.button, { marginStart: 16 }]}
                                    onPress={handleRegenerateTaskPress}>
                                    <Text style={styles.buttonText}>Regenerate</Text>
                                </TouchableOpacity> */}
                            </View>
                        </View>)}

                    <TouchableOpacity
                        onPress={handleViewMorePress}
                        style={[styles.rowContainer, { flex: 1, alignSelf: 'center', padding: 16 }]}>
                        <Image
                            source={viewMoreIcon}
                            style={styles.iconSmallest20}
                        />
                        <Text style={[styles.titleSmall, { color: '#5B57C7', marginStart: 8, marginTop: -2 }]}>
                            {viewMoreText}
                        </Text>
                    </TouchableOpacity>
                </Card>

                {/* Reports/Training View */}
                <View style={styles.cardsContainer}>
                    <WorkdayCard
                        icon={ReportIcon}
                        title={"Reports"}
                        subtitle={"Click to view the monthly report"}
                        onPress={handleReportsPress}
                    />
                    <WorkdayCard
                        icon={TrainingIcon}
                        title={"Training"}
                        subtitle={"Assign weekly training to staff"}
                        onPress={handleTrainingPress}
                        buttonTitle={"Assign"}
                    />
                </View>

                {/* Shift/Workday View */}
                <View style={styles.cardsContainer}>
                    {/* <WorkdayCard
                            icon={ShiftIcon}
                            title={"Shift Management"}
                            subtitle={"You are on the clock!"}
                            onPress={handleShiftPress}
                        /> */}
                    <WorkdayCard
                        icon={WorkdayIcon}
                        title={"Workday"}
                        subtitle={"You have a new payslip. Have a look!"}
                        onPress={handleWorkdayPress}
                    />
                    <StoreLayoutCard
                        image={StoreLayoutImg}
                        onPress={() => { navigate('/map2d') }}
                    />
                </View>

                {/* Store Layout View */}
                {/* <Card style={{ padding: 16 }}>
                        <View style={styles.rowContainer}>
                            <Image
                                source={require('../../../assets/images/home/icon_store_map.png')}
                                style={styles.iconMedium}
                            />
                            <Text style={[styles.title, { marginStart: 10 }]}>
                                Store Layout
                            </Text>
                            <View style={{ flex: 1 }} >
                                <TouchableOpacity style={[styles.button, { alignSelf: 'flex-end' }]}>
                                    <Text style={styles.buttonText}>Map</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Card> */}
            </View>
        </ScrollView >
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
    cardsContainer: {
        flexDirection: 'row',       // Align cards horizontally
        justifyContent: 'space-between', // Space between cards
        // Wrap cards to next line if necessary
    },
    taskTitleView: {
        flexDirection: 'row',       // Align cards horizontally
        justifyContent: 'space-between', // Space between cards
        // Wrap cards to next line if necessary
    },
    title: {
        fontSize: 16,
        fontWeight: '400',
    },
    subTitle: {
        fontSize: 14,
        fontWeight: '400',
        color: '#424242'
    },
    titleSmall: {
        fontSize: 14,
        fontWeight: '500'
    },
    titleSmall2: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'right'
    },
    titleSmallStatus: {
        color: '#BC4B09',
        fontSize: 14,
        fontWeight: '400',
        textAlign: 'right'
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
        height: 24,
        marginEnd: 8
    },

    iconSmallest20: {
        width: 20, // Adjust icon size as needed
        height: 20
    },
    button: {
        //backgroundColor: '#007BFF', // Button background color
        borderWidth: 1.5, // Sets border thickness
        borderColor: '#5B57C7', // Border color
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 4, // Adjust this value for more or less rounding
        alignSelf: 'flex-start', // Align to the start of the card
    },
    buttonWithMargin: {
        //backgroundColor: '#007BFF', // Button background color
        borderWidth: 1.5, // Sets border thickness
        borderColor: '#5B57C7', // Border color
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 4, // Adjust this value for more or less rounding
        alignSelf: 'flex-start', // Align to the start of the card
        marginTop: 16, // Add some space above the button
    },
    buttonText: {
        color: '#5B57C7', // Text color
        fontSize: 14,
        fontWeight: '500'
    }
});

export default Dashboard;
