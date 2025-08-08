import { React, useState, useEffect } from 'react';
import { View, Text, Image, Modal, FlatList, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Toolbar } from '../../../components/nrf_app/Toolbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { TrainingStatus, TrainingType } from '../../../utils/AppConstants';
import Utils from '../../../utils/Utils';
import { getUserPicByEmail } from '../../../utils/DummyData';
import { setReloadTrainingData } from '../../../utils/LocalStorage';

const mockAssignees = [
    { id: 4, name: 'Customer Service Excellence', image: 'https://via.placeholder.com/24', email: 'John.Smith@htlbeta.onmicrosoft.com' },
    { id: 5, name: 'Product Knowledge', image: 'https://via.placeholder.com/24', email: 'Robert.Williams@htlbeta.onmicrosoft.com' },
    { id: 6, name: 'Cash Handling and POS Operations', image: 'https://via.placeholder.com/24', email: 'Robert.Williams@htlbeta.onmicrosoft.com' },
];

const AddTraining = () => {
    const utils = new Utils()
    const navigate = useNavigate();
    const location = useLocation();

    const jsonArrayID = [];

    const userTraining = location.state || [];
    console.log('userTraining:', userTraining)
    const trainingsCount = userTraining.trainings.length
    const completedTrainingsCount = userTraining.trainings.filter(training => training.completionStatus
        === TrainingStatus.COMPLETED).length

    const weeklyTrainings = userTraining.trainings.filter(training => training.trainingType
        === TrainingType.WEEKLY)
    const assingedTrainings = userTraining.trainings.filter(training => training.trainingType
        !== TrainingType.WEEKLY)

    console.log('weeklyTrainings: ', weeklyTrainings)
    console.log('assingedTrainings: ', assingedTrainings)

    const [assignees, setAssignees] = useState([]); // Selected assignees
    const [isModalVisible, setModalVisible] = useState(false);

    const [resourceData, setResourceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    //const videoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4'; // Example video URL
    //const videoUrl = 'https://htlbeta.sharepoint.com/sites/SuperAppDemoSite/_layouts/15/embed.aspx?uniqueId=3556bbad-8fd1-47fc-8995-bb53e6c63b1b&access_token=v1.eyJzaXRlaWQiOiJkZGIzNmYwNi0xYjhiLTRjYjQtYjNmMi0yYzFhMjM0NzQxMDUiLCJhcHBfZGlzcGxheW5hbWUiOiJBcHAgU2VydmljZSIsImFwcGlkIjoiN2FiNzg2MmMtNGM1Ny00OTFlLThhNDUtZDUyYTdlMDIzOTgzIiwiYXVkIjoiMDAwMDAwMDMtMDAwMC0wZmYxLWNlMDAtMDAwMDAwMDAwMDAwL2h0bGJldGEuc2hhcmVwb2ludC5jb21AYzRhM2I5MmItNzRlYi00NzNlLTk5YTEtMzJkMDNlMGU0NjMyIiwiZXhwIjoiMTczMzkwMjA0NiJ9.CgoKBHNuaWQSAjg5EgsImNXZjtPvzD0QBRoPMTA0LjIxMS4xNDYuMjI0Kix2amtzeHZnaHUrUEQ0Q0UvNHJidSttOVcvRWpxNlhOdC9lWEdFK3g1aXVJPTB6OAFCEKFsbF2hcABAPTzgg74ceRtKEGhhc2hlZHByb29mdG9rZW5yKTBoLmZ8bWVtYmVyc2hpcHwxMDAzMjAwMjAxNzViYjMxQGxpdmUuY29tegEyggESCSu5o8TrdD5HEZmhMtA-DkYykgEJUHJhdGhlZXNomgEFRGV2YW6iASdwcmF0aGVlc2guZGV2YW5AaHRsYmV0YS5vbm1pY3Jvc29mdC5jb22qARAxMDAzMjAwMjAxNzVCQjMxsgHWA2FsbGZpbGVzLndyaXRlIGFsbHNpdGVzLmZ1bGxjb250cm9sIGFsbHNpdGVzLnJlYWQgZ3JvdXAud3JpdGUgc2hhcmVwb2ludHRlbmFudHNldHRpbmdzLnJlYWR3cml0ZS5hbGwgY29udGFpbmVyLnNlbGVjdGVkIGRhc2hib2FyZGNhcmQuc2VuZC5hcHAgY29udGFpbmVyLm1hbmFnZS5hbGwgY29udGFpbmVyLm1hbmFnZS5hbGwgQWRtaW5pc3RyYXRpdmUuTWFuYWdlIEFkbWluaXN0cmF0aXZlLlJlYWQgQmFzaWNQcm9qZWN0QWxsLlJlYWQgQmFzaWNQcm9qZWN0QWxsLldyaXRlIEVudGVycHJpc2VSZXNvdXJjZXMuUmVhZCBFbnRlcnByaXNlUmVzb3VyY2VzLldyaXRlIEVudGVycHJpc2VSZXNvdXJjZXMuQnlwYXNzRGVsZWdhdGUgU3RhdHVzaW5nLlN1Ym1pdFN0YXR1cyBSZXBvcnRpbmcuUmVhZCBmYXN0U2VhcmNoLnF1ZXJ5c3AgYWxscHJvZmlsZXMuZnVsbGNvbnRyb2wgYWxscHJvZmlsZXMud3JpdGUgdGVybXN0b3JlLndyaXRlyAEB.Gv_fUbTORZ7hxVizLcSvPCF3SLm7WeHlMu5tuaCF5VM'

    // Function to fetch ResourceUrl
    const submitAssingedTrainings = async () => {
        try {
            // const responseData = await assignTrainingData(userTraining.email, jsonArrayID); // Fetch data using the API utility
            // if (responseData) {
            //   setResourceData(responseData);
            //   setReloadTrainingData(true)
            //   setLoading(false);
            // }
            setReloadTrainingData(true)
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch data from getResourceUrl API');
            setLoading(false);
        }
    };

    // Handle Resource click
    const handleTrainingItemClick = (item, index) => {
        //navigate("/viewResource", { state: item.id })
    };

    const handleCloseAssignModal = () => {
        setAssignees([]);
        setModalVisible(false);
    };

    const handleOpenAssignModal = () => {
        setModalVisible(true);
    };

    const handleAssign = async (selectedAssignees) => {
        setAssignees(selectedAssignees);
        console.log('selectedAssignees: ', selectedAssignees)
        if (selectedAssignees.length > 0) {
            //taskData.assignee = selectedAssignees[0].email;
            // Create an array with numbers from 1 to 10

            console.log('selectedAssignees ID : ', selectedAssignees[0].id)
            jsonArrayID.push({
                id: selectedAssignees[0].id
            });
            //console.log('selectedAssignees IDs: ', selectedAssignees[0].name)
            // for (let i = 0; i <= selectedAssignees.length; i++) {
            //     // jsonArray.push({
            //     //     id: selectedAssignees[i].name
            //     // });

            //     console.log('selectedAssignees fori: ', selectedAssignees[i])
            // }
        }
        setModalVisible(false);

        console.log('selectedAssignees jsonArray ID: ', jsonArrayID)
        setLoading(true)
        await submitAssingedTrainings();
        navigate(-1)
    };

    const renderTrainingItem = ({ item, index }) => (
        <View style={styles.itemContainer}>
            <TouchableOpacity
                // onPress={() => handleLearningClick(item, index)}
                style={[styles.rowContainer, { paddingStart: 16, paddingEnd: 16 }]}>
                <Text style={[styles.title, { flex: 1 }]}>{item.title}</Text>
                {item.trainingType === TrainingType.WEEKLY &&
                    <Image
                        source={require('../../../assets/images/task/icon_green_check.png')}
                        style={styles.iconSmallest}
                    />
                }
            </TouchableOpacity>
        </View >
    );

    if (loading) {
        return (
            <View style={{
                width: '100%', height: '100%',
                justifyContent: "center", alignItems: "center"
            }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{
                width: '100%', height: '100%',
                justifyContent: "center", alignItems: "center"
            }}>
                <Text>{error}</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <Toolbar
                title={'Training'}
            />
            {/* User Detail View */}
            <View style={[styles.rowContainer, {
                paddingStart: 16, paddingEnd: 16,
                paddingTop: 32, paddingBottom: 32
            }]}>
                <Image
                    source={getUserPicByEmail(userTraining.email)}
                    style={styles.iconProfile}
                />
                <View style={{ flex: 1, marginStart: 16 }}>
                    <Text style={styles.title}>
                        {userTraining.name}
                    </Text>
                    <Text style={styles.subTitle}>
                        {userTraining.rewardPoints} Reward
                    </Text>
                </View>
                <View style={[styles.rowContainer, { alignSelf: 'flex-start' }]}>
                    <Text style={[styles.title, { color: '#616161', marginEnd: 4, marginBottom: 3 }]}>
                        {completedTrainingsCount}/{trainingsCount}
                    </Text>
                </View>
            </View>

            <View style={[styles.rowContainer, {
                backgroundColor: '#F5F5F5', padding: 16
            }]}>
                <Text style={[styles.title, { flex: 1, fontWeight: 500, marginEnd: 10 }]}>
                    Weekly Training
                </Text>

                {/* <Text style={[styles.titleSmall500, { color: '#5B57C7', marginEnd: 10 }]}>
                    2 Nov 2024
                </Text>
                <Image
                    source={require('../../../assets/images/home/icon_calender.png')}
                    style={styles.iconSmallest}
                /> */}
            </View>
            <FlatList
                data={weeklyTrainings}
                renderItem={renderTrainingItem}
                keyExtractor={(item) => item.id}
            />

            <View style={[styles.rowContainer, {
                backgroundColor: '#F5F5F5', padding: 16
            }]}>
                <Text style={[styles.title, { flex: 1, fontWeight: 500, marginEnd: 10 }]}>
                    Assigned Training
                </Text>

                {/* <Text style={[styles.titleSmall500, { color: '#5B57C7', marginEnd: 10 }]}>
                    2 Nov 2024
                </Text>
                <Image
                    source={require('../../../assets/images/home/icon_calender.png')}
                    style={styles.iconSmallest}
                /> */}
            </View>
            <FlatList
                data={assingedTrainings}
                renderItem={renderTrainingItem}
                keyExtractor={(item) => item.id}
            />
            <TouchableOpacity
                onPress={handleOpenAssignModal}
                style={[styles.rowContainer, { padding: 16 }]}
            >
                <Image
                    source={require('../../../assets/images/task/icon_add.png')}
                    style={styles.iconSmallest}
                />
                <Text style={{
                    flex: 1, fontSize: 14, marginStart: 12, marginBottom: 2,
                    fontWeight: 500, color: '#5B57C7'
                }}>
                    Add Training
                </Text>
            </TouchableOpacity>

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={handleCloseAssignModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.dropdownModal}>
                        <Text style={styles.modalTitle}>Assign Training</Text>
                        <FlatList
                            data={mockAssignees}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.assigneeOption}
                                    onPress={() => {
                                        if (assignees.find((assignee) => assignee.id === item.id)) {
                                            setAssignees((prev) =>
                                                prev.filter((assignee) => assignee.id !== item.id)
                                            );
                                        } else {
                                            setAssignees((prev) => [...prev, item]);
                                        }
                                    }}
                                >
                                    <View style={styles.checkbox}>
                                        {assignees.find((assignee) => assignee.id === item.id) && (
                                            <View style={styles.checked} />
                                        )}
                                    </View>
                                    <Text style={styles.assigneeOptionText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <View style={styles.modalFooter}>
                            <TouchableOpacity style={styles.cancelButton} onPress={handleCloseAssignModal}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.assignButton} onPress={() => handleAssign(assignees)}>
                                <Text style={styles.buttonText}>Assign</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
        // borderBottomWidth: 0.5,
        // borderBottomColor: '#E0E0E0',
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



    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    dropdownModal: {
        height: '80%', // Covers 80% of the screen height
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    assigneeOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checked: {
        width: 14,
        height: 14,
        backgroundColor: '#6200ee',
    },
    assigneeOptionText: {
        fontSize: 16,
        color: '#333',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        alignItems: 'center'
    },
    cancelButton: {
        //   backgroundColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
});

export default AddTraining;
