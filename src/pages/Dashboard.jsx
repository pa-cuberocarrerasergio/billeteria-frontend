import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getDashboard } from "../services/dashboardService";

export default function Dashboard() {

    const [data, setData] = useState({
        balance: 0,
        income: 0,
        expense: 0,
        goals: 0,
    });

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        try {

            const response = await getDashboard();

            setData(response);

        } catch (error) {

            console.error("Error cargando dashboard:", error);
        }
    };

    return (

        <MainLayout>

            <div className="dashboard-header">

                <h1>Dashboard</h1>

                <p>
                    Bienvenido de nuevo a BilleterIA 👋
                </p>

            </div>

            <div className="stats-grid">

                <div className="glass-card">

                    <h3>Balance</h3>

                    <h2>
                        {Number(data.balance).toFixed(2)} €
                    </h2>

                </div>

                <div className="glass-card">

                    <h3>Ingresos</h3>

                    <h2>
                        {Number(data.income).toFixed(2)} €
                    </h2>

                </div>

                <div className="glass-card">

                    <h3>Gastos</h3>

                    <h2>
                        {Number(data.expense).toFixed(2)} €
                    </h2>

                </div>

                <div className="glass-card">

                    <h3>Objetivos</h3>

                    <h2>
                        {data.goals}
                    </h2>

                </div>

            </div>

            <div className="dashboard-section">

                <div className="glass-card large-card">

                    <h3>Objetivo Principal</h3>

                    <h2>
                        🇯🇵 Viaje a Japón
                    </h2>

                    <p>
                        1.500€ / 5.000€
                    </p>

                    <div className="progress-bar">

                        <div
                            className="progress-fill"
                            style={{ width: "30%" }}
                        />

                    </div>

                </div>

            </div>

        </MainLayout>
    );
}