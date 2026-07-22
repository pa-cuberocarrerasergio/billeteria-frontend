import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import BilletinAvatar from "../components/BilletinAvatar";

export default function SavingGoals() {
    const [goals, setGoals] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadGoals();
    }, []);

    const loadGoals = async () => {
        try {
            const response = await api.get("/saving-goals");
            // The API returns all goals. We'll sort them by priority locally for display
            // assuming 'high', 'medium', 'low'
            const sortedGoals = response.data.sort((a, b) => {
                const order = { high: 1, medium: 2, low: 3 };
                return order[a.priority] - order[b.priority];
            });
            setGoals(sortedGoals);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteGoal = async (id) => {
        const confirmed = window.confirm("¿Estás seguro de que quieres eliminar este objetivo de ahorro?");
        if (!confirmed) return;

        try {
            await api.delete(`/saving-goals/${id}`);
            loadGoals();
        } catch (error) {
            console.error(error);
        }
    };

    const getAiAdvice = (progress, priority, title) => {
        const lowerTitle = title.toLowerCase();
        
        const isVehicle = lowerTitle.includes("coche") || lowerTitle.includes("moto") || lowerTitle.includes("vehículo");
        const isTravel = lowerTitle.includes("viaje") || lowerTitle.includes("vacaciones") || lowerTitle.includes("disney") || lowerTitle.includes("playa") || lowerTitle.includes("japon") || lowerTitle.includes("japón");
        const isHome = lowerTitle.includes("casa") || lowerTitle.includes("piso") || lowerTitle.includes("hogar") || lowerTitle.includes("hipoteca");
        const isEmergency = lowerTitle.includes("fondo") || lowerTitle.includes("emergencia");
        const isTech = lowerTitle.includes("consola") || lowerTitle.includes("pc") || lowerTitle.includes("ordenador") || lowerTitle.includes("móvil") || lowerTitle.includes("telefono");

        if (progress >= 100) {
            if (isVehicle) return "¡Brrum brrum! 🚗 Tienes el dinero listo. ¡A disfrutar del asfalto!";
            if (isTravel) return "¡Objetivo cumplido! ✈️ Haz las maletas y disfruta de esa merecida escapada.";
            if (isHome) return "¡Felicidades! 🏠 Ya tienes lo necesario para dar ese gran paso en tu hogar.";
            if (isEmergency) return "¡Genial! 🛡️ Tu escudo financiero está al 100%. Te da una tranquilidad tremenda.";
            if (isTech) return "¡Carga completada! 💻 Ya puedes ir a comprar ese capricho tecnológico.";
            return "¡Impresionante! 🎉 Has alcanzado la meta. ¡Felicidades por tu constancia!";
        }
        
        if (progress >= 80) {
            if (isVehicle) return "Casi huelo a coche nuevo. 🏎️ Dale un último empujón a esos ahorros.";
            if (isTravel) return "¡Ya casi lo tienes! 🌴 Ve mirando vuelos porque este viaje se hace realidad.";
            if (isHome) return "Las llaves están muy cerca. 🔑 Un esfuerzo más y habrás completado este reto.";
            if (isTech) return "Queda poquísimo. 🎮 Ve preparando el espacio para tu nueva adquisición.";
            return "¡Estás a un solo paso! 🚀 No te rindas ahora, el objetivo es casi tuyo.";
        }
        
        if (progress >= 50) {
            if (isVehicle) return "Ya tienes la mitad del motor pagado. ⛽ Sigue así, vas a buen ritmo.";
            if (isTravel) return "Ecuador superado. 🗺️ Ya puedes empezar a planear el itinerario de tu viaje.";
            if (isHome) return "Medio camino hecho. 🧱 Sigue poniendo ladrillos a tu ahorro constante.";
            return "Ya tienes la mitad del camino recorrido. 💪 ¡Mantén esta constancia!";
        }
        
        if (progress > 0) {
            if (isVehicle) return "Arrancamos motores. 🛣️ Los primeros euros siempre cuestan, pero ya estás en marcha.";
            if (isTravel) return "El primer paso de tu aventura. 🏖️ Poco a poco llenarás esa hucha viajera.";
            if (isEmergency) return "Cualquier fondo empieza desde cero. ☔ Sigue sumando para los días de lluvia.";
            return "Un buen comienzo. 🌱 Todo gran ahorro empieza con los primeros céntimos.";
        }
        
        // Progreso 0%
        if (priority === 'high') return "Este objetivo es de alta prioridad. ⚠️ Intenta destinarle tus primeros ahorros del mes.";
        if (isTravel) return "El mundo te espera. 🌍 Empieza a ahorrar hoy mismo para no posponer tu viaje.";
        if (isVehicle) return "¿Ganas de conducir? 🛞 Rompe el hielo y haz tu primera aportación al objetivo.";
        return "Todo empieza con un primer paso. 🐢 ¡Anímate a hacer tu primera aportación!";
    };

    const getPriorityStyles = (priority) => {
        switch(priority) {
            case 'high': return { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', label: 'ALTA' };
            case 'medium': return { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', label: 'MEDIA' };
            case 'low': return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', label: 'BAJA' };
            default: return { bg: 'rgba(255,255,255,0.1)', color: 'white', label: 'NORMAL' };
        }
    };

    return (
        <MainLayout>
            <div className="page-container">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
                        <h1 style={{ margin: 0, lineHeight: 1.1, fontSize: "40px" }}>Mis Objetivos</h1>
                        <p style={{ margin: 0, color: "var(--text-h)" }}>Sigue el progreso de tus ahorros</p>
                    </div>
                    <button
                        className="edit-btn"
                        onClick={() => navigate("/saving-goals/create")}
                        style={{ padding: "12px 20px", fontWeight: "bold" }}
                    >
                        + Nuevo Objetivo
                    </button>
                </div>

                {goals.length === 0 ? (
                    <div className="glass-card" style={{ textAlign: "center", padding: "40px 20px" }}>
                        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎯</div>
                        <h3>No tienes ningún objetivo de ahorro activo</h3>
                        <p style={{ color: "var(--text-h)" }}>Crear un objetivo te ayudará a mantenerte motivado y planificar mejor tus finanzas.</p>
                        <button className="edit-btn" onClick={() => navigate("/saving-goals/create")} style={{ marginTop: "20px" }}>
                            Empezar ahora
                        </button>
                    </div>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                        gap: "24px"
                    }}>
                        {goals.map((goal) => {
                            const progress = goal.target_amount > 0 
                                ? (goal.current_amount / goal.target_amount) * 100 
                                : 0;
                            
                            const priorityStyle = getPriorityStyles(goal.priority);
                            const isCompleted = progress >= 100;

                            return (
                                <div
                                    key={goal.id}
                                    className="glass-card"
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        borderTop: isCompleted ? "4px solid #10b981" : "none",
                                        position: "relative"
                                    }}
                                >
                                    {/* Header de la tarjeta */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={{
                                                fontSize: "32px",
                                                backgroundColor: "rgba(255,255,255,0.05)",
                                                width: "56px",
                                                height: "56px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: "16px",
                                                border: "1px solid var(--border)"
                                            }}>
                                                {goal.emoji}
                                            </div>
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: "18px", lineHeight: 1.2 }}>{goal.title}</h3>
                                                <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--text-h)" }}>
                                                    Límite: {new Date(goal.target_date).toLocaleDateString('es-ES')}
                                                </p>
                                            </div>
                                        </div>
                                        <span style={{
                                            fontSize: "10px",
                                            padding: "4px 8px",
                                            borderRadius: "6px",
                                            fontWeight: "bold",
                                            backgroundColor: priorityStyle.bg,
                                            color: priorityStyle.color,
                                        }}>
                                            {priorityStyle.label}
                                        </span>
                                    </div>

                                    {goal.description && (
                                        <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "var(--text-h)", flexGrow: 1 }}>
                                            {goal.description}
                                        </p>
                                    )}

                                    {/* Barra de progreso e info numérica */}
                                    <div style={{ marginTop: "auto" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                            <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                                                {Number(goal.current_amount).toFixed(2)} €
                                            </span>
                                            <span style={{ fontSize: "14px", color: "var(--text-h)", alignSelf: "flex-end" }}>
                                                de {Number(goal.target_amount).toFixed(2)} €
                                            </span>
                                        </div>

                                        <div className="progress-bar" style={{ height: "8px", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.1)" }}>
                                            <div 
                                                className="progress-fill" 
                                                style={{ 
                                                    width: `${Math.min(progress, 100)}%`, 
                                                    backgroundColor: isCompleted ? "#10b981" : "var(--accent)"
                                                }} 
                                            />
                                        </div>
                                        
                                        <div style={{ textAlign: "right", marginTop: "4px", fontSize: "12px", color: isCompleted ? "#10b981" : "var(--accent)", fontWeight: "bold" }}>
                                            {progress.toFixed(1)}%
                                        </div>
                                    </div>

                                    {/* AI Insight */}
                                    <div style={{
                                        backgroundColor: "rgba(0,0,0,0.2)",
                                        borderRadius: "12px",
                                        padding: "12px",
                                        marginTop: "16px",
                                        display: "flex",
                                        gap: "10px",
                                        alignItems: "center"
                                    }}>
                                        <BilletinAvatar size={32} mood={isCompleted ? "happy" : "normal"} />
                                        <p style={{ margin: 0, fontSize: "12px", fontStyle: "italic", color: "#e2e8f0" }}>
                                            "{getAiAdvice(progress, goal.priority, goal.title)}"
                                        </p>
                                    </div>

                                    {/* Acciones */}
                                    <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                                        <button
                                            className="edit-btn"
                                            style={{ flex: 1, padding: "8px", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                                            onClick={() => navigate(`/saving-goals/edit/${goal.id}`)}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            className="danger-btn"
                                            style={{ padding: "8px 12px", fontSize: "13px" }}
                                            onClick={() => deleteGoal(goal.id)}
                                            title="Eliminar objetivo"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}