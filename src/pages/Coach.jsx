import { useEffect, useRef, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";
import BilletinAvatar from "../components/BilletinAvatar";

export default function Coach() {

    const [message, setMessage] = useState("");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const [avatarMood, setAvatarMood] =
        useState("normal");

    const messagesEndRef = useRef(null);

    const quickPrompts = [
        "¿Cuánto puedo ahorrar este mes?",
        "Analiza mis gastos",
        "¿Voy bien con mis objetivos?",
        "¿En qué gasto más dinero?",
        "Dame un consejo financiero",
    ];

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

    const handleQuickPrompt = (prompt) => {

        setMessage(prompt);
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
                    time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                });

                formattedHistory.push({
                    id: `${item.id}-coach`,
                    role: "coach",
                    text: item.response,
                    mood: item.mood || "normal",
                    time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
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
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            },
        ]);

        setLoading(true);

        setAvatarMood("thinking");

        try {

            const response =
                await api.post("/coach/chat", {
                    message: userMessage,
                });

            const reply =
                response.data.reply;

            setAvatarMood(
                response.data.mood || "normal"
            );

            setHistory((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: "coach",
                    text: reply,
                    mood: response.data.mood || "normal",
                    time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                },
            ]);

        } catch (error) {

            console.error(error);

            setAvatarMood("worried");

        } finally {

            setLoading(false);
        }
    };

    return (

        <MainLayout>

            <div className="coach-container">

                {/* HEADER */}

                <div className="glass-card coach-header">

                    <BilletinAvatar
                        size={80}
                        mood={avatarMood}
                    />

                    <div>

                        <h2>Billetín IA</h2>

                        <p>
                            Tu coach financiero personal
                        </p>

                    </div>

                </div>

                {/* MENSAJES */}

                <div className="chat-messages">

                    {history.length === 0 && !loading && (

                        <div className="welcome-card">

                            <BilletinAvatar
                                size={90}
                                mood={avatarMood}
                            />

                            <h2>
                                Hola 👋 Soy Billetín
                            </h2>

                            <p>
                                Puedo ayudarte a ahorrar,
                                analizar gastos,
                                planificar objetivos y
                                mejorar tus finanzas
                                personales.
                            </p>

                        </div>

                    )}

                    {history.map((item) => (

                        item.role === "user" ? (

                            <div
                                key={item.id}
                                className="user-message-wrapper"
                            >

                                <div
                                    className="user-message"
                                >
                                    {item.text}
                                </div>

                                <small>
                                    {item.time}
                                </small>

                            </div>

                        ) : (

                            <div
                                key={item.id}
                                className="coach-row"
                            >

                                <BilletinAvatar
                                    size={40}
                                    mood={item.mood || "normal"}
                                />

                                <div>

                                    <div
                                        className="coach-message"
                                    >
                                        {item.text}
                                    </div>

                                    <small
                                        className="message-time"
                                    >
                                        {item.time}
                                    </small>

                                </div>

                            </div>

                        )

                    ))}

                    {loading && (

                        <div className="coach-row">

                            <BilletinAvatar
                                size={40}
                                mood="thinking"
                            />

                            <div
                                className="coach-message"
                            >

                                <span
                                    className="typing-dot"
                                ></span>

                                <span
                                    className="typing-dot"
                                ></span>

                                <span
                                    className="typing-dot"
                                ></span>

                            </div>

                        </div>

                    )}

                    <div
                        ref={messagesEndRef}
                    ></div>

                </div>

                {/* QUICK PROMPTS */}

                <div className="quick-prompts">

                    {quickPrompts.map((prompt) => (

                        <button
                            key={prompt}
                            type="button"
                            className="quick-prompt-btn"
                            onClick={() =>
                                handleQuickPrompt(prompt)
                            }
                        >
                            {prompt}
                        </button>

                    ))}

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
                            setMessage(
                                e.target.value
                            )
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

            </div>

        </MainLayout>
    );
}