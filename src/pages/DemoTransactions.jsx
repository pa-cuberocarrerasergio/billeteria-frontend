import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

const transactions = [
    { id: 1, title: "Nómina julio", amount: 1800, type: "income", category: "Trabajo", transaction_date: "2026-07-18" },
    { id: 2, title: "Supermercado", amount: 75, type: "expense", category: "Alimentación", transaction_date: "2026-07-17" },
    { id: 3, title: "Netflix", amount: 13, type: "expense", category: "Suscripciones", transaction_date: "2026-07-15" },
    { id: 4, title: "Alquiler", amount: 650, type: "expense", category: "Vivienda", transaction_date: "2026-07-01" },
    { id: 5, title: "Freelance diseño", amount: 500, type: "income", category: "Trabajo", transaction_date: "2026-07-10" },
    { id: 6, title: "Spotify", amount: 10, type: "expense", category: "Suscripciones", transaction_date: "2026-07-08" },
    { id: 7, title: "Gimnasio", amount: 35, type: "expense", category: "Salud", transaction_date: "2026-07-05" },
    { id: 8, title: "Transferencia amigo", amount: 50, type: "income", category: "Otro", transaction_date: "2026-07-03" },
];

const CATEGORY_COLORS = {
    Trabajo: "#22c55e",
    Alimentación: "#f59e0b",
    Suscripciones: "#8b5cf6",
    Vivienda: "#ef4444",
    Salud: "#06b6d4",
    Otro: "#94a3b8",
};

export default function DemoTransactions() {

    const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + t.amount, 0);

    return (
        <MainLayout>

            {/* BANNER DEMO */}
            <div className="demo-banner">
                <span className="demo-banner-icon">👁️</span>
                <div className="demo-banner-text">
                    <strong>Modo Demo — Solo lectura</strong>
                    <span>Estas son transacciones de ejemplo. Regístrate para añadir las tuyas.</span>
                </div>
                <Link to="/login" className="demo-banner-btn">
                    Registrarse gratis →
                </Link>
            </div>

            <div className="page-container">

                {/* HEADER */}
                <div className="dashboard-header">
                    <h1>💳 Transacciones — Demo</h1>
                    <p>Historial de movimientos de ejemplo</p>
                </div>

                {/* RESUMEN */}
                <div className="stats-grid" style={{ marginBottom: 24 }}>
                    <div className="glass-card">
                        <h3>📈 Total ingresos</h3>
                        <h2 className="stat-positive">+{totalIncome.toLocaleString()} €</h2>
                    </div>
                    <div className="glass-card">
                        <h3>📉 Total gastos</h3>
                        <h2 className="stat-negative">-{totalExpense.toLocaleString()} €</h2>
                    </div>
                    <div className="glass-card">
                        <h3>💰 Balance neto</h3>
                        <h2 className={totalIncome - totalExpense >= 0 ? "stat-positive" : "stat-negative"}>
                            {totalIncome - totalExpense >= 0 ? "+" : ""}{(totalIncome - totalExpense).toLocaleString()} €
                        </h2>
                    </div>
                    <div className="glass-card">
                        <h3>📋 Nº transacciones</h3>
                        <h2>{transactions.length}</h2>
                    </div>
                </div>

                {/* LISTA */}
                <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
                    <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                        <h3 style={{ margin: 0 }}>📋 Historial de movimientos</h3>
                    </div>

                    {transactions.map((t) => (
                        <div key={t.id} className="demo-transaction-row">
                            <div className="demo-transaction-icon">
                                {t.type === "income" ? "📈" : "📉"}
                            </div>
                            <div className="demo-transaction-info">
                                <strong>{t.title}</strong>
                                <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 2 }}>
                                    <span
                                        className="demo-transaction-category"
                                        style={{ backgroundColor: `${CATEGORY_COLORS[t.category]}22`, color: CATEGORY_COLORS[t.category] }}
                                    >
                                        {t.category}
                                    </span>
                                    <span style={{ color: "#94a3b8", fontSize: 12 }}>{t.transaction_date}</span>
                                </div>
                            </div>
                            <div className={`demo-transaction-amount ${t.type === "income" ? "stat-positive" : "stat-negative"}`}>
                                {t.type === "income" ? "+" : "-"}{t.amount.toLocaleString()} €
                            </div>
                        </div>
                    ))}
                </div>

                {/* Nota de solo lectura */}
                <div className="demo-readonly-note">
                    <span>🔒</span>
                    <p>
                        En modo demo no puedes añadir ni editar transacciones.{" "}
                        <Link to="/login" style={{ color: "#4FD1C5" }}>Regístrate gratis</Link>{" "}
                        para gestionar tus propias finanzas.
                    </p>
                </div>

                {/* CTA */}
                <div className="demo-dashboard-cta glass-card" style={{ marginTop: 24 }}>
                    <div>
                        <strong>Añade tus propias transacciones</strong>
                        <p>Con cuenta gratuita puedes registrar ingresos y gastos reales y ver tu análisis personalizado.</p>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                        <Link to="/login" className="landing-btn-primary">
                            🚀 Crear cuenta gratis
                        </Link>
                        <Link to="/demo/dashboard" className="landing-btn-secondary">
                            Ver dashboard
                        </Link>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}