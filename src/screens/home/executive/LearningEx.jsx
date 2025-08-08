import { React, useEffect, useState } from 'react';
import { FlatList, Text, View, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigate } from "react-router-dom";
import { Card } from '../../../components/nrf_app/Card';
import { TrainingMatrics } from '../../../components/nrf_app/GridView';
import { TrainingStatus } from '../../../utils/AppConstants';
import Utils from '../../../utils/Utils';
import { getData, getJsonData, getReloadTrainingData, KEY, saveJsonData, setReloadTrainingData } from '../../../utils/LocalStorage';

const Learning = ({ learning }) => {
    const navigate = useNavigate();
    const utils = new Utils();

    const [needsCoachingCount, setNeedsCoachingCount] = useState(0);
    const [inProgressCount, setInProgressCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [trainingData, setTrainingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [weeklyTrainingTitle, setWeeklyTrainingTitle] = useState('Hi, please select the topic you want to train in today');
    // useEffect(() => {
    //     const fetchStoredData = async () => {
    //         try {
    //             //const value = await AsyncStorage.getItem('@storage_Key');
    //             const data = await getData(KEY.USER_NAME)
    //             console.log('data: ', data)
    //             setWeeklyTrainingTitle(`Hi ${data}, please select the topic you want to train in today`)
    //             // if (value !== null) {
    //             //   setStoredValue(value); // Set the stored value if exists
    //             // }
    //         } catch (e) {
    //             console.error('Failed to fetch the data from AsyncStorage:', e);
    //         }
    //     };
    //     fetchStoredData();
    // }, []);

    // Fetch data when the component mounts
    useEffect(() => {
        // Function to fetch DashboardDetails
        const fetchDashboardDetails = async () => {
            try {
                //const value = await AsyncStorage.getItem('@storage_Key');
                const data = await getData(KEY.USER_NAME)
                console.log('data: ', data)
                setWeeklyTrainingTitle(`Hi ${data}, please select the topic you want to train in today`)

                let responseData = null;
                if (getReloadTrainingData()) {
                    // TODO: Replace with Microsoft Graph or appropriate data source
                    // responseData = await getDashboardDetails(1); // Fetch data using the API utility
                    responseData = {}; // Placeholder empty object
                    saveJsonData(KEY.API_TRAINING, responseData)
                    setReloadTrainingData(false)
                } else {
                    responseData = await getJsonData(KEY.API_TRAINING); // Fetch data using the API utility
                }
                setTrainingData(responseData)
                // Parsing API data
                const trainings = responseData.learning?.associateTraining || [];
                if (Array.isArray(trainings)) {
                    //urgentTaskCount = tasks.filter(task => task.priority === TaskPriority.URGENT).length
                    setInProgressCount(trainings.filter(training => training.completionStatus === TrainingStatus.IN_PROGRESS).length)
                    setCompletedCount(trainings.filter(training => training.completionStatus === TrainingStatus.COMPLETED).length)
                }
                setLoading(false);
            } catch (error) {
                //setError('Failed to fetch data, please try again.');
                setLoading(false);
            }
        };
        fetchDashboardDetails();
    }, []);  // Empty array means this effect runs only once after the first render


    const taskGridItems = [
        {
            title: "In Complete",
            taskCount: inProgressCount,
            bgColor: "#FBEDED"
        },
        {
            title: "Needs Coaching",
            taskCount: needsCoachingCount,
            bgColor: "#E7F3F9"
        },
        {
            title: "Completed",
            taskCount: completedCount,
            bgColor: "#F8F0E2"
        },
    ];

    // Handle View Training List click
    const handleViewTrainingClick = () => {
        navigate("/trainingList", { state: trainingData.learning.associateTraining })
    };

    // Handle Learning click
    const handleLearningClick = (item, index) => {
        // if (index === 1) {
        //     navigate("/training")
        // }
        if (item.title === 'Inventory Management') {
            navigate("/training")
        }
    };

    // Handle Resource click
    const handleResourceClick = (item, index) => {
        navigate("/viewResource", { state: item.id })
    };

    // Handle View All Resource click
    const handleViewAllResourceClick = () => {
        navigate("/resourceList", { state: learning.resources })
    };

    const renderResourceItem = ({ item, index }) => (
        <View style={styles.itemContainer}>
            <TouchableOpacity
                onPress={() => handleResourceClick(item, index)}
                style={[styles.rowContainer, { paddingStart: 16, paddingEnd: 16 }]}>

                {utils.isVideoResource(item.url) ?
                    (<Image
                        source={require('../../../assets/images/home/icon_media.png')}
                        style={styles.iconSmall}
                    />) :
                    (<Image
                        source={require('../../../assets/images/home/icon_pdf.png')}
                        style={styles.iconSmall}
                    />)
                }

                <Text style={[styles.title, { flex: 1, marginStart: 8 }]}>{item.title}</Text>
                <Image
                    source={require('../../../assets/images/home/icon_arrow.png')}
                    style={styles.iconSmallest}
                />
            </TouchableOpacity>
        </View>
    );

    const renderTrainingItem = ({ item, index }) => (
        <View style={styles.itemContainer}>
            <TouchableOpacity
                onPress={() => handleLearningClick(item, index)}
                style={[styles.rowContainer, { paddingStart: 16, paddingEnd: 16 }]}>
                <Text style={[styles.title, { flex: 1 }]}>{item.title}</Text>
                <Image
                    source={require('../../../assets/images/home/icon_arrow.png')}
                    style={styles.iconSmallest}
                />
            </TouchableOpacity>
        </View >
    );

    return (
        <View style={{ margin: 8 }}>
            <Card >
                <View style={[styles.rowContainer, {
                    padding: 16, borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                }]}>
                    <Image
                        source={require('../../../assets/images/home/icon_training_matrics.png')}
                        style={styles.iconSmall}
                    />
                    <Text style={[styles.titleSmall, { color: '#616161' }]}>
                        Associates training metrics
                    </Text>
                </View>


                <View>
                    <TrainingMatrics
                        gridItems={taskGridItems}
                        columns={3}
                    />
                    {loading ?
                        <View style={{
                            padding: 16,
                            marginStart:4,
                            justifyContent: "flex-start", alignItems: "flex-start"
                        }}>
                            <ActivityIndicator size="small" color="#0000ff" />
                        </View> :
                        <TouchableOpacity
                            onPress={handleViewTrainingClick}
                            style={[styles.buttonWithMargin, { marginStart: 16, marginBottom: 16 }]}>
                            <Text style={styles.buttonText}>View</Text>
                        </TouchableOpacity>}
                </View>
            </Card>

            <Card style={{ marginTop: 8 }}>
                <View style={[styles.rowContainer, {
                    padding: 16, borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                }]}>
                    <Image
                        source={require('../../../assets/images/home/icon_book.png')}
                        style={styles.iconSmall}
                    />
                    <Text style={[styles.titleSmall, { flex: 1, color: '#616161' }]}>
                        Weekly Training
                    </Text>
                    {/* <View style={styles.itemContainerWithBg} >
                        <Text style={[styles.titleSmall, { color: '#0F548C' }]}>
                            Reward Points - {learning.rewardPoints}
                        </Text>
                    </View> */}
                </View>
                <Text style={[styles.title, { padding: 16 }]}>
                    {weeklyTrainingTitle}
                </Text>
                <FlatList
                    data={learning.weeklyTraining}
                    renderItem={renderTrainingItem}
                    keyExtractor={(item) => item.id}
                />
            </Card>

            <Card style={{ marginTop: 8 }}>
                <View style={[styles.rowContainer, {
                    padding: 16, borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                }]}>
                    <Image
                        source={require('../../../assets/images/home/icon_resources.png')}
                        style={styles.iconSmall}
                    />
                    <Text style={[styles.titleSmall, { color: '#616161' }]}>
                        Resources
                    </Text>
                </View>
                <FlatList
                    data={learning.resources}
                    renderItem={renderResourceItem}
                    keyExtractor={(item) => item.id}
                />
                <TouchableOpacity
                    onPress={handleViewAllResourceClick}
                    style={[styles.buttonWithMargin, { marginStart: 16, marginBottom: 16 }]}>
                    <Text style={styles.buttonText}>View All</Text>
                </TouchableOpacity>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemContainer: {
        paddingTop: 16,
        paddingBottom: 16,
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
    title: {
        fontSize: 16,
        fontWeight: '400',
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

export default Learning;
