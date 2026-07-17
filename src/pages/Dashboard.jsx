import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getDashboard } from "../services/dashboardService";
import FinanceChart from "../components/FinanceChart";
import BilletinAvatar from "../components/BilletinAvatar";

export default function Dashboard() {

    const [data, setData] = useState({
        balance: 0,
        income: 0,
        expense: 0,
        goals: 0,
        mainGoal: null,
        latestTransactions: [],
        recommendations: [],
    });

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        try {

            const response =
                await getDashboard();

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

    const billetinMood =
        data.balance < 0
            ? "worried"
            : progress >= 80
            ? "happy"
            : "normal";

    const billetinAdvice =
        data.balance < 0
            ? "Tus gastos están superando tus ingresos. Vigila las compras impulsivas."
            : progress >= 80
            ? "Estás muy cerca de completar tu objetivo. ¡Sigue así!"
            : "Mantén constancia en tus ahorros para acelerar tu progreso.";

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

            {/* STATS */}

            <div className="stats-grid">

                <div className="glass-card">

                    <h3>💰 Balance</h3>

                    <h2
                        className={
                            data.balance >= 0
                                ? "stat-positive"
                                : "stat-negative"
                        }
                    >
                        {data.balance.toFixed(2)} €
                    </h2>

                </div>

                <div className="glass-card">

                    <h3>📈 Ingresos</h3>

                    <h2 className="stat-positive">
                        {data.income.toFixed(2)} €
                    </h2>

                </div>

                <div className="glass-card">

                    <h3>📉 Gastos</h3>

                    <h2 className="stat-negative">
                        {data.expense.toFixed(2)} €
                    </h2>

                </div>

                <div className="glass-card">

                    <h3>🎯 Objetivos</h3>

                    <h2>{data.goals}</h2>

                </div>

            </div>

            {/* BILLETIN */}

            <div
                className="glass-card"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    marginBottom: "24px",
                }}
            >

                <BilletinAvatar
                    size={80}
                    mood={billetinMood}
                />

                <div>

                    <h3
                        style={{
                            marginBottom: "8px",
                        }}
                    >
                        💵 Consejo de Billetín
                    </h3>

                    <p
                        style={{
                            margin: 0,
                            color: "#94A3B8",
                        }}
                    >
                        {billetinAdvice}
                    </p>

                </div>

            </div>

            {/* RECOMENDACIONES */}

            <div
                className="glass-card"
                style={{
                    marginBottom: "24px",
                }}
            >

                <h3>
                    🧠 Recomendaciones de Billetín
                </h3>

                {data.recommendations?.length > 0 ? (

                    data.recommendations.map(
                        (
                            recommendation,
                            index
                        ) => (

                            <p
                                key={index}
                                style={{
                                    marginBottom:
                                        "12px",
                                }}
                            >
                                {recommendation}
                            </p>

                        )
                    )

                ) : (

                    <p>
                        No hay recomendaciones disponibles.
                    </p>

                )}

            </div>

            {/* CHART */}

            <FinanceChart
                income={data.income}
                expense={data.expense}
            />

            {/* LOWER GRID */}

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
                            No tienes objetivos creados.
                        </p>

                    )}

                </div>

                <div className="glass-card">

                    <h3>
                        🧾 Últimos movimientos
                    </h3>

                    {data.latestTransactions.length > 0 ? (

                        data.latestTransactions.map(
                            (
                                transaction
                            ) => (

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
                                                "700",
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
                            No hay movimientos registrados.
                        </p>

                    )}

                </div>

            </div>

        </MainLayout>

    );
}