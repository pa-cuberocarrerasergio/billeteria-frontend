import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

export default function CreateTransaction() {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [savingGoals, setSavingGoals] = useState([]);

    const [form, setForm] = useState({
        title: "",
        amount: "",
        type: "expense",
        category_id: "",
        transaction_date: "",
        saving_goal_id: "",
        saving_amount: "",
    });

    useEffect(() => {
        loadCategories();
        loadSavingGoals();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await api.get("/categories");
            setCategories(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadSavingGoals = async () => {
        try {
            const response = await api.get("/saving-goals");
            setSavingGoals(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Build the payload, only send saving fields if they're filled
        const payload = { ...form };
        if (!payload.saving_goal_id || !payload.saving_amount) {
            delete payload.saving_goal_id;
            delete payload.saving_amount;
        }

        try {
            await api.post("/transactions", payload);
            navigate("/transactions");
        } catch (error) {
            console.error(error);
        }
    };

    const btnStyle = (active) => ({
        flex: 1,
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid var(--border)",
        backgroundColor: active ? "var(--accent)" : "var(--bg)",
        color: active ? "#fff" : "var(--text)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        fontWeight: active ? "bold" : "normal"
    });

    const catBtnStyle = (active) => ({
        padding: "8px 5px",
        borderRadius: "8px",
        border: "1px solid var(--border)",
        backgroundColor: active ? "var(--accent)" : "var(--bg)",
        color: active ? "#fff" : "var(--text)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        fontSize: "14px",
        fontWeight: active ? "bold" : "normal",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    });

    return (
        <MainLayout>
            <div className="page-container">
                <div className="glass-card">
                    <h1>Nueva Transacción</h1>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", textAlign: "left" }}>

                        <div>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Título *</label>
                            <input
                                type="text"
                                placeholder="Ej: Compra en supermercado"
                                required
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Importe (€) *</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                placeholder="0.00"
                                required
                                value={form.amount}
                                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Tipo *</label>
                            <div style={{ display: "flex", gap: "10px" }}>
                                {[
                                    { value: "expense", label: "💸 Gasto" },
                                    { value: "income", label: "💰 Ingreso" }
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setForm({ ...form, type: opt.value, category_id: "", saving_goal_id: "", saving_amount: "" })}
                                        style={btnStyle(form.type === opt.value)}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Categoría *</label>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                                {categories
                                    .filter(category => category.type === form.type)
                                    .map((category) => (
                                        <button
                                            key={category.id}
                                            type="button"
                                            onClick={() => setForm({ ...form, category_id: category.id })}
                                            style={catBtnStyle(form.category_id === category.id)}
                                            title={category.name}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                            </div>
                            {/* Hidden select for native HTML5 validation */}
                            <select
                                required
                                value={form.category_id}
                                onChange={() => {}}
                                style={{ opacity: 0, height: 0, width: 0, position: "absolute", pointerEvents: "none" }}
                            >
                                <option value="" disabled>Selecciona categoría</option>
                                {categories
                                    .filter(c => c.type === form.type)
                                    .map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Fecha *</label>
                            <input
                                type="date"
                                required
                                value={form.transaction_date}
                                onChange={(e) => setForm({ ...form, transaction_date: e.target.value })}
                            />
                        </div>

                        {/* Savings section — only shown for income */}
                        {form.type === "income" && savingGoals.length > 0 && (
                            <div style={{
                                borderTop: "1px solid var(--border)",
                                paddingTop: "15px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px"
                            }}>
                                <p style={{ margin: 0, fontWeight: "bold", color: "var(--accent)" }}>
                                    🎯 ¿Quieres destinar parte de este ingreso a un objetivo de ahorro?
                                </p>

                                <div>
                                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Objetivo de ahorro (opcional)</label>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                                        {savingGoals.map((goal) => (
                                            <button
                                                key={goal.id}
                                                type="button"
                                                onClick={() => setForm({
                                                    ...form,
                                                    saving_goal_id: form.saving_goal_id === goal.id ? "" : goal.id,
                                                    saving_amount: form.saving_goal_id === goal.id ? "" : form.saving_amount
                                                })}
                                                style={{
                                                    ...catBtnStyle(form.saving_goal_id === goal.id),
                                                    whiteSpace: "normal",
                                                    textAlign: "left",
                                                    padding: "10px"
                                                }}
                                            >
                                                <span style={{ fontSize: "18px" }}>{goal.emoji}</span> {goal.title}
                                                <br />
                                                <span style={{ fontSize: "12px", opacity: 0.7 }}>
                                                    {parseFloat(goal.current_amount).toFixed(2)}€ / {parseFloat(goal.target_amount).toFixed(2)}€
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {form.saving_goal_id && (
                                    <div>
                                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                                            Cantidad a ahorrar (€)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            max={form.amount || undefined}
                                            placeholder="0.00"
                                            value={form.saving_amount}
                                            onChange={(e) => setForm({ ...form, saving_amount: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="edit-btn"
                            style={{ marginTop: "20px" }}
                        >
                            Guardar Transacción
                        </button>

                    </form>
                </div>
            </div>
        </MainLayout>
    );
}