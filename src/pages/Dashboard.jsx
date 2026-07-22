import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getDashboard } from "../services/dashboardService";
import FinanceChart from "../components/FinanceChart";
import BilletinAvatar from "../components/BilletinAvatar";

export default function Dashboard() {
    const [data, setData] = useState({
        balance: 0,
        income: 0,
        expense: 0,
        savings: 0,
        goals: 0,
        topGoals: [],
        latestTransactions: [],
        recommendations: [],
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

    // Use primary goal for Billetin mood (first in the topGoals array)
    const primaryGoal = data.topGoals?.[0];
    const progress = primaryGoal && primaryGoal.target_amount > 0
        ? (primaryGoal.current_amount / primaryGoal.target_amount) * 100
        : 0;

    const billetinMood = data.balance < 0
        ? "worried"
        : progress >= 80
            ? "happy"
            : "normal";

    const billetinAdvice = data.balance < 0
        ? "Tus gastos están superando tus ingresos. Vigila las compras impulsivas."
        : progress >= 80
            ? "Estás muy cerca de completar tu objetivo principal. ¡Sigue así!"
            : "Mantén constancia en tus ahorros para acelerar tu progreso.";

    return (
        <MainLayout>
            <div className="dashboard-header">
                <h1>👋 Bienvenido a BilleterIA</h1>
                <p>Tu centro de control financiero personal</p>
            </div>

            {/* STATS */}
            <div className="stats-grid">
                <div className="glass-card">
                    <h3>💰 Balance</h3>
                    <h2 className={data.balance >= 0 ? "stat-positive" : "stat-negative"}>
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
            <div className="glass-card" style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
                <BilletinAvatar size={80} mood={billetinMood} />
                <div>
                    <h3 style={{ marginBottom: "8px" }}>💵 Consejo de Billetín</h3>
                    <p style={{ margin: 0, color: "#94A3B8" }}>{billetinAdvice}</p>
                </div>
            </div>

            {/* RECOMENDACIONES */}
            <div className="glass-card" style={{ marginBottom: "24px" }}>
                <h3>🧠 Recomendaciones de Billetín</h3>
                {data.recommendations?.length > 0 ? (
                    data.recommendations.map((recommendation, index) => (
                        <p key={index} style={{ marginBottom: "12px" }}>
                            {recommendation}
                        </p>
                    ))
                ) : (
                    <p>No hay recomendaciones disponibles.</p>
                )}
            </div>

            {/* CHART */}
            <FinanceChart income={data.income} expense={data.expense} savings={data.savings} />

            {/* LOWER GRID */}
            <div className="dashboard-bottom">
                
                {/* TOP GOALS */}
                <div className="glass-card" style={{ display: "flex", flexDirection: "column" }}>
                    <h3>🎌 Objetivos Destacados</h3>

                    {data.topGoals && data.topGoals.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
                            {data.topGoals.map((goal) => {
                                const goalProgress = goal.target_amount > 0 
                                    ? (goal.current_amount / goal.target_amount) * 100 
                                    : 0;

                                return (
                                    <div key={goal.id} style={{ borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                            <h4 style={{ margin: 0, fontSize: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
                                                <span>{goal.emoji}</span> {goal.title}
                                            </h4>
                                            <span style={{ 
                                                fontSize: "11px", 
                                                padding: "2px 6px", 
                                                borderRadius: "4px",
                                                fontWeight: "bold",
                                                backgroundColor: goal.priority === 'high' ? 'rgba(239, 68, 68, 0.2)' : goal.priority === 'medium' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                                color: goal.priority === 'high' ? '#ef4444' : goal.priority === 'medium' ? '#f59e0b' : '#10b981'
                                            }}>
                                                {goal.priority.toUpperCase()}
                                            </span>
                                        </div>
                                        
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--text-h)", marginBottom: "6px" }}>
                                            <span>{Number(goal.current_amount).toFixed(2)} €</span>
                                            <span>{Number(goal.target_amount).toFixed(2)} €</span>
                                        </div>
                                        
                                        <div className="progress-bar" style={{ height: "6px" }}>
                                            <div className="progress-fill" style={{ width: `${goalProgress}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p>No tienes objetivos creados.</p>
                    )}

                    <div style={{ marginTop: "auto", paddingTop: "20px" }}>
                        <Link to="/saving-goals" className="edit-btn" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
                            Ver todos los objetivos →
                        </Link>
                    </div>
                </div>

                {/* TRANSACTIONS */}
                <div className="glass-card">
                    <h3>🧾 Últimos movimientos</h3>
                    {data.latestTransactions.length > 0 ? (
                        <div style={{ marginTop: "16px" }}>
                            {data.latestTransactions.map((transaction) => (
                                <div key={transaction.id} className="transaction-row">
                                    <div>
                                        <strong>{transaction.title}</strong>
                                        <br />
                                        <small>{transaction.transaction_date}</small>
                                    </div>
                                    <span style={{
                                        color: transaction.type === "income" ? "#22C55E" : "#EF4444",
                                        fontWeight: "700",
                                    }}>
                                        {transaction.type === "income" ? "+" : "-"}{transaction.amount} €
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No hay movimientos registrados.</p>
                    )}
                </div>

            </div>
        </MainLayout>
    );
}