import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

export default function CreateTransaction() {

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
        loadCategories();
    }, []);

    const loadCategories = async () => {

        try {

            const response = await api.get("/categories");

            setCategories(response.data);

        } catch (error) {

            console.error(error);
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.post(
                "/transactions",
                form
            );

            navigate("/transactions");

        } catch (error) {

            console.error(error);
        }
    };

    return (
        
            <MainLayout>

                <div className="page-container">

                    <div className="glass-card">

                        <h1>
                            Nueva Transacción
                        </h1>

                        <form onSubmit={handleSubmit}>

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

                            <input
                                type="number"
                                step="0.01"
                                placeholder="Importe"
                                value={form.amount}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        amount: e.target.value,
                                    })
                                }
                            />

                            <select
                                value={form.type}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        type: e.target.value,
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
                                value={form.category_id}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        category_id:
                                            e.target.value,
                                    })
                                }
                            >
                                <option value="">
                                    Selecciona categoría
                                </option>

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
                                    form.transaction_date
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
                                type="submit"
                                className="edit-btn"
                                style={{
                                    marginTop: "20px",
                                }}
                            >
                                Guardar
                            </button>

                        </form>

                    </div>

                </div>
            </MainLayout>
    );
}