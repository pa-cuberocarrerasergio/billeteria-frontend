import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function EditSavingGoal() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        target_amount: "",
        current_amount: "",
        target_date: "",
        priority: "medium",
        emoji: "🎯",
    });

    useEffect(() => {

        loadGoal();

    }, []);

    const loadGoal = async () => {

        try {

            const response =
                await api.get(
                    `/saving-goals/${id}`
                );

            setForm(response.data);

        } catch (error) {

            console.error(error);
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.put(
                `/saving-goals/${id}`,
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
                        Editar Objetivo
                    </h1>

                    <form onSubmit={handleSubmit}>

                        <input
                            value={form.emoji || ""}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    emoji:
                                        e.target.value,
                                })
                            }
                        />

                        <input
                            value={form.title || ""}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    title:
                                        e.target.value,
                                })
                            }
                        />

                        <textarea
                            rows="4"
                            value={
                                form.description ||
                                ""
                            }
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description:
                                        e.target.value,
                                })
                            }
                        />

                        <input
                            type="number"
                            value={
                                form.target_amount ||
                                ""
                            }
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
                            value={
                                form.current_amount ||
                                ""
                            }
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
                            value={
                                form.target_date ||
                                ""
                            }
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
                        >
                            Guardar cambios
                        </button>

                    </form>

                </div>

            </div>
        </>
    );
}