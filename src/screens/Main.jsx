import React, { useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TaskDetails from "./task/TaskDetails";
import DailyTraining from "./training/DailyTraining";
import Training from "./training/Training"
import Home from "./home/Home"
import DashboardGrid from "./home/DashboardGrid"
import ViewResource from "./training/ViewResource";
import ResourceList from "./training/executive/ResourceList";
import TrainingList from "./training/executive/TrainingList";
import CreateTaskScreen from "./task/CreateTask";
import AddTraining from "./training/executive/AddTraining";
// https://fluentsite.z22.web.core.windows.net/quick-start
// import {
//     FluentProvider, teamsLightTheme, teamsDarkTheme, teamsHighContrastTheme, Spinner, tokens,
// } from "@fluentui/react-components";
// import { useTeamsUserCredential } from "@microsoft/teamsfx-react";
// import { TeamsFxContext } from "../components/Context";
// import config from "../components/sample/lib/config";
// //import { HashRouter as Router, Navigate, Route, Routes } from "react-router-dom";

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export default function Main() {
    // const { loading, theme, themeString, teamsUserCredential } = useTeamsUserCredential({
    //     initiateLoginEndpoint: config.initiateLoginEndpoint,
    //     clientId: config.clientId,
    // });
    const menu = [
        { id: 'home', title: 'Home', icon: 'home', path: '/home' },
        { id: 'task', title: 'Task', icon: 'task', path: '/task' },
        { id: 'report', title: 'Report', icon: 'report', path: '/report' },
        { id: 'training', title: 'Training', icon: 'training', path: '/training' },
        { id: 'chatbot', title: 'Chatbot', icon: 'chatbot', path: '/chatbot' },
    ];

    const [activeMenu, setActiveMenu] = useState(menu[0]);

    return (
        // <TeamsFxContext.Provider value={{ theme, themeString, teamsUserCredential }}>
        //     <FluentProvider
        //         theme={
        //             themeString === "dark"
        //                 ? teamsDarkTheme
        //                 : themeString === "contrast"
        //                     ? teamsHighContrastTheme
        //                     : {
        //                         ...teamsLightTheme,
        //                         colorNeutralBackground3: "#fff",
        //                     }
        //         }
        //         style={{ background: tokens.colorNeutralBackground3 }}
        //     >
        <Router>
            {/* {loading ? (
                        // <Spinner style={{ margin: 100 }} />
                        <View style={{
                            width: '100%', height: '100%',
                            justifyContent: "center", alignItems: "center"
                        }}>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    ) : ( */}
            <Routes>
                <Route path="/" element={<DashboardGrid />} />
                <Route path="/home" element={<Home />} />
                <Route path="/dailytraining" element={<DailyTraining />} />
                <Route path="/training" element={<Training />} />
                <Route path="/viewResource" element={<ViewResource />} />
                <Route path="/resourceList" element={<ResourceList />} />
                <Route path="/trainingList" element={<TrainingList />} />
                <Route path="/addTraining" element={<AddTraining />} />
                <Route path="/createTask" element={<CreateTaskScreen />} />
                <Route path="/taskdetails/:taskIdnew" element={<TaskDetails />} />
                {/* <Route path="/taskdetails" element={<TaskDetails />} /> */}
                <Route path="*" element={<DashboardGrid />} />
            </Routes>
            {/* )} */}
        </Router>
        //     </FluentProvider>
        // </TeamsFxContext.Provider>
    );
}
