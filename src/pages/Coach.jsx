import { useEffect, useRef, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";
import BilletinAvatar from "../components/BilletinAvatar";

const TONE_LABELS = {
    motivador: "Motivador",
    cercano: "Cercano",
    formal: "Formal",
};

const normalizeTone = (tone) => (tone === "amigable" ? "cercano" : tone);

const getWelcomeMessage = (name, tone) => {
    const style = normalizeTone(tone);

    if (style === "formal") {
        return `Encantado de conocerle, ${name}. A partir de ahora me referiré a usted así y mantendré un tono formal. ¿En qué puedo ayudarle con sus finanzas hoy?`;
    }

    if (style === "motivador") {
        return `¡Perfecto, ${name}! 💪 Usaré un estilo motivador contigo. Estoy listo para ayudarte a alcanzar tus metas financieras. ¿Por dónde empezamos?`;
    }

    return `¡Genial, ${name}! 😊 Hablaré contigo de forma cercana y amigable. Cuéntame, ¿qué te gustaría revisar de tus finanzas?`;
};

export default function Coach() {
    const [onboardingStep, setOnboardingStep] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState("");
    const [userTone, setUserTone] = useState("cercano");
    const [initialized, setInitialized] = useState(false);

    const [message, setMessage] = useState("");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [avatarMood, setAvatarMood] = useState("normal");

    const messagesEndRef = useRef(null);

    const quickPrompts = [
        "¿Cuánto puedo ahorrar este mes?",
        "Analiza mis gastos",
        "¿Voy bien con mis objetivos?",
        "¿En qué gasto más dinero?",
        "Dame un consejo financiero",
    ];

    useEffect(() => {
        initCoach();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [history, loading, onboardingStep]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    };

    const addCoachMessage = (text, mood = "happy") => {
        setHistory((prev) => [
            ...prev,
            {
                id: `${Date.now()}-coach`,
                role: "coach",
                text,
                mood,
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            },
        ]);
    };

    const formatHistory = (items) => {
        const formattedHistory = [];

        items.forEach((item) => {
            formattedHistory.push({
                id: `${item.id}-user`,
                role: "user",
                text: item.message,
                time: new Date(item.created_at || Date.now()).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            });

            formattedHistory.push({
                id: `${item.id}-coach`,
                role: "coach",
                text: item.response,
                mood: item.mood || "normal",
                time: new Date(item.created_at || Date.now()).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            });
        });

        return formattedHistory;
    };

    const savePreferences = async (name, tone) => {
        if (!userId) return;

        await api.put(`/coach-preferences/${userId}`, {
            preferred_name: name,
            conversation_style: normalizeTone(tone),
            coach_background: "default",
        });
    };

    const syncLocalPreferences = (name, tone) => {
        localStorage.setItem("billetin_user_name", name);
        localStorage.setItem("billetin_user_tone", normalizeTone(tone));
    };

    const initCoach = async () => {
        try {
            const userResponse = await api.get("/user");
            const user = userResponse.data;

            setUserId(user.id);

            const [preferenceResponse, historyResponse] = await Promise.all([
                api.get(`/coach-preferences/${user.id}`),
                api.get("/coach/history"),
            ]);

            const preferences = preferenceResponse.data;
            const savedHistory = historyResponse.data || [];

            // Si el usuario ya tiene preferencias guardadas en la base de datos
            if (preferences?.preferred_name && preferences?.conversation_style) {
                setUserName(preferences.preferred_name);
                setUserTone(preferences.conversation_style);
                syncLocalPreferences(
                    preferences.preferred_name,
                    preferences.conversation_style
                );
                setHistory(formatHistory(savedHistory));
                setOnboardingStep(null);
            } else {
                // Si NO tiene preferencias en la base de datos, iniciamos el onboarding siempre
                setOnboardingStep("name");
                setMessage(user.nickname || ""); // Sugerimos su nombre/nickname actual por defecto
                setHistory([
                    {
                        id: "onboarding-welcome",
                        role: "coach",
                        text: `¡Hola ${user.nickname || ""}! 👋 Soy Billetín, tu coach financiero personal. Antes de empezar, ¿cómo quieres que me refiera a ti?`,
                        mood: "happy",
                        time: new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        }),
                    },
                ]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setInitialized(true);
        }
    };

    const handleQuickPrompt = (prompt) => {
        if (onboardingStep) return;
        setMessage(prompt);
    };

    const handleNameSubmit = async (e) => {
        e.preventDefault();

        const name = message.trim();
        if (!name) return;

        setMessage("");
        setUserName(name);

        setHistory((prev) => [
            ...prev,
            {
                id: Date.now(),
                role: "user",
                text: name,
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            },
        ]);

        setOnboardingStep("tone");
        addCoachMessage(
            `¡Encantado, ${name}! 🎉 Ahora elige cómo prefieres que te hable. Puedes elegir entre tres estilos:`,
            "happy"
        );
    };

    const handleToneSelect = async (tone) => {
        const normalizedTone = normalizeTone(tone);

        setUserTone(normalizedTone);
        syncLocalPreferences(userName, normalizedTone);

        setHistory((prev) => [
            ...prev,
            {
                id: `${Date.now()}-tone`,
                role: "user",
                text: TONE_LABELS[normalizedTone],
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            },
        ]);

        try {
            await savePreferences(userName, normalizedTone);
        } catch (error) {
            console.error(error);
        }

        setOnboardingStep(null);
        setAvatarMood("happy");
        addCoachMessage(getWelcomeMessage(userName, normalizedTone), "happy");
    };

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!message.trim() || onboardingStep) return;

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
            const response = await api.post("/coach/chat", {
                message: userMessage,
                userName: userName || "",
                userTone: userTone || "cercano",
            });

            const reply = response.data.reply;

            setAvatarMood(response.data.mood || "normal");

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

    const inputPlaceholder =
        onboardingStep === "name"
            ? "Escribe tu nombre o apodo..."
            : "Pregunta algo a Billetín...";

    return (
        <MainLayout>
            <div className="coach-container">
                <div className="glass-card coach-header">
                    <BilletinAvatar size={80} mood={avatarMood} />

                    <div>
                        <h2>Billetín IA</h2>
                        <p>Tu coach financiero personal</p>
                    </div>
                </div>

                {!initialized ? (
                    <div className="glass-card" style={{ padding: "24px", textAlign: "center" }}>
                        <p style={{ color: "#94A3B8", margin: 0 }}>Cargando conversación...</p>
                    </div>
                ) : (
                    <>
                        <div className="chat-messages">
                            {history.length === 0 && !loading && !onboardingStep && (
                                <div className="welcome-card">
                                    <BilletinAvatar size={90} mood={avatarMood} />

                                    <h2>
                                        Hola {userName || "amigo"} 👋 Soy Billetín
                                    </h2>

                                    <p>
                                        Puedo ayudarte a ahorrar, analizar gastos,
                                        planificar objetivos y mejorar tus finanzas personales.
                                    </p>
                                </div>
                            )}

                            {history.map((item) =>
                                item.role === "user" ? (
                                    <div key={item.id} className="user-message-wrapper">
                                        <div className="user-message">{item.text}</div>
                                        <small>{item.time}</small>
                                    </div>
                                ) : (
                                    <div key={item.id} className="coach-row">
                                        <BilletinAvatar
                                            size={40}
                                            mood={item.mood || "normal"}
                                        />

                                        <div>
                                            <div className="coach-message">{item.text}</div>
                                            <small className="message-time">{item.time}</small>
                                        </div>
                                    </div>
                                )
                            )}

                            {loading && (
                                <div className="coach-row">
                                    <BilletinAvatar size={40} mood="thinking" />

                                    <div className="coach-message">
                                        <span className="typing-dot"></span>
                                        <span className="typing-dot"></span>
                                        <span className="typing-dot"></span>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef}></div>
                        </div>

                        {onboardingStep === "tone" && (
                            <div className="tone-options" style={{ marginBottom: "16px" }}>
                                <button
                                    onClick={() => handleToneSelect("motivador")}
                                    className="tone-btn"
                                    type="button"
                                >
                                    💪 Motivador
                                </button>
                                <button
                                    onClick={() => handleToneSelect("cercano")}
                                    className="tone-btn"
                                    type="button"
                                >
                                    😊 Cercano
                                </button>
                                <button
                                    onClick={() => handleToneSelect("formal")}
                                    className="tone-btn"
                                    type="button"
                                >
                                    📊 Formal
                                </button>
                            </div>
                        )}

                        {!onboardingStep && (
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

                        <form
                            onSubmit={onboardingStep === "name" ? handleNameSubmit : sendMessage}
                            className="chat-input-container"
                        >
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={inputPlaceholder}
                                className="chat-input"
                                disabled={onboardingStep === "tone" || loading}
                            />

                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    onboardingStep === "tone" ||
                                    !message.trim()
                                }
                                className="chat-send-btn"
                            >
                                {onboardingStep === "name" ? "Continuar" : "Enviar"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </MainLayout>
    );
}
