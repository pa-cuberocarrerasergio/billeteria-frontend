import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

export default function EditSavingGoal() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        target_amount: "",
        current_amount: 0,
        target_date: "",
        priority: "medium",
        emoji: "🎯",
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGoal();
    }, [id]);

    const loadGoal = async () => {
        try {
            const response = await api.get(`/saving-goals/${id}`);
            const data = response.data;
            setForm({
                title: data.title,
                description: data.description || "",
                target_amount: data.target_amount,
                current_amount: data.current_amount,
                target_date: data.target_date,
                priority: data.priority,
                emoji: data.emoji || "🎯",
            });
            setLoading(false);
        } catch (error) {
            console.error(error);
            navigate("/saving-goals");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/saving-goals/${id}`, form);
            navigate("/saving-goals");
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="page-container">
                    <p>Cargando objetivo...</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="page-container">
                <div className="glass-card">
                    <h1>Editar Objetivo</h1>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", textAlign: "left" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Elige un emoji</label>
                            
                            <div style={{ textAlign: "center", fontSize: "52px", marginBottom: "10px", lineHeight: 1 }}>
                                {form.emoji}
                            </div>

                            {[
                                { label: "🚗 Vehículos", emojis: ["🚗", "🏎️", "🚙", "🛻", "🏍️", "🚐", "✈️", "🚤", "⛵", "🛥️", "🚁", "🛵"] },
                                { label: "🏠 Hogar", emojis: ["🏠", "🏡", "🏗️", "🏢", "🛋️", "🪟", "🏊", "🪴", "🛁", "🔑", "🪣", "🏚️"] },
                                { label: "🌴 Viajes & Ocio", emojis: ["🌴", "🏖️", "🌊", "⛷️", "🎿", "🗺️", "🧳", "🌍", "🗼", "🎡", "🎢", "🏕️"] },
                                { label: "💻 Tecnología", emojis: ["💻", "📱", "🖥️", "🎮", "⌚", "📷", "🎧", "📺", "🖨️", "💾", "🕹️", "🔋"] },
                                { label: "🎓 Formación & Otros", emojis: ["🎓", "📚", "🏋️", "💍", "💎", "🎸", "🎨", "🍽️", "🎯", "🌟", "💰", "🏆"] }
                            ].map((group) => (
                                <div key={group.label} style={{ marginBottom: "10px" }}>
                                    <p style={{ margin: "0 0 6px 0", fontSize: "12px", color: "var(--text-h)", fontWeight: "bold" }}>{group.label}</p>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                        {group.emojis.map((emoji) => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => setForm({ ...form, emoji })}
                                                title={emoji}
                                                style={{
                                                    fontSize: "22px",
                                                    width: "38px",
                                                    height: "38px",
                                                    borderRadius: "8px",
                                                    border: form.emoji === emoji ? "2px solid var(--accent)" : "1px solid var(--border)",
                                                    backgroundColor: form.emoji === emoji ? "rgba(var(--accent-rgb, 139,92,246), 0.15)" : "var(--bg)",
                                                    cursor: "pointer",
                                                    transition: "all 0.2s ease",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    transform: form.emoji === emoji ? "scale(1.15)" : "scale(1)"
                                                }}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Título *</label>
                            <input
                                type="text"
                                placeholder="Ej: Viaje a Japón"
                                required
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Descripción</label>
                            <textarea
                                rows="4"
                                placeholder="Detalles sobre el objetivo..."
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Meta (€) *</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                placeholder="0.00"
                                required
                                value={form.target_amount}
                                onChange={(e) => setForm({ ...form, target_amount: e.target.value })}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Cantidad actual (€) *</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                required
                                value={form.current_amount}
                                onChange={(e) => setForm({ ...form, current_amount: e.target.value })}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Fecha límite *</label>
                            <input
                                type="date"
                                required
                                value={form.target_date}
                                onChange={(e) => setForm({ ...form, target_date: e.target.value })}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Prioridad *</label>
                            <div style={{ display: "flex", gap: "10px" }}>
                                {[
                                    { value: "high", label: "Alta" },
                                    { value: "medium", label: "Media" },
                                    { value: "low", label: "Baja" }
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setForm({ ...form, priority: opt.value })}
                                        style={{
                                            flex: 1,
                                            padding: "10px",
                                            borderRadius: "8px",
                                            border: "1px solid var(--border)",
                                            backgroundColor: form.priority === opt.value ? "var(--accent)" : "var(--bg)",
                                            color: form.priority === opt.value ? "#fff" : "var(--text)",
                                            cursor: "pointer",
                                            transition: "all 0.3s ease",
                                            fontWeight: form.priority === opt.value ? "bold" : "normal"
                                        }}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="edit-btn" style={{ marginTop: "20px" }}>
                            Guardar Cambios
                        </button>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}