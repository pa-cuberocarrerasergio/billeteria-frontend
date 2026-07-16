import { BrowserRouter, Routes, Route } from "react-router-dom";

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

function App() {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Login />;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route
                    path="/transactions"
                    element={<Transactions />}
                />
                <Route
                    path="/saving-goals"
                    element={<SavingGoals />}
                />
                <Route
                    path="/coach"
                    element={<Coach />}
                />
                <Route
                    path="/profile"
                    element={<Profile />}
                />
                <Route
                    path="/transactions/create"
                    element={<CreateTransaction />}
                />
                <Route
                    path="/saving-goals/create"
                    element={<CreateSavingGoal />}
                />
                <Route
                    path="/transactions/edit/:id"
                    element={<EditTransaction />}
                />
                <Route
                    path="/saving-goals/edit/:id"
                    element={<EditSavingGoal />}
                />
                <Route
                    path="/achievements"
                    element={<Achievements />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;