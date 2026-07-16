import { useEffect, useRef, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

export default function Coach() {

    const [message, setMessage] = useState("");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        loadHistory();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [history, loading]);

    const scrollToBottom = () => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    };

    const loadHistory = async () => {

        try {

            const response =
                await api.get("/coach/history");

            const formattedHistory = [];

            response.data.forEach((item) => {

                formattedHistory.push({
                    id: `${item.id}-user`,
                    role: "user",
                    text: item.message,
                });

                formattedHistory.push({
                    id: `${item.id}-coach`,
                    role: "coach",
                    text: item.response,
                });
            });

            setHistory(formattedHistory);

        } catch (error) {

            console.error(error);
        }
    };

    const sendMessage = async (e) => {

        e.preventDefault();

        if (!message.trim()) return;

        const userMessage = message;

        setMessage("");

        setHistory((prev) => [
            ...prev,
            {
                id: Date.now(),
                role: "user",
                text: userMessage,
            },
        ]);

        setLoading(true);

        try {

            const response =
                await api.post("/coach/chat", {
                    message: userMessage,
                });

            setHistory((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: "coach",
                    text: response.data.reply,
                },
            ]);

        } catch (error) {

            console.error(error);
        }

        setLoading(false);
    };

    return (

        <MainLayout>

            <div className="coach-container">

                <div className="glass-card">

                    <h2>💵 Billetín</h2>

                    <p>
                        Tu coach financiero personal
                    </p>

                </div>

                <div className="chat-messages">

                    {history.map((item) => (

                        <div
                            key={item.id}
                            className={
                                item.role === "user"
                                    ? "user-message"
                                    : "coach-message"
                            }
                        >
                            {item.text}
                        </div>
                    ))}

                    {loading && (

                        <div className="coach-message">

                            💵 Billetín está analizando tus finanzas...

                        </div>
                    )}

                    <div ref={messagesEndRef}></div>

                </div>

                <form
                    onSubmit={sendMessage}
                    className="chat-input-container"
                >

                    <input
                        type="text"
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        placeholder="Pregunta algo a Billetín..."
                        className="chat-input"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="chat-send-btn"
                    >
                        Enviar
                    </button>

                </form>

                <button
                    onClick={scrollToBottom}
                    className="scroll-bottom-btn"
                >
                    ↓
                </button>

            </div>

        </MainLayout>
    );
}