import { useEffect, useRef, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";
import BilletinAvatar from "../components/BilletinAvatar";

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

        } finally {

            setLoading(false);
        }
    };

    return (

        <MainLayout>

            <div className="coach-container">

                {/* CABECERA */}

                <div className="glass-card">

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                        }}
                    >

                        <BilletinAvatar size={80} />

                        <div>

                            <h2
                                style={{
                                    margin: 0,
                                }}
                            >
                                Billetín
                            </h2>

                            <p
                                style={{
                                    margin: 0,
                                    color: "#94A3B8",
                                }}
                            >
                                Tu coach financiero personal
                            </p>

                        </div>

                    </div>

                </div>

                {/* CHAT */}

                <div className="chat-messages">

                    {history.map((item) => (

                        item.role === "user" ? (

                            <div
                                key={item.id}
                                className="user-message"
                            >
                                {item.text}
                            </div>

                        ) : (

                            <div
                                key={item.id}
                                style={{
                                    display: "flex",
                                    gap: "12px",
                                    alignItems: "flex-start",
                                    marginBottom: "16px",
                                }}
                            >

                                <BilletinAvatar size={40} />

                                <div className="coach-message">
                                    {item.text}
                                </div>

                            </div>

                        )

                    ))}

                    {loading && (

                        <div
                            style={{
                                display: "flex",
                                gap: "12px",
                                alignItems: "center",
                                marginBottom: "16px",
                            }}
                        >

                            <BilletinAvatar size={40} />

                            <div className="coach-message">

                                Billetín está analizando tus finanzas...

                            </div>

                        </div>

                    )}

                    <div ref={messagesEndRef}></div>

                </div>

                {/* INPUT */}

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

                {/* BOTÓN SCROLL */}

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