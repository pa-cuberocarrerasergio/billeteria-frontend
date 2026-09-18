import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

export default function EditTransaction() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        title: "",
        amount: "",
        type: "expense",
        category_id: "",
        transaction_date: "",
    });

    useEffect(() => {
        loadTransaction();
        loadCategories();
    }, [id]);

    const loadCategories = async () => {
        try {
            const response = await api.get("/categories");
            setCategories(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadTransaction = async () => {
        try {
            const response = await api.get(`/transactions/${id}`);
            setForm(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/transactions/${id}`, form);
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

    if (loading) {
        return (
            <MainLayout>
                <div className="page-container">
                    <p>Cargando transacción...</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="page-container">
                <div className="glass-card">
                    <h1>Editar Transacción</h1>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", textAlign: "left" }}>

                        <div>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Título *</label>
                            <input
                                type="text"
                                placeholder="Ej: Compra en supermercado"
                                required
                                value={form.title || ""}
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
                                value={form.amount || ""}
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
                                        onClick={() => setForm({ ...form, type: opt.value, category_id: "" })}
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
                            <select
                                required
                                value={form.category_id || ""}
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
                                value={form.transaction_date || ""}
                                onChange={(e) => setForm({ ...form, transaction_date: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            className="edit-btn"
                            style={{ marginTop: "20px" }}
                        >
                            Guardar cambios
                        </button>

                    </form>
                </div>
            </div>
        </MainLayout>
    );
}