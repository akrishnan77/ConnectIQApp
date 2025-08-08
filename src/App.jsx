import React from "react";
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, loginRequest } from "./authConfig";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardGrid from "./screens/home/DashboardGrid";
import Home from "./screens/home/Home";
import TaskDetails from "./screens/task/TaskDetails";
import DailyTraining from "./screens/training/DailyTraining";
import Training from "./screens/training/Training";
import ViewResource from "./screens/training/ViewResource";
import ResourceList from "./screens/training/executive/ResourceList";
import TrainingList from "./screens/training/executive/TrainingList";
import CreateTaskScreen from "./screens/task/CreateTask";
import AddTraining from "./screens/training/executive/AddTraining";
import ChatBot from "./screens/home/ChatBot";
import Notifications from "./screens/home/Notifications";
import Map2D from "./screens/home/Map2D";
import ComingSoon from "./screens/home/ComingSoon";
import OpenWebview from "./screens/home/OpenWebview";
import TaskSummaryEx from "./screens/task/TaskSummaryEx";
import EditTaskEx from "./screens/task/EditTaskEx";
import ReportEx from "./screens/report/ReportEx";

const msalInstance = new PublicClientApplication(msalConfig);

function SignInButton() {
    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginRedirect(loginRequest).catch(e => {
            console.error(e);
        });
    }
    return <button onClick={handleLogin}>Sign In</button>;
}

function AppContent() {
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
                <Route path="/taskdetails/:taskId" element={<TaskDetails />} />
                <Route path="/taskSummary/:taskIdnew" element={<TaskSummaryEx />} />
                <Route path="/createTask/:taskDetailId" element={<CreateTaskScreen />} />
                <Route path="*" element={<DashboardGrid />} />
            </Routes>
        </Router>
    );
}

function App() {
    return (
        <MsalProvider instance={msalInstance}>
            <AuthenticatedTemplate>
                <AppContent />
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column'}}>
                    <p>You are not signed in. Please sign in to continue.</p>
                    <SignInButton />
                </div>
            </UnauthenticatedTemplate>
        </MsalProvider>
    );
}

export default App;
