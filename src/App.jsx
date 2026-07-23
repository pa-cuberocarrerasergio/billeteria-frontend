import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import SavingGoals from "./pages/SavingGoals";
import Coach from "./pages/Coach";
import Profile from "./pages/Profile";
import CreateTransaction from "./pages/CreateTransaction";
import CreateSavingGoal from "./pages/CreateSavingGoal";
import EditTransaction from "./pages/EditTransaction";
import EditSavingGoal from "./pages/EditSavingGoal";
import Achievements from "./pages/Achievements";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DemoDashboard from "./pages/DemoDashboard";
import DemoTransactions from "./pages/DemoTransactions";
import DemoCoach from "./pages/DemoCoach";
import DemoAchievements from "./pages/DemoAchievements";

function App() {
    

    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<LandingPage />}/>
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute> } />
                <Route
                    path="/transactions"
                    element={<ProtectedRoute><Transactions /></ProtectedRoute>}
                />
                <Route
                    path="/saving-goals"
                    element={<ProtectedRoute><SavingGoals /></ProtectedRoute>}
                />
                <Route
                    path="/coach"
                    element={<ProtectedRoute><Coach /></ProtectedRoute>}
                />
                <Route
                    path="/profile"
                    element={<ProtectedRoute><Profile /></ProtectedRoute>}
                />
                <Route
                    path="/transactions/create"
                    element={<ProtectedRoute><CreateTransaction /></ProtectedRoute>}
                />
                <Route
                    path="/saving-goals/create"
                    element={<ProtectedRoute><CreateSavingGoal /></ProtectedRoute>}
                />
                <Route
                    path="/transactions/edit/:id"
                    element={<ProtectedRoute><EditTransaction /></ProtectedRoute>}
                />
                <Route
                    path="/saving-goals/edit/:id"
                    element={<ProtectedRoute><EditSavingGoal /></ProtectedRoute>}
                />
                <Route
                    path="/achievements"
                    element={<ProtectedRoute><Achievements /></ProtectedRoute>}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/demo/dashboard"
                    element={<DemoDashboard />} />
                <Route path="/demo/transactions"
                    element={<DemoTransactions />} />
                <Route path="/demo/coach"
                    element={<DemoCoach />} />
                <Route path="/demo/achievements"
                    element={<DemoAchievements />} />
                <Route path="/demo/profile"
                    element={<DemoDashboard />} /> {/* Temp, let's make a DemoProfile later if needed */}
                <Route path="/demo/goals"
                    element={<DemoDashboard />} /> {/* Temp */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;