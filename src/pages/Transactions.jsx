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

    return (
        <>
            <Navbar />

            <div>
                <h1>Transacciones</h1>

                {transactions.length === 0 ? (
                    <p>No hay transacciones.</p>
                ) : (
                    transactions.map((transaction) => (
                        <div key={transaction.id}>
                            <h3>{transaction.title}</h3>

                            <p>
                                <strong>Importe:</strong>{" "}
                                {transaction.amount} €
                            </p>

                            <p>
                                <strong>Tipo:</strong>{" "}
                                {transaction.type}
                            </p>

                            <hr />
                        </div>
                    ))
                )}
            </div>
        </>
    );
}