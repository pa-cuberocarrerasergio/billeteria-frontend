import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function SavingGoals() {
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        loadGoals();
    }, []);

    const loadGoals = async () => {
        try {
            const response = await api.get("/saving-goals");
            setGoals(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Navbar />

            <div>
                <h1>Objetivos de ahorro</h1>

                {goals.length === 0 ? (
                    <p>No hay objetivos creados.</p>
                ) : (
                    goals.map((goal) => (
                        <div key={goal.id}>
                            <h3>
                                {goal.emoji} {goal.title}
                            </h3>

                            <p>
                                <strong>Progreso:</strong>{" "}
                                {goal.current_amount} € / {goal.target_amount} €
                            </p>

                            <p>
                                <strong>Prioridad:</strong>{" "}
                                {goal.priority}
                            </p>

                            <p>
                                <strong>Fecha objetivo:</strong>{" "}
                                {goal.target_date}
                            </p>

                            <hr />
                        </div>
                    ))
                )}
            </div>
        </>
    );
}