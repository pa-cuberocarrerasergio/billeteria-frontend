import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import SavingGoals from "./pages/SavingGoals";
import Coach from "./pages/Coach";
import Profile from "./pages/Profile";
import CreateTransaction from "./pages/CreateTransaction";
import CreateSavingGoal from "./pages/CreateSavingGoal";

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
            </Routes>
        </BrowserRouter>
    );
}

export default App;