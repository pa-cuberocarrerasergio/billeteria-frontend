import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import BilletinAvatar from "../components/BilletinAvatar";

// Demo quick prompts for chat
const DEMO_QUICK_PROMPTS = [
  "¿Cómo puedo ahorrar más cada mes?",
  "¿Es mejor invertir o ahorrar?",
  "¿Cómo llego a mi objetivo?",
  "Dame un consejo",
];

// Demo responses based on prompt
const DEMO_RESPONSES = {
  "¿Cómo puedo ahorrar más cada mes?": {
    mood: "happy",
    text: "¡Excelente pregunta! Un simple cambio es revisar tus suscripciones mensuales — muchas veces pagamos por servicios que no usamos. También puedes automatizar un porcentaje de tu salario para ahorro justo cuando recibes el pago.",
  },
  "¿Es mejor invertir o ahorrar?": {
    mood: "thinking",
    text: "Depende de tus objetivos. Si el dinero lo necesitas en menos de 3 años, ahorro es más seguro. Si es para más de 5 años, invertir puede darte mejor rendimiento. ¡Lo ideal es tener ambos!",
  },
  "¿Cómo llego a mi objetivo?": {
    mood: "happy",
    text: "Divide tu objetivo en metas mensuales más pequeñas. Por ejemplo, si quieres ahorrar 1.200€ en un año, son 100€ al mes. ¡Celebrar cada pequeño logro te ayudará a mantener la motivación!",
  },
  "Dame un consejo": {
    mood: "happy",
    text: "Mi consejo favorito: registra tus gastos durante una semana. ¡Te sorprenderás de ver dónde se va tu dinero! El conocimiento es el primer paso para el control financiero.",
  },
};

export default function LandingPage() {
  // Simulador
  const [salary, setSalary] = useState(2000);
  const [savingRate, setSavingRate] = useState(20);
  const yearlySaving = (salary * savingRate / 100) * 12;
  const monthlySaving = (salary * savingRate / 100);

  // Mini-chat embebido
  const [chatHistory, setChatHistory] = useState([
    {
      id: "init",
      role: "coach",
      mood: "happy",
      text: "¡Hola! Soy Billetín 👋 Soy tu coach financiero con IA. Puedo ayudarte a ahorrar y tomar mejores decisiones. Prueba alguna de las preguntas de abajo 👇",
    },
  ]);
  const [chatLimitReached, setChatLimitReached] = useState(false);
  const [userMsgCount, setUserMsgCount] = useState(0);
  const [avatarMood, setAvatarMood] = useState("happy");
  const chatEndRef = useRef(null);
  const isInitialRender = useRef(true); // Track initial render

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // Scroll to bottom of chat ONLY on new message (not initial load)
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const sendDemoMessage = (prompt) => {
    if (chatLimitReached) return;

    const newCount = userMsgCount + 1;
    setUserMsgCount(newCount);

    // Add user message
    const userMsg = {
      id: Date.now(),
      role: "user",
      text: prompt,
    };

    // Get coach response
    const coachReply = DEMO_RESPONSES[prompt] || {
      mood: "thinking",
      text: "Esa es una gran pregunta. Para darte una respuesta personalizada necesito conocer tus datos reales. ¡Regístrate gratis!",
    };

    const coachMsg = {
      id: Date.now() + 1,
      role: "coach",
      mood: coachReply.mood,
      text: coachReply.text,
    };

    setChatHistory([...chatHistory, userMsg, coachMsg]);
    setAvatarMood(coachReply.mood);

    if (newCount >= 2) {
      setChatLimitReached(true);
    }
  };

  return (
    <div className="landing-page">
      {/* Floating Background Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
      {/* ========================
        HERO
      ======================== */}
      <section className="landing-hero">
        <div className="landing-container">
          <div className="landing-hero-logo">
            <span className="landing-logo-icon">💰</span>
            <span className="landing-logo-text">BilleterIA</span>
          </div>
          <div className="landing-hero-badge">
            ✨ Tu coach financiero con IA — Gratis para siempre
          </div>

          <BilletinAvatar size={120} mood="happy" />

          <h1 className="landing-hero-title">
            Controla tus finanzas<br />
            <span className="landing-gradient-text">con Inteligencia Artificial</span>
          </h1>

          <p className="landing-hero-subtitle">
            BilleterIA combina gestión financiera, objetivos de ahorro
            e IA para ayudarte a tomar mejores decisiones económicas.
            Registrate y empieza en menos de 1 minuto.
          </p>

          <div className="landing-buttons">
            <Link to="/login" className="landing-btn-primary">
              🚀 Empezar gratis
            </Link>
            <Link to="/demo/dashboard" className="landing-btn-secondary">
              Ver demo sin registrarse
            </Link>
          </div>
        </div>
      </section>

      {/* ========================
        FEATURES
      ======================== */}
      <section id="features" className="landing-section">
        <div className="landing-container">
          <div className="landing-section-header">
            <span className="landing-section-tag">Funcionalidades</span>
            <h2>¿Qué puede hacer BilleterIA?</h2>
            <p>Todo lo que necesitas para tomar el control de tus finanzas personales</p>
          </div>

          <div className="features-grid">
            <div className="glass-card feature-card feature-card--teal">
              <div className="feature-icon">📊</div>
              <h3>Dashboard Inteligente</h3>
              <p>Visualiza ingresos, gastos y balance en tiempo real con gráficas interactivas.</p>
              <Link to="/demo/dashboard" className="feature-link">
                Ver demo →
              </Link>
            </div>

            <div className="glass-card feature-card feature-card--purple">
              <div className="feature-icon">💳</div>
              <h3>Gestión de transacciones</h3>
              <p>Registra ingresos y gastos, categorízalos y mantén un historial completo.</p>
              <Link to="/demo/transactions" className="feature-link">
                Ver demo →
              </Link>
            </div>

            <div className="glass-card feature-card feature-card--teal">
              <div className="feature-icon">🎯</div>
              <h3>Objetivos de ahorro</h3>
              <p>Crea metas, sigue tu progreso y recibe alertas cuando te acerques al objetivo.</p>
              <Link to="/demo/dashboard" className="feature-link">
                Ver demo →
              </Link>
            </div>

            <div className="glass-card feature-card feature-card--purple">
              <div className="feature-icon">🤖</div>
              <h3>Coach IA — Billetín</h3>
              <p>Billetín analiza tus datos y te da consejos personalizados en lenguaje natural.</p>
              <Link to="/demo/coach" className="feature-link">
                Hablar con Billetín →
              </Link>
            </div>

            <div className="glass-card feature-card feature-card--teal">
              <div className="feature-icon">🏆</div>
              <h3>Sistema de logros</h3>
              <p>Desbloquea medallas y recompensas a medida que mejoras tus hábitos financieros.</p>
              <Link to="/login" className="feature-link">
                Registrarse →
              </Link>
            </div>

            <div className="glass-card feature-card feature-card--purple">
              <div className="feature-icon">📈</div>
              <h3>Análisis de tendencias</h3>
              <p>Gráficas mensuales que te muestran cómo evoluciona tu situación financiera.</p>
              <Link to="/demo/dashboard" className="feature-link">
                Ver demo →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================
        SIMULADOR
      ======================== */}
      <section id="simulator" className="landing-section">
        <div className="landing-container">
          <div className="landing-section-header">
            <span className="landing-section-tag">Simulador</span>
            <h2>🧮 Calcula tu potencial de ahorro</h2>
            <p>Mueve los sliders y descubre cuánto podrías ahorrar</p>
          </div>

          <div className="simulator-wrapper">
            <div className="glass-card simulator-card">
              <div className="simulator-slider-group">
                <div className="simulator-label-row">
                  <label>💰 Ingresos mensuales</label>
                  <span className="simulator-value">{salary.toLocaleString()} €</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="8000"
                  step="100"
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  className="landing-slider"
                />
                <div className="simulator-range-hints">
                  <span>500 €</span><span>8.000 €</span>
                </div>
              </div>

              <div className="simulator-slider-group">
                <div className="simulator-label-row">
                  <label>📊 Porcentaje de ahorro</label>
                  <span className="simulator-value">{savingRate}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={savingRate}
                  onChange={(e) => setSavingRate(Number(e.target.value))}
                  className="landing-slider"
                />
                <div className="simulator-range-hints">
                  <span>5%</span><span>60%</span>
                </div>
              </div>

              <div className="simulator-results">
                <div className="simulator-result-item">
                  <span className="simulator-result-label">Al mes</span>
                  <span className="simulator-result-amount primary">
                    {monthlySaving.toFixed(0)} €
                  </span>
                </div>
                <div className="simulator-result-divider" />
                <div className="simulator-result-item">
                  <span className="simulator-result-label">Al año</span>
                  <span className="simulator-result-amount gradient">
                    {yearlySaving.toLocaleString("es-ES", { maximumFractionDigits: 0 })} €
                  </span>
                </div>
                <div className="simulator-result-divider" />
                <div className="simulator-result-item">
                  <span className="simulator-result-label">En 5 años</span>
                  <span className="simulator-result-amount secondary">
                    {(yearlySaving * 5).toLocaleString("es-ES", { maximumFractionDigits: 0 })} €
                  </span>
                </div>
              </div>

              <p className="simulator-cta-text">
                ¿Quieres un plan personalizado para alcanzar este objetivo?
              </p>
              <Link to="/login" className="landing-btn-primary" style={{ display: "inline-block", textAlign: "center" }}>
                Crear mi plan gratis →
              </Link>
            </div>

            {/* Visual de objetivo */}
            <div className="simulator-goal-preview glass-card">
              <h3>🎯 Objetivo de ejemplo</h3>
              <p className="simulator-goal-name">✈️ Viaje a Japón</p>
              <div className="simulator-goal-amounts">
                <span>Ahorrado: <strong>1.500 €</strong></span>
                <span>Meta: <strong>3.000 €</strong></span>
              </div>
              <div className="progress-bar" style={{ marginTop: 12 }}>
                <div className="progress-fill" style={{ width: "50%" }} />
              </div>
              <p className="simulator-goal-eta">
                🏁 A este ritmo: en <strong>{Math.ceil(1500 / monthlySaving)} meses</strong>
              </p>

              <div style={{ marginTop: 24 }}>
                <h3>📈 Evolución proyectada</h3>
                <div className="mini-chart">
                  {[1, 2, 3, 4, 5, 6].map((month) => {
                    const height = Math.min(100, (monthlySaving * month / (yearlySaving / 12 * 6)) * 100);
                    return (
                      <div key={month} className="mini-chart-bar-wrap">
                        <div
                          className="mini-chart-bar"
                          style={{ height: `${height}%` }}
                        />
                        <span className="mini-chart-label">M{month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================
        MINI CHAT DEMO
      ======================== */}
      <section id="demo-chat" className="landing-section">
        <div className="landing-container">
          <div className="landing-section-header">
            <span className="landing-section-tag">Demo interactiva</span>
            <h2>🤖 Habla con Billetín ahora</h2>
            <p>Prueba el coach financiero con IA sin necesidad de registrarte</p>
          </div>

          <div className="demo-chat-wrapper">
            <div className="demo-chat-container glass-card">
              {/* Header del chat */}
              <div className="demo-chat-header">
                <BilletinAvatar size={52} mood={avatarMood} />
                <div>
                  <strong>Billetín IA</strong>
                  <div className="demo-chat-status">
                    <span className="demo-chat-dot" />
                    En línea — Demo gratuita
                  </div>
                </div>
                <div className="demo-chat-badge">
                  {chatLimitReached ? "0/2 restantes" : `${2 - userMsgCount}/2 preguntas`}
                </div>
              </div>

              {/* Mensajes */}
              <div className="demo-chat-messages">
                {chatHistory.map((msg) => (
                  msg.role === "user" ? (
                    <div key={msg.id} className="user-message-wrapper">
                      <div className="user-message">{msg.text}</div>
                    </div>
                  ) : (
                    <div key={msg.id} className="coach-row">
                      <BilletinAvatar size={36} mood={msg.mood || "normal"} />
                      <div className="coach-message">{msg.text}</div>
                    </div>
                  )
                ))}

                {chatLimitReached && (
                  <div className="demo-limit-reached glass-card">
                    <span>🔒</span>
                    <div>
                      <strong>Has llegado al límite de la demo</strong>
                      <p>Regístrate gratis para conversaciones ilimitadas con Billetín</p>
                      <Link to="/login" className="landing-btn-primary" style={{ marginTop: 10, display: "inline-block" }}>
                        Crear cuenta gratis →
                      </Link>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Quick prompts */}
              {!chatLimitReached && (
                <div className="demo-chat-prompts">
                  <p className="demo-prompts-label">💬 Pregunta algo:</p>
                  <div className="quick-prompts" style={{ padding: 0 }}>
                    {DEMO_QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        className="quick-prompt-btn"
                        onClick={() => sendDemoMessage(prompt)}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Panel lateral — acceso completo */}
            <div className="demo-upsell glass-card">
              <BilletinAvatar size={80} mood="happy" />
              <h3>Versión completa</h3>
              <p>La demo tiene 2 preguntas. Con cuenta gratuita obtienes:</p>
              <ul className="demo-upsell-list">
                <li>✅ Conversaciones ilimitadas con Billetín</li>
                <li>✅ Análisis de tus transacciones reales</li>
                <li>✅ Objetivos de ahorro personalizados</li>
                <li>✅ Dashboard con tus datos en tiempo real</li>
                <li>✅ Sistema de logros y recompensas</li>
                <li>✅ Coach financiero que aprende de ti</li>
              </ul>
              <Link to="/login" className="landing-btn-primary" style={{ display: "block", textAlign: "center", marginTop: 20 }}>
                🚀 Empezar gratis
              </Link>
              <p className="demo-upsell-note">Sin tarjeta de crédito · 100% gratuito</p>
            </div>
          </div>

          {/* Banner para ir a la demo completa */}
          <div className="demo-full-banner glass-card">
            <div className="demo-full-banner-text">
              <span className="demo-full-banner-icon">🚀</span>
              <div>
                <strong>¿Quieres explorar la app completa sin registrarte?</strong>
                <p>Accede a la demo interactiva con datos de ejemplo — dashboard, transacciones y coach IA</p>
              </div>
            </div>
            <div className="demo-full-banner-actions">
              <Link to="/demo/dashboard" className="landing-btn-primary">
                Abrir demo completa
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================
        PREVIEW DASHBOARD
      ======================== */}
      <section className="landing-section">
        <div className="landing-container">
          <div className="landing-section-header">
            <span className="landing-section-tag">Vista previa</span>
            <h2>📊 Tu dashboard financiero</h2>
            <p>Datos claros y visuales para que nunca pierdas el control</p>
          </div>

          <div className="stats-grid">
            <div className="glass-card demo-card">
              <h3>💰 Balance total</h3>
              <h2 className="stat-positive">1.250 €</h2>
              <p style={{ color: "#22c55e", fontSize: 13, marginTop: 4 }}>▲ +8% respecto al mes anterior</p>
            </div>
            <div className="glass-card demo-card">
              <h3>📈 Ingresos del mes</h3>
              <h2 className="stat-positive">2.500 €</h2>
              <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>Nómina + freelance</p>
            </div>
            <div className="glass-card demo-card">
              <h3>📉 Gastos del mes</h3>
              <h2 className="stat-negative">1.250 €</h2>
              <p style={{ color: "#ef4444", fontSize: 13, marginTop: 4 }}>▼ -5% respecto al mes anterior</p>
            </div>
            <div className="glass-card demo-card">
              <h3>🎯 Objetivos activos</h3>
              <h2>3</h2>
              <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>2 en progreso · 1 completado</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================
        LOGROS
      ======================== */}
      <section className="landing-section">
        <div className="landing-container">
          <div className="landing-section-header">
            <span className="landing-section-tag">Gamificación</span>
            <h2>🏆 Sistema de logros</h2>
            <p>Desbloquea recompensas a medida que mejoras tus finanzas</p>
          </div>

          <div className="achievements-grid">
            {[
              { emoji: "💸", title: "Primer gasto", desc: "Registraste tu primera transacción", unlocked: true },
              { emoji: "🎯", title: "Primer ahorro", desc: "Creaste tu primer objetivo de ahorro", unlocked: true },
              { emoji: "💰", title: "Ahorrador principiante", desc: "Ahorraste 100€ en un mes", unlocked: true },
              { emoji: "🔥", title: "Racha de 7 días", desc: "Registraste gastos 7 días seguidos", unlocked: false },
              { emoji: "🚀", title: "Meta cumplida", desc: "Completaste un objetivo de ahorro", unlocked: false },
              { emoji: "🧠", title: "Consejo seguido", desc: "Aplicaste un consejo de Billetín", unlocked: false },
            ].map((achievement) => (
              <div
                key={achievement.title}
                className={`glass-card achievement-card ${!achievement.unlocked ? "achievement-locked" : ""}`}
              >
                <div className="achievement-emoji">{achievement.emoji}</div>
                <h3>{achievement.title}</h3>
                <p>{achievement.desc}</p>
                {!achievement.unlocked && (
                  <span className="achievement-lock-badge">🔒 Bloqueado</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================
        CTA FINAL
      ======================== */}
      <section className="landing-cta">
        <div className="landing-container">
          <div className="landing-cta-inner glass-card">
            <BilletinAvatar size={100} mood="happy" />
            <h2>Empieza hoy con BilleterIA</h2>
            <p>
              Gestiona tus finanzas, alcanza objetivos y recibe consejos<br />
              personalizados mediante inteligencia artificial.
            </p>
            <div className="landing-buttons">
              <Link to="/login" className="landing-btn-primary">
                🚀 Crear cuenta gratuita
              </Link>
              <Link to="/demo/dashboard" className="landing-btn-secondary">
                Ver demo primero
              </Link>
            </div>
            <p style={{ color: "#64748b", fontSize: 13, marginTop: 20 }}>
              Sin tarjeta de crédito · Sin compromisos · 100% gratis
            </p>
          </div>
        </div>
      </section>

      {/* ========================
        FOOTER
      ======================== */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="landing-footer-brand">
            <span className="landing-logo-icon">💰</span>
            <span className="landing-logo-text">BilleterIA</span>
          </div>
          <p className="landing-footer-copy">
            © 2026 BilleterIA. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
