import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function EditTransaction() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

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

    }, []);

    const loadCategories = async () => {

        try {

            const response =
                await api.get("/categories");

            setCategories(response.data);

        } catch (error) {

            console.error(error);
        }
    };

    const loadTransaction = async () => {

        try {

            const response =
                await api.get(
                    `/transactions/${id}`
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
                `/transactions/${id}`,
                form
            );

            navigate("/transactions");

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
                        Editar Transacción
                    </h1>

                    <form onSubmit={handleSubmit}>

                        <input
                            type="text"
                            value={form.title || ""}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    title:
                                        e.target.value,
                                })
                            }
                        />

                        <input
                            type="number"
                            step="0.01"
                            value={form.amount || ""}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    amount:
                                        e.target.value,
                                })
                            }
                        />

                        <select
                            value={form.type || ""}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    type:
                                        e.target.value,
                                })
                            }
                        >
                            <option value="expense">
                                Gasto
                            </option>

                            <option value="income">
                                Ingreso
                            </option>
                        </select>

                        <select
                            value={
                                form.category_id || ""
                            }
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    category_id:
                                        e.target.value,
                                })
                            }
                        >
                            {categories.map(
                                (category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                )
                            )}
                        </select>

                        <input
                            type="date"
                            value={
                                form.transaction_date ||
                                ""
                            }
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    transaction_date:
                                        e.target.value,
                                })
                            }
                        />

                        <button
                            className="edit-btn"
                            type="submit"
                        >
                            Guardar cambios
                        </button>

                    </form>

                </div>

            </div>
        </>
    );
}