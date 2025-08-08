import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, Image, Alert, TouchableOpacity, Linking } from 'react-native';
import { Dialog, DialogType, DialogFooter, PrimaryButton, DefaultButton } from '@fluentui/react';
import { Card, AnnouncementCard, WorkdayCard, StoreLayoutCard } from "../../components/nrf_app/Card";
import { useNavigate } from "react-router-dom";
import Utils from "../../utils/Utils";
import ShiftIcon from "../../assets/images/home/icon_shift.png"
import WorkdayIcon from "../../assets/images/home/icon_workday.png"
import StoreLayoutImg from "../../assets/images/home/img_store_layout.png"
import { useMsal } from "@azure/msal-react";
import { getTodoTasks } from "../../graph";
import { ActivityIndicator } from 'react-native';

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

const Dashboard = ({ changeTab }) => {
  const navigate = useNavigate();
  const { instance, accounts } = useMsal();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isScanClicked, setIsScanClicked] = useState(false);

  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
  const [currentAnnoucementIndex, setcurrentAnnoucementIndex] = useState(0);
  const [isPreviousDisabled, setIsPreviousDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [announcementCountStr, setAnnouncementCountStr] = useState('');
  const announCount = announcementList.length

  // --- State for dynamic tasks ---
  const [tasks, setTasks] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);

  //Parsing API data - REMOVED
  // const taskCount = dashboardModel.task.length
  // const trainingCount = dashboardModel.learning.weeklyTraining.length
  // const rewardPoints = dashboardModel.learning.rewardPoints
  // const latestTask = dashboardModel.task[0]
  // const latestTaskStatus = new Utils().getTaskStatusText(latestTask?.status)

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

  const openDialog = () => {
    console.log(`openDialog ${isScanClicked}`);
    if (isScanClicked) {
      setIsDialogVisible(isScanClicked);
    }
  };

  const closeDialog = () => {
    setIsScanClicked(false)
    setIsDialogVisible(false);

    console.log(`closeDialog ${isScanClicked}`);
  };

  const handleTaskPress = () => {
    changeTab(1);
  };

  const handleTrainingPress = () => {
    changeTab(2);
  };

  const handleWorkdayPress = () => {
    const url = 'https://wd3.myworkday.com/wday/authgwy/harman/login.htmld?returnTo=%2fharman%2fd%2fhome.htmld';
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  const handleShiftPress = () => {
    const url = 'msteams://teams.microsoft.com/l/app/42f6c1da-a241-483a-a3cc-4f5be9185951?tenantId=c4a3b92b-74eb-473e-99a1-32d03e0e4632&openInMeeting=true';
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  // Effect to fetch tasks from Microsoft Graph
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
                    setTasks(tasksResponse.value);
                }
            } catch (err) {
                console.error("Failed to fetch tasks:", err);
            }
        }
        setIsLoadingTasks(false);
    };
    fetchTasks();
  }, [accounts, instance]);

  const showAlert = () => {
    console.log('Pressed showAlert');
    Alert.alert(
      'Alert Title', // Title
      'This is an alert message', // Message
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false } // If true, tapping outside the alert won't dismiss it
    );
  };

  const openURL = async () => {
    setIsScanClicked(true)
    const url = 'https://websdk.demos.scandit.com/?_gl=1*1o3c3lj*_gcl_au*MTg5OTE4MzU4LjE3MzE1ODI5NzY.*_ga*NjUxMzIwNDY2LjE3MzE1ODI5NzA.*_ga_TXJZRPJJ0T*MTczMTU4Mjk3MC4xLjEuMTczMTU4MzMzOS41Ni4wLjA.';
    //const url = 'https://play.google.com/store/apps/details?id=com.scandit.retail&hl=en_US';  // Web URL or app's URL scheme
    //const url = 'com.scandit.retail://';
    //const url = 'scandit://';
    //const url = 'youtube://watch?v=J797hPp0uwg';
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
    // const canOpen = await Linking.canOpenURL(url);

    // if (canOpen) {
    //   Linking.openURL(url);
    // } else {
    //   Linking.openURL('https://www.youtube.com/watch?v=J797hPp0uwg'); // Open in browser if app is not installed
    // }
  };

  const NewLineExample = () => {
    return (
      <View>
        <Text>This is the first line.</Text>
        <Text>This is the second line.</Text>
        <Text>This is the third line.</Text>
      </View>
    );
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
    <View style={styles.container}>
      <Dialog
        hidden={!isDialogVisible}
        onDismiss={closeDialog}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Scanning Successful',
          subText: <View>
            <Text>1. #1001 Item 1 : $2.19</Text>
            <Text>2. #1002 Item 2 : $3.20</Text>
            <Text>3. #1003 Item 2 : $2.50</Text>
          </View>
        }}
        modalProps={{
          isBlocking: false, // Set to true to block interaction outside the dialog
          styles: {
            main: {
              bottom: 0,
              position: 'fixed',
              left: 0,
              right: 0,
              width: '100%',
              maxWidth: '100%',
              margin: 0,
              borderRadius: '20px 20px 0 0',  // Rounded corners at the top for a "bottom sheet" effect
              padding: '10px',
            }
          }, // Optional: Customize the width of the dialog
        }}
      >
        <DialogFooter>
          {/* <PrimaryButton onClick={closeDialog} text="OK" /> */}
          <DefaultButton onClick={closeDialog} text="Close" />
        </DialogFooter>
      </Dialog>

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
              Clock In Now
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
          <TaskSection tasks={tasks} isLoading={isLoadingTasks} onViewAllPress={handleTaskPress} />

          {/* Training View */}
          <Card>
            <View style={[styles.rowContainer, {
              padding: 16, borderBottomWidth: 1,
              borderBottomColor: '#E0E0E0',
            }]}>
              <Image
                source={require('../../assets/images/home/icon_book.png')}
                style={styles.iconSmall}
              />
              <Text style={[styles.titleSmall, { color: '#424242' }]}>
                Weekly Training
              </Text>
              <View style={{ flex: 1 }} >
                <Text style={[styles.titleSmall2, { color: '#424242' }]}>
                  1/5 Training
                </Text>
              </View>
            </View>
            <View style={[styles.rowContainer, { padding: 16 }]}>
              <Image
                source={require('../../assets/images/home/icon_reward.png')}
                style={styles.iconSmallest}
              />
              <Text style={styles.title}>
                Total Reward Points
              </Text>
              <View style={{ flex: 1 }} >
                <Text style={[styles.titleSmall2, { color: '#616161' }]}>
                  500
                </Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.buttonWithMargin, { marginStart: 16, marginBottom: 16 }]} onPress={handleTrainingPress}>
              <Text style={styles.buttonText}>Go to Training</Text>
            </TouchableOpacity>
          </Card>

          {/* Shift/Workday View */}
          <View style={styles.cardsContainer}>
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
                source={require('../../assets/images/home/icon_store_map.png')}
                style={styles.iconMedium}
              />
              <Text style={[styles.title, { marginStart: 10 }]}>
                Store Layout
              </Text>
              <View style={{ flex: 1 }} >
                <TouchableOpacity
                  onPress={() => { navigate('/map2d') }}
                  style={[styles.button, { alignSelf: 'flex-end' }]}>
                  <Text style={styles.buttonText}>Map</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card> */}
        </View>
      </ScrollView>
    </View>
  );
};

const TaskSection = ({ tasks, isLoading, onViewAllPress }) => {
  const firstTask = tasks[0];
  const totalTasks = tasks.length;

  const getStatusText = (status) => {
    switch (status) {
      case "notStarted": return "Not Started";
      case "inProgress": return "In Progress";
      case "completed": return "Completed";
      default: return "Not Started";
    }
  };

  return (
    <Card>
      <View style={[styles.rowContainer, {
        padding: 16, borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
      }]}>
        <Image
          source={require('../../assets/images/home/icon_task_list.png')}
          style={styles.iconSmall}
        />
        <Text style={[styles.titleSmall, { color: '#424242' }]}>
          Tasks
        </Text>
        <View style={{ flex: 1 }} >
          <Text style={[styles.titleSmall2, { color: '#424242' }]}>
            {totalTasks > 0 ? `1/${totalTasks} Task` : "0 Task"}
          </Text>
        </View>
      </View>
      {isLoading ? (
        <View style={[styles.rowContainer, { padding: 16, justifyContent: 'center' }]}><ActivityIndicator /></View>
      ) : totalTasks > 0 ? (
        <View style={[styles.rowContainer, { padding: 16 }]}>
          <Text style={styles.title}>
            {firstTask?.title}
          </Text>
          <View style={{ flex: 1 }} >
            <Text style={styles.titleSmallStatus}>
              {getStatusText(firstTask?.status)}
            </Text>
          </View>
        </View>
      ) : (
        <View style={[styles.rowContainer, { padding: 16 }]}>
          <Text style={styles.title}>No tasks found.</Text>
        </View>
      )}
      <TouchableOpacity style={[styles.buttonWithMargin, { marginStart: 16, marginBottom: 16 }]}
        onPress={onViewAllPress}>
        <Text style={styles.buttonText}>View All</Text>
      </TouchableOpacity>
    </Card>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
},
headerIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
},
headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
},
headerCount: {
    fontSize: 14,
    color: '#666',
},
taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
},
taskTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
},
taskStatus: {
    fontSize: 14,
    color: '#f5a623',
    fontWeight: '500',
},
noTasksText: {
    paddingVertical: 16,
    textAlign: 'center',
    color: '#888',
},
viewAllButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
},
viewAllButtonText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#4A90E2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
},
});

export default Dashboard;
