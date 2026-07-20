import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import BilletinAvatar from "../components/BilletinAvatar";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleEvaluatorLogin = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await api.post("/login", {
                email: "profesor@billeteria.com",
                password: "evaluador123",
            });

            localStorage.setItem("token", response.data.token);
            window.location.href = "/dashboard";
        } catch (err) {
            console.error(err);
            setError("Error al iniciar sesión. Comprueba la conexión con el servidor.");
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        alert("El inicio de sesión con Google no está implementado en esta demo. Por favor, accede como Evaluador.");
    };

    return (
        <div className="login-page-container">
            <div className="modern-login-card">
                
                {/* Panel Izquierdo - Branding */}
                <div className="login-left-panel">
                    <div className="login-left-content">
                        <BilletinAvatar size={70} mood="happy" />
                        <h1>Tu futuro financiero empieza aquí.</h1>
                        <p>Únete a BilleterIA y descubre cómo la inteligencia artificial puede revolucionar tu forma de ahorrar y gestionar tu dinero.</p>
                        
                        <ul className="login-features">
                            <li>
                                <span className="login-features-icon">✓</span>
                                Análisis inteligente de gastos
                            </li>
                            <li>
                                <span className="login-features-icon">✓</span>
                                Coach financiero 24/7
                            </li>
                            <li>
                                <span className="login-features-icon">✓</span>
                                Objetivos de ahorro dinámicos
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Panel Derecho - Formulario/Botones */}
                <div className="login-right-panel">
                    <h2>Bienvenido de nuevo</h2>
                    <p className="login-subtitle">Inicia sesión para continuar a tu Dashboard</p>

                    {error && (
                        <div style={{
                            background: "rgba(239,68,68,.1)",
                            border: "1px solid rgba(239,68,68,.2)",
                            color: "#fca5a5",
                            padding: "12px 16px",
                            borderRadius: 12,
                            fontSize: 14,
                            width: "100%",
                            maxWidth: "340px",
                            margin: "0 auto 20px",
                            boxSizing: "border-box",
                            textAlign: "center"
                        }}>
                            {error}
                        </div>
                    )}

                    <div className="login-actions">
                        
                        <button 
                            className="btn-professional-google" 
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            type="button"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Continuar con Google
                        </button>

                        <div className="login-divider-pro">O también</div>

                        <button 
                            className="btn-professional-evaluator"
                            onClick={handleEvaluatorLogin}
                            disabled={loading}
                            type="button"
                        >
                            {loading ? "Iniciando sesión..." : "🎓 Acceder como Evaluador"}
                        </button>

                    </div>

                    <div className="login-footer-links">
                        <Link to="/" className="login-back-btn">
                            ← Volver al inicio
                        </Link>
                    </div>

                </div>

            </div>
        </div>
    );
}