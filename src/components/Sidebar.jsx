import { useState } from "react";
import {
  LayoutDashboard,
  Receipt,
  Target,
  Bot,
  User,
  Trophy,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BilletinAvatar from "./BilletinAvatar";
import { BASE_SERVER_URL } from "../services/api";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  // Detectamos si estamos dentro de cualquier ruta /demo/*
  const isDemo = location.pathname.startsWith("/demo");

  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  // Logout REAL solamente para usuarios autenticados
  const handleLogout = () => {
    closeMobileMenu();
    logout();
    navigate("/");
  };

  // Salir del modo demo
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

    // El perfil NO aparece en la demo
    ...(!isDemo
      ? [
          {
            path: "/profile",
            icon: User,
            label: "Perfil",
          },
        ]
      : []),

    {
      path: isDemo ? "/demo/achievements" : "/achievements",
      icon: Trophy,
      label: "Logros",
    },
  ];

  /*
   * ============================================================
   * DATOS DEL USUARIO DEL SIDEBAR
   * ============================================================
   *
   * MUY IMPORTANTE:
   *
   * En modo demo NO utilizamos:
   *
   *   user.avatar
   *   user.nickname
   *
   * porque user pertenece al AuthContext y puede contener
   * la cuenta real de Google del usuario.
   *
   * En demo mostramos siempre un usuario ficticio.
   */

  const demoUserName = "Usuario Demo";

  const realUserName = user?.nickname || "Usuario";

  const footerUserName = isDemo
    ? demoUserName
    : realUserName;

  /*
   * Avatar:
   *
   * Demo -> siempre BilletinAvatar
   *
   * App real -> avatar del usuario si existe
   */
  const renderFooterAvatar = () => {
    // En DEMO jamás utilizamos el avatar de Google
    if (isDemo) {
      return <BilletinAvatar size={40} mood="happy" />;
    }

    // Usuario real con avatar
    if (user?.avatar) {
      const avatarUrl = user.avatar.startsWith("http")
        ? user.avatar
        : `${BASE_SERVER_URL}${user.avatar}`;

      return (
        <img
          src={avatarUrl}
          alt="Avatar"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      );
    }

    // Usuario real sin avatar
    return <BilletinAvatar size={40} mood="happy" />;
  };

  return (
    <>
      {/* ======================================================
          MOBILE HEADER
          ====================================================== */}

      <header className="mobile-header">
        <div
          className="mobile-header-brand"
          onClick={closeMobileMenu}
        >
          <span className="logo-icon">💰</span>

          <span className="logo-text">
            BilleterIA
          </span>

          {isDemo && (
            <span
              className="demo-tag"
              style={{ marginLeft: 6 }}
            >
              DEMO
            </span>
          )}
        </div>

        <button
          className="mobile-hamburger-btn"
          onClick={toggleMobileMenu}
          aria-label={
            mobileOpen
              ? "Cerrar menú"
              : "Abrir menú"
          }
        >
          {mobileOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </header>

      {/* ======================================================
          MOBILE BACKDROP
          ====================================================== */}

      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={closeMobileMenu}
        />
      )}

      {/* ======================================================
          SIDEBAR
          ====================================================== */}

      <aside
        className={`sidebar ${
          mobileOpen ? "mobile-open" : ""
        }`}
      >
        {/* ====================================================
            LOGO
            ==================================================== */}

        <div className="logo">
          <span className="logo-icon">
            💰
          </span>

          <div>
            <div className="logo-text">
              BilleterIA
            </div>

            <div className="logo-subtitle">
              {isDemo
                ? "Modo Demo"
                : "Tus finanzas"}
            </div>
          </div>
        </div>

        {/* ====================================================
            NAVEGACIÓN
            ==================================================== */}

        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={
                  location.pathname === item.path
                    ? "active-link"
                    : ""
                }
                onClick={closeMobileMenu}
              >
                <Icon size={20} />

                <span>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* ====================================================
            FOOTER DEL SIDEBAR
            ==================================================== */}

        <div className="sidebar-footer">
          {/* Avatar */}
          {renderFooterAvatar()}

          <div style={{ flex: 1 }}>
            {/* =================================================
                NOMBRE
                =================================================

                DEMO:
                  Usuario Demo

                APP REAL:
                  nickname de Google/usuario
            */}

            <div
              className="footer-user"
              style={{
                marginBottom: "2px",
              }}
            >
              {footerUserName}
            </div>

            {/* =================================================
                USUARIO REAL
                ================================================= */}

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
                  transition:
                    "all 0.2s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Cerrar sesión
              </button>
            )}

            {/* =================================================
                MODO DEMO
                ================================================= */}

            {isDemo && (
              <>
                <div
                  className="footer-plan"
                  style={{
                    marginBottom: "4px",
                  }}
                >
                  Demo Gratuita
                </div>

                <button
                  onClick={handleExitDemo}
                  style={{
                    background: "transparent",
                    border:
                      "1px solid var(--border)",
                    color: "var(--text-h)",
                    fontSize: "12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    transition:
                      "all 0.2s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
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