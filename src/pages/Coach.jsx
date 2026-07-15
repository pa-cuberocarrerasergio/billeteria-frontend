import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
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
        <>
            <Navbar />

            <div style={{ padding: "20px" }}>

                <h1>Coach IA</h1>

                <div>

                    {history.map((item) => (

                        <div
                            key={item.id}
                            style={{
                                marginBottom: "15px",
                                textAlign:
                                    item.role === "user"
                                        ? "right"
                                        : "left",
                            }}
                        >
                            <div
                                style={{
                                    display: "inline-block",
                                    maxWidth: "75%",
                                    padding: "12px",
                                    borderRadius: "10px",
                                    background:
                                        item.role === "user"
                                            ? "#dbeafe"
                                            : "#f3f4f6",
                                    whiteSpace:
                                        "pre-wrap",
                                }}
                            >
                                {item.text}
                            </div>
                        </div>
                    ))}

                    {loading && (

                        <div
                            style={{
                                marginBottom: "15px",
                            }}
                        >
                            🤖 Pensando...
                        </div>
                    )}

                    <div
                        ref={messagesEndRef}
                    ></div>

                </div>

                <form
                    onSubmit={sendMessage}
                    style={{
                        marginTop: "20px",
                    }}
                >
                    <input
                        type="text"
                        value={message}
                        onChange={(e) =>
                            setMessage(
                                e.target.value
                            )
                        }
                        placeholder="Pregunta algo a tu coach..."
                        style={{
                            width: "75%",
                            padding: "10px",
                        }}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginLeft: "10px",
                            padding:
                                "10px 20px",
                        }}
                    >
                        Enviar
                    </button>
                </form>

                <button
                    onClick={scrollToBottom}
                    style={{
                        position: "fixed",
                        right: "25px",
                        bottom: "25px",
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        cursor: "pointer",
                    }}
                >
                    ↓
                </button>

            </div>
        </>
    );
}