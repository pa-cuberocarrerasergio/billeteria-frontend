import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function CreateSavingGoal() {

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

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.post(
                "/saving-goals",
                form
            );

            navigate("/saving-goals");

        } catch (error) {

            console.error(error);
        }
    };

    return (
        <>
            <Navbar />

            <div className="page-container">

                <div className="glass-card">

                    <h1>
                        Nuevo Objetivo
                    </h1>

                    <form onSubmit={handleSubmit}>

                        <input
                            type="text"
                            placeholder="Emoji"
                            value={form.emoji}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    emoji: e.target.value,
                                })
                            }
                        />

                        <input
                            type="text"
                            placeholder="Título"
                            value={form.title}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    title: e.target.value,
                                })
                            }
                        />

                        <textarea
                            rows="4"
                            placeholder="Descripción"
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                        />

                        <input
                            type="number"
                            step="0.01"
                            placeholder="Meta (€)"
                            value={form.target_amount}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    target_amount:
                                        e.target.value,
                                })
                            }
                        />

                        <input
                            type="number"
                            step="0.01"
                            placeholder="Cantidad actual (€)"
                            value={form.current_amount}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    current_amount:
                                        e.target.value,
                                })
                            }
                        />

                        <input
                            type="date"
                            value={form.target_date}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    target_date:
                                        e.target.value,
                                })
                            }
                        />

                        <select
                            value={form.priority}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    priority:
                                        e.target.value,
                                })
                            }
                        >
                            <option value="high">
                                Alta
                            </option>

                            <option value="medium">
                                Media
                            </option>

                            <option value="low">
                                Baja
                            </option>
                        </select>

                        <button
                            type="submit"
                            className="edit-btn"
                            style={{
                                marginTop: "20px",
                            }}
                        >
                            Guardar Objetivo
                        </button>

                    </form>

                </div>

            </div>
        </>
    );
}