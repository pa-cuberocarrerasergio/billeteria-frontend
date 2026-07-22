import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";
import BilletinAvatar from "../components/BilletinAvatar";

const DEMO_MSG_LIMIT = 3;

export default function DemoCoach() {

    // Onboarding states
    const [onboardingStep, setOnboardingStep] = useState(() => {
        // Check localStorage for existing preferences
        const savedName = localStorage.getItem("billetin_demo_user_name");
        const savedTone = localStorage.getItem("billetin_demo_user_tone");
        if (savedName && savedTone) {
            return null; // Onboarding complete
        } else if (savedName) {
            return 2; // Need to pick tone
        } else {
            return 1; // Need to enter name
        }
    });
    const [userName, setUserName] = useState(localStorage.getItem("billetin_demo_user_name") || "");
    const [userTone, setUserTone] = useState(localStorage.getItem("billetin_demo_user_tone") || "");

    // Original states
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
                userName: userName || "",
                userTone: userTone || "cercano",
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

    // Onboarding handlers
    const handleNameSubmit = (e) => {
        e.preventDefault();
        if (!userName.trim()) return;
        localStorage.setItem("billetin_demo_user_name", userName.trim());
        setOnboardingStep(2);
    };

    const handleToneSelect = (tone) => {
        setUserTone(tone);
        localStorage.setItem("billetin_demo_user_tone", tone);
        setOnboardingStep(null); // Complete onboarding
        setAvatarMood("happy");
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
                    {!onboardingStep && (
                        <div style={{ marginLeft: "auto", textAlign: "right" }}>
                            <div className="demo-counter">
                                <span className={`demo-counter-num ${limitReached ? "depleted" : ""}`}>
                                    {DEMO_MSG_LIMIT - msgCount}
                                </span>
                                <span className="demo-counter-label">mensajes restantes</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* ONBOARDING STEPS */}
                {onboardingStep === 1 && (
                    <div className="onboarding-container">
                        <div className="glass-card onboarding-card">
                            <BilletinAvatar
                                size={70}
                                mood="happy"
                            />
                            <h2>¡Hola! 👋</h2>
                            <p>Para empezar, ¿cómo quieres que me refiera a ti?</p>
                            <form onSubmit={handleNameSubmit} className="onboarding-form">
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="Tu nombre o apodo"
                                    className="chat-input"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    className="chat-send-btn"
                                    style={{ width: "100%", marginTop: "12px" }}
                                >
                                    Continuar
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {onboardingStep === 2 && (
                    <div className="onboarding-container">
                        <div className="glass-card onboarding-card">
                            <BilletinAvatar
                                size={70}
                                mood="happy"
                            />
                            <h2>¡Genial {userName}! 🎉</h2>
                            <p>¿Qué estilo de conversación prefieres?</p>
                            <div className="tone-options">
                                <button
                                    onClick={() => handleToneSelect("motivador")}
                                    className="tone-btn"
                                >
                                    💪 Motivador
                                </button>
                                <button
                                    onClick={() => handleToneSelect("cercano")}
                                    className="tone-btn"
                                >
                                    😊 Cercano
                                </button>
                                <button
                                    onClick={() => handleToneSelect("formal")}
                                    className="tone-btn"
                                >
                                    📊 Formal
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* NORMAL CHAT UI (only when onboarding is complete) */}
                {!onboardingStep && (
                    <>
                        {/* MENSAJES */}
                        <div className="chat-messages">

                            {history.length === 0 && !loading && (
                                <div className="welcome-card">
                                    <BilletinAvatar size={90} mood="happy" />
                                    <h2>¡Hola {userName || "amigo"}! Soy Billetín 👋</h2>
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
                    </>
                )}
            </div>
        </MainLayout>
    );
}