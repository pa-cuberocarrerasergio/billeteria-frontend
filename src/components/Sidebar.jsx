import { useState } from "react";
import { LayoutDashboard, Receipt, Target, Bot, User, Trophy, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BilletinAvatar from "./BilletinAvatar";
import { BASE_SERVER_URL } from "../services/api";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isDemo = location.pathname.startsWith("/demo");
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);
  const closeMobileMenu = () => setMobileOpen(false);

  const handleLogout = () => {
    closeMobileMenu();
    logout();
    navigate("/");
  };

  const handleExitDemo = () => {
    closeMobileMenu();
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
    ...(!isDemo ? [{
      path: "/profile",
      icon: User,
      label: "Perfil",
    }] : []),
    {
      path: isDemo ? "/demo/achievements" : "/achievements",
      icon: Trophy,
      label: "Logros",
    },
  ];

  return (
    <>
      {/* Mobile Top Navbar (shown on <=768px screens) */}
      <header className="mobile-header">
        <div className="mobile-header-brand" onClick={closeMobileMenu}>
          <span className="logo-icon">💰</span>
          <span className="logo-text">BilleterIA</span>
          {isDemo && <span className="demo-tag" style={{ marginLeft: 6 }}>DEMO</span>}
        </div>
        <button 
          className="mobile-hamburger-btn"
          onClick={toggleMobileMenu}
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Backdrop for closing mobile menu */}
      {mobileOpen && (
        <div 
          className="sidebar-backdrop"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="logo">
          <span className="logo-icon">💰</span>
          <div>
            <div className="logo-text">BilleterIA</div>
            <div className="logo-subtitle">{isDemo ? "Modo Demo" : "Tus finanzas"}</div>
          </div>
        </div>

        <nav>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${location.pathname === item.path ? "active-link" : ""}`}
              onClick={closeMobileMenu}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          {user && user.avatar ? (
              <img 
                src={user.avatar.startsWith('http') ? user.avatar : `${BASE_SERVER_URL}${user.avatar}`} 
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
    </>
  );
}
