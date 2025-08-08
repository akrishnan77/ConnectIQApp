import React from "react";
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
import ChatBot from "./home/ChatBot";
import Notifications from "./home/Notifications";
import Map2D from "./home/Map2D";
import ComingSoon from "./home/ComingSoon";
import OpenWebview from "./home/OpenWebview";
import TaskSummaryEx from "./task/TaskSummaryEx";
import EditTaskEx from "./task/EditTaskEx";
import ReportEx from "./report/ReportEx";
// https://fluentsite.z22.web.core.windows.net/quick-start
import {
    FluentProvider, teamsLightTheme, teamsDarkTheme, teamsHighContrastTheme, Spinner, tokens,
} from "@fluentui/react-components";
import { useTeamsUserCredential } from "@microsoft/teamsfx-react";
// Removed TeamsFxContext and config imports (Teams/TeamsFx dependencies)
//import { HashRouter as Router, Navigate, Route, Routes } from "react-router-dom";

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export default function Main() {

    // Removed TeamsFx config logs

    // TeamsFxContext and config removed. Render app routes directly.
    return (
        <Router>
            <Routes>
                <Route path="/" element={<DashboardGrid />} />
                <Route path="/home" element={<Home />} />
                <Route path="/dailytraining" element={<DailyTraining />} />
                <Route path="/training" element={<Training />} />
                <Route path="/viewResource" element={<ViewResource />} />
                <Route path="/resourceList" element={<ResourceList />} />
                <Route path="/trainingList" element={<TrainingList />} />
                <Route path="/addTraining" element={<AddTraining />} />
                <Route path="/chatBot" element={<ChatBot />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/map2d" element={<Map2D />} />
                <Route path="/comingSoon" element={<ComingSoon />} />
                <Route path="/openWebview" element={<OpenWebview />} />
                <Route path="/createTask" element={<CreateTaskScreen />} />
                <Route path="/report" element={<ReportEx />} />
                <Route path="/editTask" element={<EditTaskEx />} />
                <Route path="/taskdetails/:taskIdnew" element={<TaskDetails />} />
                <Route path="/taskSummary/:taskIdnew" element={<TaskSummaryEx />} />
                <Route path="/createTask/:taskDetailId" element={<CreateTaskScreen />} />
                {/* <Route path="/taskdetails" element={<TaskDetails />} /> */}
                <Route path="*" element={<DashboardGrid />} />
            </Routes>
        </Router>
    );
}
