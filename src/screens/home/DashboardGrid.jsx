import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList
} from "react-native";
import { KEY, saveData, setCurrentTabIndex, setReloadDashboardData, setReloadTrainingData } from '../../utils/LocalStorage'; // Import functions from StorageService
import { LandingScreenGrid } from "../../components/nrf_app/GridView";
// import { getUserByEmail } from "../../utils/DummyData";
import { HomeTabs, UserRole } from "../../utils/AppConstants.jsx";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { callMsGraph } from "../../graph";

// Grid data
const gridItems = [
    {
        title: "Workforce Management",
        image: require("../../assets/images/home/img11.png"),
    },
    {
        title: "Clienteling",
        image: require("../../assets/images/home/img22.png"),
    },
    {
        title: "Inventory ",
        image: require("../../assets/images/home/img33.png"),
    },
    {
        title: "Store Operations",
        image: require("../../assets/images/home/img44.png")
    },
    {
        title: "Orders & Return",
        image: require("../../assets/images/home/img55.png")
    },
    {
        title: "mPOS",
        image: require("../../assets/images/home/img66.png"),
    },
];

export default function DashboardGrid() {
    const { instance, accounts } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();

    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userProfile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setErrorMsg] = useState(null);

    useEffect(() => {
        const initializeUser = async () => {
            if (isAuthenticated && accounts.length > 0) {
                try {
                    const response = await instance.acquireTokenSilent({
                        scopes: ["User.Read"],
                        account: accounts[0],
                    });
                    const graphResponse = await callMsGraph(response.accessToken);
                    const email = graphResponse.userPrincipalName || graphResponse.mail;
                    setUserName(graphResponse.displayName);
                    // Try to fetch profile photo from Graph
                    try {
                        const photoResponse = await fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
                            headers: {
                                Authorization: `Bearer ${response.accessToken}`
                            }
                        });
                        if (photoResponse.ok) {
                            const photoBlob = await photoResponse.blob();
                            const photoUrl = URL.createObjectURL(photoBlob);
                            setProfile(photoUrl); // Use string URL for web
                        } else {
                            setProfile(require("../../assets/images/home/profile.png"));
                        }
                    } catch (photoError) {
                        setProfile(require("../../assets/images/home/profile.png"));
                    }
                    saveData(KEY.USER_EMAIL, email);
                    saveData(KEY.USER_ROLE, UserRole.ASSOCIATE);
                    saveData(KEY.USER_NAME, graphResponse.displayName);
                    setIsLoading(false);
                } catch (e) {
                    console.error("Detailed error in DashboardGrid:", e);
                    setErrorMsg('Failed to initialize user data.');
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        initializeUser();
    }, [instance, accounts, isAuthenticated]);

    const handleItemSelected = (item, index) => {
        if (index === 0) {
            navigate("/home");
        } else {
            navigate("/comingSoon", { state: item.title })
        }
    };

    if (isLoading) {
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
                width: '100%', height: '100%', padding: 32,
                justifyContent: "center", alignItems: "center", textAlign: 'center'
            }}>
                <Text>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Toolbar
                name={userName}
                profile={userProfile}
            />
            <Image
                source={require("../../assets/images/home/icon_harman_banner2.png")}
                style={{ width: '328', height: 45, marginTop: 16, marginBottom: 16, alignSelf: "center" }}
            />
            <LandingScreenGrid
                gridItems={gridItems}
                itemSelected={handleItemSelected}
                columns={3}
            />
        </View>
    );
}

function Toolbar({ profile, name }) {
    const navigate = useNavigate();

    // Helper to render profile image correctly for web or require
    function renderProfileImage(profile) {
        if (typeof profile === 'string') {
            // Web URL (from Azure)
            return <img src={profile} alt="profile" style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />;
        } else {
            // Local require (default)
            return <Image source={require("../../assets/images/home/profile.png")}
                style={toolbarStyle.profilePic} />;
        }
    }

    return (
        <View style={toolbarStyle.container}>
            {renderProfileImage(profile)}
            <View
                style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    flex: 1,
                }}
            >
                <Text style={toolbarStyle.title}>{name}</Text>
                <Text style={{ fontSize: 13, fontWeight: "400", color: "#fff" }}>
                    General Store, Cincinnati
                </Text>
            </View>
            {/* Emily.Johnson John Smith*/}
            {/* Right Side: Home Icon */}

            <TouchableOpacity
                onPress={() => { navigate('/chatBot') }}>
                <Image
                    source={require("../../assets/images/home/icon_bot.png")}
                    style={[toolbarStyle.iconSmallest, { marginEnd: 16 }]}
                />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => { navigate('/notifications') }}>
                <Image
                    source={require("../../assets/images/home/icon_notification.png")}
                    style={toolbarStyle.iconSmallest}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
    },
    headerContainer: {
        width: "100%",
        height: 300,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    mainImage: {
        width: "100%",
        height: "100%",
        position: "absolute",
    },
    logo: {
        width: 101,
        height: 60,
        position: "absolute",
        bottom: 16,
        right: 16,
    },
    headerText: {
        position: "absolute",
        bottom: 16,
        left: 16,
        flexDirection: "column",
    },
    gridContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        flex: 1,
    },
    gridItem: {
        flex: 1,
        margin: 8,
        backgroundColor: "white",
        borderRadius: 8,
        alignItems: "center",
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px -0.1px 2px rgba(0, 0, 0, 0.1)',
    },
    gridItemImage: {
        width: "100%",
        height: 150,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    gridItemText: {
        padding: 8,
        fontSize: 16,
        fontWeight: "400",
    },
});

const toolbarStyle = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 16,
        backgroundColor: "#5B57C7",
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
});
