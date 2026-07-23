import { LayoutDashboard, Receipt, Target, Bot, User, Trophy } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BilletinAvatar from "./BilletinAvatar";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isDemo = location.pathname.startsWith("/demo");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleExitDemo = () => {
    // Limpiamos todos los datos de la sesión demo
    localStorage.removeItem("billetin_demo_user_name");
    localStorage.removeItem("billetin_demo_user_tone");
    navigate("/");
  };

  const navItems = [
    {
      path: isDemo ? "/demo/dashboard" : "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      path: isDemo ? "/demo/transactions" : "/transactions",
      icon: Receipt,
      label: "Transacciones",
    },
    {
      path: isDemo ? "/demo/goals" : "/saving-goals",
      icon: Target,
      label: "Objetivos",
    },
    {
      path: isDemo ? "/demo/coach" : "/coach",
      icon: Bot,
      label: "Coach IA",
    },
    {
      path: isDemo ? "/demo/profile" : "/profile",
      icon: User,
      label: "Perfil",
    },
    {
      path: isDemo ? "/demo/achievements" : "/achievements",
      icon: Trophy,
      label: "Logros",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="logo-icon">💰</span>
        <div>
          <div className="logo-text">BilleterIA</div>
          <div className="logo-subtitle">{isDemo ? "Modo Demo" : "Tu finanzas"}</div>
        </div>
      </div>

      <nav>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`${location.pathname === item.path ? "active-link" : ""}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        {user && user.avatar ? (
            <img 
              src={user.avatar.startsWith('http') ? user.avatar : `http://127.0.0.1:8000${user.avatar}`} 
              alt="Avatar" 
              style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} 
            />
        ) : (
            <BilletinAvatar size={40} mood="happy" />
        )}
        <div style={{ flex: 1 }}>
          <div className="footer-user" style={{ marginBottom: "2px" }}>{user ? user.nickname || "Usuario" : "Usuario"}</div>
          {!isDemo && (
              <button 
                onClick={handleLogout}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                  e.target.style.color = "#ef4444";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "var(--text-h)";
                }}
                style={{ 
                  background: "transparent", 
                  border: "1px solid var(--border)", 
                  color: "var(--text-h)", 
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer", 
                  padding: "4px 10px",
                  marginTop: "4px",
                  borderRadius: "12px",
                  transition: "all 0.2s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                Cerrar sesión
              </button>
          )}
          {isDemo && (
            <>
              <div className="footer-plan" style={{ marginBottom: "4px" }}>Demo Gratuita</div>
              <button
                onClick={handleExitDemo}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                  e.target.style.color = "#ef4444";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "var(--text-h)";
                }}
                style={{ 
                  background: "transparent", 
                  border: "1px solid var(--border)", 
                  color: "var(--text-h)", 
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer", 
                  padding: "4px 10px",
                  borderRadius: "12px",
                  transition: "all 0.2s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                Volver al inicio
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
