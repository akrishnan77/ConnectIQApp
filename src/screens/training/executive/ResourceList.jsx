import {
    View, Text, StyleSheet, Image, TouchableOpacity, FlatList,
    useWindowDimensions, SafeAreaView
} from "react-native";
import * as React from "react";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { ToolbarWith2Img } from "../../../components/nrf_app/Toolbar";
import { useNavigate, useLocation } from 'react-router-dom';
import Utils from "../../../utils/Utils";
import { ResourceTabs } from "../../../utils/AppConstants";

function ResourceList() {
    const layout = useWindowDimensions();
    const utils = new Utils();
    const navigate = useNavigate();
    const location = useLocation();
    const resourceList = location.state || [];  // Access state passed

    let docRes = []
    let videoRes = []
    if (Array.isArray(resourceList)) {
        docRes = resourceList.filter(resource => !utils.isVideoResource(resource.url))
        videoRes = resourceList.filter(resource => utils.isVideoResource(resource.url))
    }

    const [activeTab, setActiveTab] = React.useState(ResourceTabs.DOC);
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: "first", title: "Doc Course" },
        { key: "second", title: "Video Course" },
    ]);

    // Handle Resource click
    const handleResourceClick = (item, index) => {
        navigate("/viewResource", { state: item.id })
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

                <Text style={[styles.title, { flex: 1, marginStart: 16 }]}>{item.title}</Text>

                <Image
                    source={require('../../../assets/images/home/icon_arrow_medium.png')}
                    style={styles.iconSmallest}
                />
            </TouchableOpacity>
        </View>
    );

    const FirstRoute = () => (
        <View style={{ flex: 1, }}>
            <FlatList
                data={docRes}
                renderItem={renderResourceItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );

    const SecondRoute = () => (
        <View style={{ flex: 1, }}>
            <FlatList
                data={videoRes}
                renderItem={renderResourceItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
    });

    return (
        <SafeAreaView >
            <ToolbarWith2Img
                title={'Resources'}
            />
            <View style={styles.tabBar}>
                {[ResourceTabs.DOC, ResourceTabs.VIDEO].map((tab) => (
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

            {activeTab === ResourceTabs.DOC && FirstRoute()}
            {activeTab === ResourceTabs.VIDEO && SecondRoute()}
        </SafeAreaView>
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
    //             <ToolbarWith2Img
    //                 title={'Resources'}
    //             />
    //             <TabView
    //                 navigationState={{ index, routes }}
    //                 renderScene={renderScene}
    //                 onIndexChange={setIndex}
    //                 initialLayout={{ width: layout.width }}
    //                 swipeEnabled={false}  // Disable gesture swipe
    //                 renderTabBar={(props) => (
    //                     <TabBar
    //                         {...props}
    //                         indicatorStyle={{ backgroundColor: "#242424" }} // Color of the indicator
    //                         style={{ backgroundColor: "#FFFFFF" }} // Tab bar background color
    //                         activeColor="#242424" // Text color for the active tab
    //                         inactiveColor="#616161" // Text color for inactive tabs
    //                         renderLabel={({ route, color }) => (
    //                             <Text style={{ color, fontSize:16 }}>{route.title}</Text>
    //                         )}
    //                     />
    //                 )}
    //             />
    //         </View>
    //     </View>
    // );
}

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
        color: '#5B57C7'
    },
    iconSmallest: {
        width: 24, // Adjust icon size as needed
        height: 24
    },

    // Tabbar Styles
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#F0F0F0',
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
        backgroundColor: '#5B57C7',
    },
    tabText: {
        fontSize: 14,
        color: '#616161',
        fontWeight: "400",
        textAlign: 'center'
    },
    activeTabText: {
        fontSize: 14,
        color: '#FFF',
        fontWeight: "400",
        textAlign: 'center'
    },
});

export default ResourceList;
