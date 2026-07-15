import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Transactions() {

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {

        try {

            const response = await api.get("/transactions");

            setTransactions(response.data);

        } catch (error) {

            console.error(error);
        }
    };

    const deleteTransaction = async (id) => {

        const confirmed = window.confirm(
            "¿Eliminar transacción?"
        );

        if (!confirmed) return;

        try {

            await api.delete(`/transactions/${id}`);

            loadTransactions();

        } catch (error) {

            console.error(error);
        }
    };

    return (
        <>
            <Navbar />

            <div className="page-container">

                <h1>Transacciones</h1>

                {transactions.length === 0 ? (

                    <p>No hay transacciones.</p>

                ) : (

                    transactions.map((transaction) => (

                        <div
                            key={transaction.id}
                            className="glass-card"
                            style={{ marginBottom: "15px" }}
                        >

                            <h3>
                                {transaction.title}
                            </h3>

                            <p>
                                <strong>Importe:</strong>{" "}
                                {transaction.amount} €
                            </p>

                            <p>
                                <strong>Tipo:</strong>{" "}
                                {transaction.type}
                            </p>

                            <p>
                                <strong>Fecha:</strong>{" "}
                                {transaction.transaction_date}
                            </p>

                            <button
                                className="danger-btn"
                                onClick={() =>
                                    deleteTransaction(
                                        transaction.id
                                    )
                                }
                            >
                                🗑 Eliminar
                            </button>

                        </div>
                    ))
                )}

            </div>
        </>
    );
}