import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getDashboard } from "../services/dashboardService";

export default function Dashboard() {

    const [data, setData] = useState({
        balance: 0,
        income: 0,
        expense: 0,
        goals: 0,
        mainGoal: null,
        latestTransactions: [],
    });

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        try {

            const response = await getDashboard();

            setData(response);

        } catch (error) {

            console.error(error);
        }
    };

    const progress =
        data.mainGoal &&
        data.mainGoal.target_amount > 0
            ? (
                data.mainGoal.current_amount /
                data.mainGoal.target_amount
            ) * 100
            : 0;

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
                    <h2>{data.balance.toFixed(2)} €</h2>
                </div>

                <div className="glass-card">
                    <h3>Ingresos</h3>
                    <h2>{data.income.toFixed(2)} €</h2>
                </div>

                <div className="glass-card">
                    <h3>Gastos</h3>
                    <h2>{data.expense.toFixed(2)} €</h2>
                </div>

                <div className="glass-card">
                    <h3>Objetivos</h3>
                    <h2>{data.goals}</h2>
                </div>

            </div>

            <div className="dashboard-bottom">

                <div className="glass-card">

                    <h3>Objetivo Principal</h3>

                    {data.mainGoal ? (
                        <>
                            <h2>{data.mainGoal.title}</h2>

                            <p>
                                {data.mainGoal.current_amount} €
                                /
                                {data.mainGoal.target_amount} €
                            </p>

                            <div className="progress-bar">

                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${progress}%`,
                                    }}
                                />

                            </div>

                            <p>
                                {progress.toFixed(0)}%
                                completado
                            </p>
                        </>
                    ) : (
                        <p>No tienes objetivos.</p>
                    )}

                </div>

                <div className="glass-card">

                    <h3>Últimas transacciones</h3>

                    {data.latestTransactions.length > 0 ? (

                        data.latestTransactions.map(
                            (transaction) => (

                                <div
                                    key={transaction.id}
                                    className="transaction-row"
                                >

                                    <span>
                                        {transaction.title}
                                    </span>

                                    <span>
                                        {transaction.type === "expense"
                                            ? "-"
                                            : "+"}
                                        {transaction.amount} €
                                    </span>

                                </div>
                            )
                        )

                    ) : (

                        <p>
                            No hay transacciones.
                        </p>
                    )}

                </div>

            </div>

        </MainLayout>
    );
}