import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getDashboard } from "../services/dashboardService";
import FinanceChart from "../components/FinanceChart";

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

                <h1>
                    👋 Bienvenido a BilleterIA
                </h1>

                <p>
                    Tu centro de control financiero personal
                </p>

            </div>

            <div className="stats-grid">

                <div className="glass-card">
                    <h3>💰 Balance</h3>
                    <h2>{data.balance.toFixed(2)} €</h2>
                </div>

                <div className="glass-card">
                    <h3>📈 Ingresos</h3>
                    <h2>{data.income.toFixed(2)} €</h2>
                </div>

                <div className="glass-card">
                    <h3>📉 Gastos</h3>
                    <h2>{data.expense.toFixed(2)} €</h2>
                </div>

                <div className="glass-card">
                    <h3>🎯 Objetivos</h3>
                    <h2>{data.goals}</h2>
                </div>

            </div>

            <div className="dashboard-bottom">

                <div className="glass-card">

                    <h3>
                        🎌 Objetivo Principal
                    </h3>

                    {data.mainGoal ? (
                        <>
                            <h2>
                                {data.mainGoal.emoji}{" "}
                                {data.mainGoal.title}
                            </h2>

                            <p>
                                <strong>
                                    Ahorrado:
                                </strong>{" "}
                                {data.mainGoal.current_amount} €
                            </p>

                            <p>
                                <strong>
                                    Objetivo:
                                </strong>{" "}
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

                            <p
                                style={{
                                    marginTop: "10px",
                                }}
                            >
                                {progress.toFixed(1)}%
                                completado
                            </p>

                        </>
                    ) : (
                        <p>
                            No tienes objetivos
                            creados todavía.
                        </p>
                    )}

                </div>

                <div className="glass-card">

                    <h3>
                        🧾 Últimos movimientos
                    </h3>

                    {data.latestTransactions.length >
                    0 ? (

                        data.latestTransactions.map(
                            (transaction) => (

                                <div
                                    key={transaction.id}
                                    className="transaction-row"
                                >

                                    <div>

                                        <strong>
                                            {
                                                transaction.title
                                            }
                                        </strong>

                                        <br />

                                        <small>
                                            {
                                                transaction.transaction_date
                                            }
                                        </small>

                                    </div>

                                    <span
                                        style={{
                                            color:
                                                transaction.type ===
                                                "income"
                                                    ? "#22C55E"
                                                    : "#EF4444",
                                            fontWeight:
                                                "bold",
                                        }}
                                    >
                                        {transaction.type ===
                                        "income"
                                            ? "+"
                                            : "-"}
                                        {
                                            transaction.amount
                                        }
                                        €
                                    </span>

                                </div>
                            )
                        )

                    ) : (

                        <p>
                            No hay movimientos
                            registrados.
                        </p>
                    )}

                </div>

            </div>

            <FinanceChart
                income={data.income}
                expense={data.expense}
            />

        </MainLayout>
    );
}