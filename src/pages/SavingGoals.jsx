import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function SavingGoals() {

    const [goals, setGoals] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadGoals();
    }, []);

    const loadGoals = async () => {

        try {

            const response = await api.get(
                "/saving-goals"
            );

            setGoals(response.data);

        } catch (error) {

            console.error(error);
        }
    };

    const deleteGoal = async (id) => {

        const confirmed = window.confirm(
            "¿Eliminar objetivo?"
        );

        if (!confirmed) return;

        try {

            await api.delete(
                `/saving-goals/${id}`
            );

            loadGoals();

        } catch (error) {

            console.error(error);
        }
    };

    const editGoal = (goal) => {

        alert(
            `Editar objetivo:\n${goal.title}\n\n(Lo implementaremos en el siguiente paso)`
        );
    };

    return (
        <>
            <Navbar />

            <div className="page-container">

                <h1>Objetivos de ahorro</h1>

                <button
                    className="edit-btn"
                    onClick={() => navigate("/saving-goals/create")}
                    style={{
                        marginBottom: "20px"
                    }}
                >
                    + Nuevo Objetivo
                </button>

                {goals.length === 0 ? (

                    <p>
                        No hay objetivos creados.
                    </p>

                ) : (

                    goals.map((goal) => (

                        <div
                            key={goal.id}
                            className="glass-card"
                            style={{ marginBottom: "15px" }}
                        >

                            <h3>
                                {goal.emoji} {goal.title}
                            </h3>

                            <p>
                                <strong>
                                    Progreso:
                                </strong>{" "}
                                {goal.current_amount} €
                                {" / "}
                                {goal.target_amount} €
                            </p>

                            <p>
                                <strong>
                                    Prioridad:
                                </strong>{" "}
                                {goal.priority}
                            </p>

                            <p>
                                <strong>
                                    Fecha objetivo:
                                </strong>{" "}
                                {goal.target_date}
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    marginTop: "10px",
                                }}
                            >

                                <button
                                    className="edit-btn"
                                    style={{
                                        marginRight: "10px"
                                    }}
                                    onClick={() =>
                                        navigate(
                                            `/saving-goals/edit/${goal.id}`
                                        )
                                    }
                                >
                                    ✏️ Editar
                                </button>

                                <button
                                    className="danger-btn"
                                    onClick={() =>
                                        deleteGoal(goal.id)
                                    }
                                >
                                    🗑 Eliminar
                                </button>

                            </div>

                        </div>
                    ))
                )}

            </div>
        </>
    );
}