import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import FinanceChart from "../components/FinanceChart";
import BilletinAvatar from "../components/BilletinAvatar";

export default function DemoDashboard() {

    const data = {
        balance: 1250,
        income: 2500,
        expense: 1250,
        goals: 3,

        mainGoal: {
            title: "Viaje a Japón",
            emoji: "✈️",
            current_amount: 1500,
            target_amount: 3000,
        },

        latestTransactions: [
            { id: 1, title: "Nómina", amount: 1800, type: "income", transaction_date: "2026-07-18" },
            { id: 2, title: "Supermercado", amount: 75, type: "expense", transaction_date: "2026-07-17" },
            { id: 3, title: "Netflix", amount: 13, type: "expense", transaction_date: "2026-07-15" },
            { id: 4, title: "Alquiler", amount: 650, type: "expense", transaction_date: "2026-07-01" },
            { id: 5, title: "Freelance", amount: 500, type: "income", transaction_date: "2026-07-10" },
        ],

        recommendations: [
            "💡 Podrías ahorrar 120€ más reduciendo ocio un 10%.",
            "⚠️ Tu gasto en suscripciones es superior a la media.",
            "🚀 Vas por buen camino para completar tu objetivo.",
        ],
    };

    const progress = (data.mainGoal.current_amount / data.mainGoal.target_amount) * 100;

    return (
        <MainLayout>

            {/* BANNER DEMO */}
            <div className="demo-banner">
                <span className="demo-banner-icon">👁️</span>
                <div className="demo-banner-text">
                    <strong>Modo Demo — Solo lectura</strong>
                    <span>Estos son datos de ejemplo. Regístrate para usar la app con tus propias finanzas.</span>
                </div>
                <Link to="/login" className="demo-banner-btn">
                    Registrarse gratis →
                </Link>
            </div>

            {/* HEADER */}
            <div className="dashboard-header">
                <h1>🚀 Demo — BilleterIA</h1>
                <p>Vista interactiva de ejemplo con datos ficticios</p>
            </div>

            {/* STATS */}
            <div className="stats-grid">
                <div className="glass-card">
                    <h3>💰 Balance</h3>
                    <h2 className="stat-positive">{data.balance.toLocaleString()} €</h2>
                    <p style={{ color: "#22c55e", fontSize: 13, marginTop: 4 }}>▲ +8% vs mes anterior</p>
                </div>
                <div className="glass-card">
                    <h3>📈 Ingresos</h3>
                    <h2 className="stat-positive">{data.income.toLocaleString()} €</h2>
                    <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>Nómina + freelance</p>
                </div>
                <div className="glass-card">
                    <h3>📉 Gastos</h3>
                    <h2 className="stat-negative">{data.expense.toLocaleString()} €</h2>
                    <p style={{ color: "#ef4444", fontSize: 13, marginTop: 4 }}>▼ -5% vs mes anterior</p>
                </div>
                <div className="glass-card">
                    <h3>🎯 Objetivos</h3>
                    <h2>{data.goals}</h2>
                    <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>2 en progreso · 1 completado</p>
                </div>
            </div>

            {/* BOTTOM GRID */}
            <div className="dashboard-bottom">

                {/* BILLETÍN */}
                <div className="glass-card">
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                        <BilletinAvatar size={64} mood="happy" />
                        <div>
                            <strong>Billetín recomienda</strong>
                            <p style={{ margin: 0, color: "#94a3b8", fontSize: 13 }}>Coach IA personal</p>
                        </div>
                    </div>
                    {data.recommendations.map((r, i) => (
                        <div key={i} className="demo-recommendation">
                            {r}
                        </div>
                    ))}
                    <Link to="/demo/coach" className="demo-coach-link">
                        Hablar con Billetín →
                    </Link>
                </div>

                {/* OBJETIVO PRINCIPAL */}
                <div className="glass-card">
                    <h3>
                        {data.mainGoal.emoji} {data.mainGoal.title}
                    </h3>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, color: "#94a3b8", fontSize: 14 }}>
                        <span>Ahorrado: <strong style={{ color: "white" }}>{data.mainGoal.current_amount.toLocaleString()} €</strong></span>
                        <span>Meta: <strong style={{ color: "white" }}>{data.mainGoal.target_amount.toLocaleString()} €</strong></span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <p style={{ color: "#4FD1C5", marginTop: 8, fontWeight: 600 }}>
                        {progress.toFixed(0)}% completado
                    </p>

                    <h3 style={{ marginTop: 20 }}>📋 Últimas transacciones</h3>
                    {data.latestTransactions.map((t) => (
                        <div key={t.id} className="transaction-row">
                            <div>
                                <strong>{t.title}</strong>
                                <p style={{ margin: 0, color: "#94a3b8", fontSize: 12 }}>{t.transaction_date}</p>
                            </div>
                            <span className={t.type === "income" ? "stat-positive" : "stat-negative"}>
                                {t.type === "income" ? "+" : "-"}{t.amount} €
                            </span>
                        </div>
                    ))}
                    <Link to="/demo/transactions" className="demo-coach-link" style={{ marginTop: 12 }}>
                        Ver todas las transacciones →
                    </Link>
                </div>

            </div>

            {/* GRÁFICO */}
            <FinanceChart income={data.income} expense={data.expense} />

            {/* CTA DENTRO DEL DASHBOARD */}
            <div className="demo-dashboard-cta glass-card">
                <div>
                    <strong>¿Listo para usar BilleterIA con tus datos reales?</strong>
                    <p>Regístrate gratis y conecta tus finanzas en menos de 1 minuto.</p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                    <Link to="/login" className="landing-btn-primary">
                        🚀 Crear cuenta gratis
                    </Link>
                    <Link to="/" className="landing-btn-secondary">
                        Volver al inicio
                    </Link>
                </div>
            </div>

        </MainLayout>
    );
}