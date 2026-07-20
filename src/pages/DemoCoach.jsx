import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";
import BilletinAvatar from "../components/BilletinAvatar";

const DEMO_MSG_LIMIT = 3;

export default function DemoCoach() {

    const [message, setMessage] = useState("");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [avatarMood, setAvatarMood] = useState("happy");
    const [msgCount, setMsgCount] = useState(0);
    const limitReached = msgCount >= DEMO_MSG_LIMIT;

    const messagesEndRef = useRef(null);

    const quickPrompts = [
        "¿Cuánto puedo ahorrar este mes?",
        "Analiza mis gastos de ejemplo",
        "Dame un consejo financiero",
        "¿Voy bien con mis objetivos?",
        "¿Cómo puedo ahorrar más?",
    ];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history, loading]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || limitReached) return;

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
            const response = await api.post("/demo/coach/chat", {
                message: userMessage,
            });

            const reply = response.data.reply;
            const mood = response.data.mood || "normal";

            setAvatarMood(mood);
            setMsgCount((prev) => prev + 1);

            setHistory((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: "coach",
                    text: reply,
                    mood,
                    time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                },
            ]);

        } catch (error) {
            console.error(error);
            setAvatarMood("worried");
            setHistory((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: "coach",
                    text: "Ha ocurrido un error. Por favor, inténtalo de nuevo.",
                    mood: "worried",
                    time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickPrompt = (prompt) => {
        if (limitReached) return;
        setMessage(prompt);
    };

    return (
        <MainLayout>

            {/* BANNER MODO DEMO */}
            <div className="demo-banner">
                <span className="demo-banner-icon">🚀</span>
                <div className="demo-banner-text">
                    <strong>Modo Demo — Coach IA</strong>
                    <span>
                        Estás usando la versión de prueba.
                        Tienes <strong>{DEMO_MSG_LIMIT - msgCount} mensaje{DEMO_MSG_LIMIT - msgCount !== 1 ? "s" : ""}</strong> restante{DEMO_MSG_LIMIT - msgCount !== 1 ? "s" : ""}.
                    </span>
                </div>
                <Link to="/login" className="demo-banner-btn">
                    Registrarse gratis →
                </Link>
            </div>

            <div className="coach-container">

                {/* HEADER */}
                <div className="glass-card coach-header">
                    <BilletinAvatar size={80} mood={avatarMood} />
                    <div>
                        <h2>Billetín IA <span className="demo-tag">DEMO</span></h2>
                        <p>Tu coach financiero personal con inteligencia artificial</p>
                    </div>
                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                        <div className="demo-counter">
                            <span className={`demo-counter-num ${limitReached ? "depleted" : ""}`}>
                                {DEMO_MSG_LIMIT - msgCount}
                            </span>
                            <span className="demo-counter-label">mensajes restantes</span>
                        </div>
                    </div>
                </div>

                {/* MENSAJES */}
                <div className="chat-messages">

                    {history.length === 0 && !loading && (
                        <div className="welcome-card">
                            <BilletinAvatar size={90} mood="happy" />
                            <h2>¡Hola! Soy Billetín 👋</h2>
                            <p>
                                En modo demo puedes hacerme hasta <strong>{DEMO_MSG_LIMIT} preguntas</strong> sobre finanzas personales.
                                Regístrate gratis para conversaciones ilimitadas.
                            </p>
                        </div>
                    )}

                    {history.map((item) => (
                        item.role === "user" ? (
                            <div key={item.id} className="user-message-wrapper">
                                <div className="user-message">{item.text}</div>
                                <small>{item.time}</small>
                            </div>
                        ) : (
                            <div key={item.id} className="coach-row">
                                <BilletinAvatar size={40} mood={item.mood || "normal"} />
                                <div>
                                    <div className="coach-message">{item.text}</div>
                                    <small className="message-time">{item.time}</small>
                                </div>
                            </div>
                        )
                    ))}

                    {loading && (
                        <div className="coach-row">
                            <BilletinAvatar size={40} mood="thinking" />
                            <div className="coach-message">
                                <span className="typing-dot" />
                                <span className="typing-dot" />
                                <span className="typing-dot" />
                            </div>
                        </div>
                    )}

                    {/* Límite alcanzado */}
                    {limitReached && (
                        <div className="demo-limit-message glass-card">
                            <BilletinAvatar size={60} mood="worried" />
                            <h3>🔒 Límite de demo alcanzado</h3>
                            <p>
                                Has usado tus {DEMO_MSG_LIMIT} mensajes de prueba.
                                Regístrate gratis para conversaciones ilimitadas con Billetín.
                            </p>
                            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16 }}>
                                <Link to="/login" className="landing-btn-primary">
                                    🚀 Crear cuenta gratis
                                </Link>
                                <Link to="/" className="landing-btn-secondary">
                                    Volver al inicio
                                </Link>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* QUICK PROMPTS */}
                {!limitReached && (
                    <div className="quick-prompts">
                        {quickPrompts.map((prompt) => (
                            <button
                                key={prompt}
                                type="button"
                                className="quick-prompt-btn"
                                onClick={() => handleQuickPrompt(prompt)}
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                )}

                {/* INPUT */}
                <form
                    onSubmit={sendMessage}
                    className="chat-input-container"
                >
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={
                            limitReached
                                ? "Límite alcanzado — regístrate para continuar"
                                : `Pregunta algo a Billetín... (${DEMO_MSG_LIMIT - msgCount} restantes)`
                        }
                        className="chat-input"
                        disabled={limitReached}
                    />
                    <button
                        type="submit"
                        disabled={loading || limitReached}
                        className="chat-send-btn"
                    >
                        {limitReached ? "🔒" : "Enviar"}
                    </button>
                </form>

            </div>
        </MainLayout>
    );
}