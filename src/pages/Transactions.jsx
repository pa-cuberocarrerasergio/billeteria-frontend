import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

const CATEGORY_COLORS = {
    Trabajo: "#22c55e",
    Salario: "#22c55e",
    Alimentación: "#f59e0b",
    Suscripciones: "#8b5cf6",
    Vivienda: "#ef4444",
    Salud: "#06b6d4",
    Ocio: "#9c27b0",
    Transporte: "#2196f3",
    Inversiones: "#009688",
    Freelance: "#3b82f6",
    Otro: "#94a3b8",
};

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [filterType, setFilterType] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            const response = await api.get("/transactions");
            setTransactions(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const deleteTransaction = async (id) => {
        const confirmed = window.confirm("¿Seguro que deseas eliminar esta transacción?");
        if (!confirmed) return;

        try {
            await api.delete(`/transactions/${id}`);
            loadTransactions();
        } catch (error) {
            console.error(error);
        }
    };

    const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);

    const totalExpense = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);

    const netBalance = totalIncome - totalExpense;

    const filteredTransactions = transactions.filter((t) => {
        const matchesType = filterType === "all" || t.type === filterType;
        const matchesSearch =
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.category?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    return (
        <MainLayout>
            <div className="page-container">

                {/* HEADER */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "15px",
                    marginBottom: "24px"
                }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: "28px" }}>💳 Transacciones</h1>
                        <p style={{ color: "var(--text-muted)", margin: "4px 0 0 0", fontSize: "14px" }}>
                            Gestión y seguimiento de todos tus movimientos financieros
                        </p>
                    </div>

                    <button
                        className="landing-btn-primary"
                        onClick={() => navigate("/transactions/create")}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "10px 20px",
                            fontSize: "14px",
                            fontWeight: "600",
                            borderRadius: "12px",
                            cursor: "pointer"
                        }}
                    >
                        ➕ Nueva Transacción
                    </button>
                </div>

                {/* RESUMEN STATS */}
                <div className="stats-grid" style={{ marginBottom: 24 }}>
                    <div className="glass-card">
                        <h3 style={{ fontSize: "14px", opacity: 0.8 }}>📈 Total ingresos</h3>
                        <h2 className="stat-positive" style={{ margin: "8px 0 0", fontSize: "24px" }}>
                            +{totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                        </h2>
                    </div>

                    <div className="glass-card">
                        <h3 style={{ fontSize: "14px", opacity: 0.8 }}>📉 Total gastos</h3>
                        <h2 className="stat-negative" style={{ margin: "8px 0 0", fontSize: "24px" }}>
                            -{totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                        </h2>
                    </div>

                    <div className="glass-card">
                        <h3 style={{ fontSize: "14px", opacity: 0.8 }}>💰 Balance neto</h3>
                        <h2
                            className={netBalance >= 0 ? "stat-positive" : "stat-negative"}
                            style={{ margin: "8px 0 0", fontSize: "24px" }}
                        >
                            {netBalance >= 0 ? "+" : ""}
                            {netBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                        </h2>
                    </div>

                    <div className="glass-card">
                        <h3 style={{ fontSize: "14px", opacity: 0.8 }}>📋 Nº transacciones</h3>
                        <h2 style={{ margin: "8px 0 0", fontSize: "24px" }}>
                            {transactions.length}
                        </h2>
                    </div>
                </div>

                {/* FILTROS Y BÚSQUEDA */}
                <div className="glass-card" style={{ marginBottom: "24px", padding: "16px 20px" }}>
                    <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>

                        {/* Search Input */}
                        <div style={{ flex: 1, minWidth: "220px" }}>
                            <input
                                type="text"
                                placeholder="🔍 Buscar por título o categoría..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "10px 14px",
                                    borderRadius: "10px",
                                    border: "1px solid var(--border)",
                                    background: "rgba(255,255,255,.05)",
                                    color: "#fff",
                                    fontSize: "14px"
                                }}
                            />
                        </div>

                        {/* Filter Buttons */}
                        <div style={{ display: "flex", gap: "8px" }}>
                            {[
                                { id: "all", label: "Todos" },
                                { id: "income", label: "💰 Ingresos" },
                                { id: "expense", label: "💸 Gastos" }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setFilterType(tab.id)}
                                    style={{
                                        padding: "8px 16px",
                                        borderRadius: "8px",
                                        border: "1px solid var(--border)",
                                        backgroundColor: filterType === tab.id ? "var(--accent)" : "rgba(255,255,255,.05)",
                                        color: "#fff",
                                        cursor: "pointer",
                                        fontSize: "13px",
                                        fontWeight: filterType === tab.id ? "bold" : "normal",
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                    </div>
                </div>

                {/* LISTA DE TRANSACCIONES */}
                <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
                    <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                        <h3 style={{ margin: 0, fontSize: "16px" }}>📋 Historial de movimientos ({filteredTransactions.length})</h3>
                    </div>

                    {loading ? (
                        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                            Cargando tus transacciones...
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div style={{ padding: "50px 20px", textAlign: "center", color: "var(--text-muted)" }}>
                            <span style={{ fontSize: "40px", display: "block", marginBottom: "12px" }}>🧾</span>
                            <p style={{ margin: 0, fontWeight: "bold", fontSize: "16px", color: "#fff" }}>
                                {transactions.length === 0 ? "No tienes transacciones registradas" : "No hay transacciones que coincidan con el filtro"}
                            </p>
                            <p style={{ fontSize: "13px", marginTop: "6px" }}>
                                {transactions.length === 0 ? "Comienza registrando un ingreso o un gasto para llevar el control." : "Prueba a cambiar el filtro o el término de búsqueda."}
                            </p>
                            {transactions.length === 0 && (
                                <button
                                    className="edit-btn"
                                    onClick={() => navigate("/transactions/create")}
                                    style={{ marginTop: "16px", padding: "8px 16px" }}
                                >
                                    ➕ Registrar mi primera transacción
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredTransactions.map((t) => {
                            const categoryName = t.category?.name || "General";
                            const categoryIcon = t.category?.icon || (t.type === "income" ? "📈" : "📉");
                            const categoryColor = t.category?.color || CATEGORY_COLORS[categoryName] || "#94a3b8";

                            return (
                                <div key={t.id} className="demo-transaction-row" style={{ padding: "14px 24px" }}>
                                    <div className="demo-transaction-icon" style={{
                                        width: "42px",
                                        height: "42px",
                                        borderRadius: "12px",
                                        backgroundColor: `${categoryColor}22`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "20px"
                                    }}>
                                        {categoryIcon}
                                    </div>

                                    <div className="demo-transaction-info" style={{ marginLeft: "4px" }}>
                                        <strong style={{ color: "#fff" }}>{t.title}</strong>
                                        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "4px" }}>
                                            <span
                                                className="demo-transaction-category"
                                                style={{ backgroundColor: `${categoryColor}22`, color: categoryColor, border: `1px solid ${categoryColor}44` }}
                                            >
                                                {categoryName}
                                            </span>
                                            <span style={{ color: "#94a3b8", fontSize: "12px" }}>
                                                {t.transaction_date}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                        <div className={`demo-transaction-amount ${t.type === "income" ? "stat-positive" : "stat-negative"}`} style={{ fontSize: "16px" }}>
                                            {t.type === "income" ? "+" : "-"}
                                            {parseFloat(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                                        </div>

                                        <div style={{ display: "flex", gap: "6px" }}>
                                            <button
                                                onClick={() => navigate(`/transactions/edit/${t.id}`)}
                                                title="Editar"
                                                style={{
                                                    background: "rgba(255,255,255,0.06)",
                                                    border: "1px solid var(--border)",
                                                    borderRadius: "8px",
                                                    padding: "6px 10px",
                                                    cursor: "pointer",
                                                    fontSize: "13px",
                                                    color: "#fff",
                                                    transition: "background 0.2s"
                                                }}
                                            >
                                                ✏️
                                            </button>

                                            <button
                                                onClick={() => deleteTransaction(t.id)}
                                                title="Eliminar"
                                                style={{
                                                    background: "rgba(239, 68, 68, 0.12)",
                                                    border: "1px solid rgba(239, 68, 68, 0.3)",
                                                    borderRadius: "8px",
                                                    padding: "6px 10px",
                                                    cursor: "pointer",
                                                    fontSize: "13px",
                                                    color: "#ef4444",
                                                    transition: "background 0.2s"
                                                }}
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

            </div>
        </MainLayout>
    );
}