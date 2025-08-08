import { React } from 'react';
import { View, Text, Image, FlatList, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Toolbar } from '../../../components/nrf_app/Toolbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { TrainingStatus } from '../../../utils/AppConstants';
import Utils from '../../../utils/Utils';
import { getUserPicByEmail } from '../../../utils/DummyData';

const TrainingList = () => {
    const utils = new Utils()
    const navigate = useNavigate();
    const location = useLocation();
    const trainingList = location.state || [];

    const allCount = trainingList.length
    const completedCount = trainingList.filter(training => training.completionStatus
        === TrainingStatus.COMPLETED).length
    const inProgressCount = trainingList.filter(training => training.completionStatus
        === TrainingStatus.IN_PROGRESS).length

    const filteredList = utils.filterTrainingList(trainingList)
    // console.log('Training trainingList :', trainingList)
    // console.log('Training filteredList :', filteredList)

    // Handle Resource click
    const handleTrainingItemClick = (item, index) => {
        navigate("/addTraining", { state: item })
    };

    const renderTrainingItem = ({ item, index }) => {
        const trainingsCount = item.trainings.length
        const completedTrainings = item.trainings.filter(training => training.completionStatus
            === TrainingStatus.COMPLETED).length

        const profilePic = getUserPicByEmail(item.email)

        return (
            <View style={styles.itemContainer}>
                <TouchableOpacity
                    onPress={() => handleTrainingItemClick(item, index)}
                    style={styles.rowContainer}>
                    <Image
                        source={profilePic}
                        style={styles.iconProfile}
                    />

                    <View style={{ flex: 1, marginStart: 16 }}>
                        <Text style={styles.title}>
                            {item.name}
                        </Text>
                        <Text style={styles.subTitle}>
                            {item.rewardPoints} Reward
                        </Text>
                    </View>

                    <View style={[styles.rowContainer, { alignSelf: 'flex-start' }]}>
                        <Text style={[styles.title, { color: '#616161', marginEnd: 4, marginBottom: 3 }]}>
                            {completedTrainings}/{trainingsCount}
                        </Text>
                        <Image
                            source={require('../../../assets/images/home/icon_arrow.png')}
                            style={styles.iconSmallest}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <Toolbar
                title={'Training'}
            />
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <View style={[styles.rowContainer, { paddingStart: 16, paddingTop: 16, paddingEnd: 8 }]}>
                    <Text style={[styles.titleSmallRound,
                    { backgroundColor: '#5B57C7', color: '#fff', marginEnd: 8 }]}>
                        All ({allCount})
                    </Text>
                    <Text style={[styles.titleSmallRound, { marginEnd: 8 }]}>
                        Complete ({completedCount})
                    </Text>
                    <Text style={[styles.titleSmallRound, { marginEnd: 8 }]}>
                        In Progress ({inProgressCount})
                    </Text>
                    <Text style={[styles.titleSmallRound, { marginEnd: 8 }]}>
                        Others (0)
                    </Text>
                </View>
            </ScrollView>
            <TouchableOpacity style={[styles.rowContainer, { alignSelf: 'flex-end', padding: 16 }]}>
                <Text style={[styles.titleSmall500, { color: '#5B57C7', marginEnd: 10 }]}>
                    Jan 2025
                </Text>
                <Image
                    source={require('../../../assets/images/home/icon_calender.png')}
                    style={styles.iconSmallest}
                />
            </TouchableOpacity>
            <FlatList
                data={filteredList}
                renderItem={renderTrainingItem}
                keyExtractor={(item) => item.email}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
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
    titleSmall500: {
        fontSize: 14,
        fontWeight: '500',
        color: '#616161'
    },
    titleSmallRound: {
        fontSize: 14,
        fontWeight: '400',
        color: '#616161',
        backgroundColor: '#F1F1F1', // Background color
        borderRadius: 50,           // Round shape (half the height/width for a perfect circle)
        paddingVertical: 6,        // Vertical padding (adjust size)
        paddingHorizontal: 16,      // Horizontal padding (adjust size)
    },
    iconProfile: {
        width: 40, // Adjust icon size as needed
        height: 40,
    },
    iconSmall: {
        width: 32, // Adjust icon size as needed
        height: 32,
    },
    iconSmallest: {
        width: 24, // Adjust icon size as needed
        height: 24
    },
});

export default TrainingList;
