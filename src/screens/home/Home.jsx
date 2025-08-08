import {
    View, Text, StyleSheet, Image, ScrollView, useWindowDimensions, Dimensions,
    ActivityIndicator, TouchableOpacity, SafeAreaView
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import Dashboard from "./Dashboard";
import DashboardEx from "./executive/DashboardEx";
import Learning from "./Learning";
import LearningEx from "./executive/LearningEx"
import Task from "./Task";
import TaskEx from "./executive/TaskEx";
import { HomeTabs, UserRole } from "../../utils/AppConstants";
import { FloatingButtonAdd } from "../../components/nrf_app/FloatingButton";
import { getCurrentTabIndex, getJsonData, getReloadDashboardData, KEY, saveJsonData, setCurrentTabIndex, setReloadDashboardData, getData } from "../../utils/LocalStorage";
import dashboardJson from "../../assets/json/DashboardJson.json";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import { getTodoTaskLists, getTodoTasks } from "../../graph";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import ErrorBoundary from "../../components/ErrorBoundary";

// First screen component
function Home() {
    const { instance, accounts } = useMsal();
    // const layout = useWindowDimensions();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [index, setIndex] = useState(getCurrentTabIndex());
    const [activeTab, setActiveTab] = useState(HomeTabs.DASHBOARD); // Default to Dashboard
    // const [showFloatingButton, setShowFloatingButton] = useState(false); // State to control button visibility
    const [routes] = useState([
        { key: "first", title: "Dashboard" },
        { key: "second", title: "Task" },
        { key: "third", title: "Learning" },
    ]);

    // Fetch data when the component mounts
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const userRole = await getData(KEY.USER_ROLE);
                const data = { ...dashboardJson, userRole: userRole || UserRole.ASSOCIATE };
                setDashboardData(data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch data, please try again.');
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);  // Empty array means this effect runs only once after the first render


    if (loading || !dashboardData) {
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
                <Text>{typeof error === 'string' ? error : 'An error occurred'}</Text>
            </View>
        );
    }

    //const dashboardData = require("../../assets/json/DashboardJson.json"); // Import the JSON file
    //const dashboardDataEx = require("../../assets/json/DashboardJson.json"); // Import the JSON file

    const FirstRoute = ({ changeTab }) => (
        // <View style={{ flex: 1, flexDirection: "column" }}>
        <ScrollView>
            {dashboardData.userRole === UserRole.MANAGER ? (
                <DashboardEx changeTab={changeTab} dashboardModel={dashboardData} />
            ) : (
                <Dashboard changeTab={changeTab} dashboardModel={dashboardData} />
            )}
        </ScrollView>
        // </View>
    );

    const SecondRoute = () => (
        <ScrollView>
            <Task />
        </ScrollView>
    );

    const ThirdRoute = () => (
        // <View style={{ flex: 1, flexDirection: "column" }}>
        <ScrollView style={{ padding: 0 }}>
            {dashboardData.userRole === UserRole.MANAGER ? (
                <LearningEx learning={dashboardData.learning} />
            ) : (
                <Learning learning={dashboardData.learning} />
            )}
        </ScrollView>
        // </View>
    );

    const renderScene = SceneMap({
        first: () => <FirstRoute changeTab={changeTab} />,
        second: SecondRoute,
        third: ThirdRoute,
    });

    // Function to change the tab programmatically
    const changeTab = (tabIndex) => {
        console.log(`changeTab called:${tabIndex}`);
        //setIndex(tabIndex);
        if (tabIndex === 1) {
            setActiveTab(HomeTabs.TASK)
        } else if (tabIndex === 2) {
            setActiveTab(HomeTabs.LEARNING)
        }
    };

    return (
        <ErrorBoundary>
            <SafeAreaView >
                <Toolbar />
                <View style={{ backgroundColor: '#5B57C7' }}>
                    <View style={styles.tabBar}>
                        {[HomeTabs.DASHBOARD, HomeTabs.TASK, HomeTabs.LEARNING].map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={[styles.tab, activeTab === tab && styles.activeTab]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Text
                                    style={[styles.tabText, activeTab === tab && styles.activeTabText]}
                                >
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <ErrorBoundary>
                    {activeTab === HomeTabs.DASHBOARD && <FirstRoute changeTab={changeTab} />}
                    {activeTab === HomeTabs.TASK && SecondRoute()}
                    {activeTab === HomeTabs.LEARNING && ThirdRoute()}
                </ErrorBoundary>
            </SafeAreaView>
        </ErrorBoundary>
    )

    // return (
    //     <View
    //         style={{ flex: 1 }}>
    //         <View
    //             style={{
    //                 flex: 1,
    //                 flexDirection: "column",
    //                 justifyContent: "flex-start",
    //                 alignItems: "stretch",
    //             }}>
    //             <Toolbar />
    //             <TabView
    //                 navigationState={{ index, routes }}
    //                 renderScene={renderScene}
    //                 onIndexChange={setIndex}
    //                 //initialLayout={{ width: layout.width }}
    //                 initialLayout={{ width: Dimensions.get('window').width }}
    //                 swipeEnabled={false}  // Disable gesture swipe
    //                 scrollEnabled={true}  // Enable scrolling for long content
    //                 renderTabBar={(props) => (
    //                     <TabBar
    //                         {...props}
    //                         indicatorStyle={{ backgroundColor: "#FFFFFF" }} // Color of the indicator
    //                         style={{ backgroundColor: "#5B57C7" }} // Tab bar background color
    //                         activeColor="#FFFFFF" // Text color for the active tab
    //                         inactiveColor="#F1F1F1" // Text color for inactive tabs
    //                         renderLabel={({ route, color }) => (
    //                             <Text style={{ color }}>{route.title}</Text>
    //                         )}
    //                     />

    //                     //     <TabBar
    //                     //     {...props}
    //                     //     style={{
    //                     //         backgroundColor: "#616161",
    //                     //         borderRadius: 50,
    //                     //         margin: 16
    //                     //     }} // Tab bar background color
    //                     //     activeTintColor="#000000" // Text color for the active tab
    //                     //     inactiveTintColor="#FFFFFF" // Text color for inactive tabs
    //                     //     renderIndicator={() => null} // Disable the indicator
    //                     //     renderLabel={({ route, color, focused }) => (
    //                     //         <View style={[
    //                     //             // Conditionally apply the styling only if the tab is selected (focused)
    //                     //             focused && {
    //                     //                 flex: 1, // Ensure the view takes up the full available space
    //                     //                 backgroundColor: "#242424", // Background of the label
    //                     //                 justifyContent: "center", // Center content vertically
    //                     //                 alignItems: "center", // Center content horizontally
    //                     //                 paddingHorizontal: 1, // Padding on the left and right
    //                     //                 paddingVertical: 1, // Padding on top and bottom
    //                     //                 borderRadius: 50, // Rounded corners
    //                     //             },
    //                     //             // Full width for selected tab, transparent for unselected tabs
    //                     //             focused && {
    //                     //                 width: width / routes.length, // Full width for selected tab
    //                     //             },
    //                     //         ]}>
    //                     //             <Text style={{ color }}>{route.title}</Text>
    //                     //         </View>
    //                     //     )}
    //                     // />
    //                 )}
    //             />

    //             {/* Show Floating Button only on Task tab */}
    //             {/* {showFloatingButton &&
    //                 <FloatingButtonAdd
    //                 //onPress={handleAddPress}
    //                 />
    //             } */}
    //         </View>
    //     </View>
    // );
}

function Toolbar() {
    const navigate = useNavigate();
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigate(-1)}>
                <Image
                    source={require("../../assets/images/home/icon_back_white.png")} // Replace with the correct path to your local image
                    style={styles.iconSmallest}
                />
            </TouchableOpacity>
            <View
                style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    flex: 1,
                    marginStart: 16
                }}
            >
                <Text style={[styles.title, { fontSize: 20 }]}>Workforce</Text>
                {/* <Text style={{ fontSize: 13, fontWeight: "400", color: "#fff" }}>
                    General Store, Cincinnati
                </Text> */}
            </View>

            {/* Right Side: Home Icon */}

            <TouchableOpacity
                onPress={() => { navigate('/chatBot') }}>
                <Image
                    source={require("../../assets/images/home/icon_bot.png")} // Replace with the correct path to your local image
                    style={[styles.iconSmallest, { marginEnd: 16 }]}
                />
            </TouchableOpacity >
            <TouchableOpacity
                onPress={() => { navigate('/notifications') }}>
                <Image
                    source={require("../../assets/images/home/icon_notification.png")} // Replace with the correct path to your local image
                    style={styles.iconSmallest}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: "#5B57C7",
        // transition: 'top 0.3s ease', // Smooth transition
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "500",
        color: '#fff'
    },
    iconSmallest: {
        width: 24, // Adjust icon size as needed
        height: 24
    },

    // Tabbar Styles
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#444791',
        borderRadius: 50,
        marginTop: 4,
        marginBottom: 8,
        marginStart: 16,
        marginEnd: 16
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 50,
    },
    activeTab: {
        backgroundColor: '#FFF',
    },
    tabText: {
        fontSize: 14,
        color: '#FFF',
        fontWeight: "400",
        textAlign: 'center'
    },
    activeTabText: {
        fontSize: 14,
        color: '#5B57C7',
        fontWeight: "400",
        textAlign: 'center'
    },
});

export default Home;
