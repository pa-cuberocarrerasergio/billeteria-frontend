import { LayoutDashboard, Receipt, Target, Bot, User, Trophy, Home, } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import BilletinAvatar from "./BilletinAvatar";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {

    const location = useLocation();
    const { user } = useAuth();
    const isDemo = location.pathname.startsWith("/demo");

    const isActive = (path) =>
        location.pathname === path;

    const navLinks = isDemo
        ? [
              {
                  to: "/demo/dashboard",
                  icon: <LayoutDashboard size={18} />,
                  label: "Dashboard",
              },
              {
                  to: "/demo/transactions",
                  icon: <Receipt size={18} />,
                  label: "Transacciones",
              },
              {
                  to: "/demo/coach",
                  icon: <Bot size={18} />,
                  label: "Billetín IA",
              },
          ]
        : [
              {
                  to: "/dashboard",
                  icon: <LayoutDashboard size={18} />,
                  label: "Dashboard",
              },
              {
                  to: "/transactions",
                  icon: <Receipt size={18} />,
                  label: "Transacciones",
              },
              {
                  to: "/saving-goals",
                  icon: <Target size={18} />,
                  label: "Objetivos",
              },
              {
                  to: "/coach",
                  icon: <Bot size={18} />,
                  label: "Billetín IA",
              },
              {
                  to: "/achievements",
                  icon: <Trophy size={18} />,
                  label: "Logros",
              },
              {
                  to: "/profile",
                  icon: <User size={18} />,
                  label: "Perfil",
              },
          ];

    return (

        <aside className="sidebar">

            <div className="logo">

                <BilletinAvatar size={55} />

                <div>

                    <div className="logo-title">
                        BilleterIA
                    </div>

                    <div className="logo-subtitle">
                        {
                            isDemo
                                ? "Modo Demo"
                                : "Finanzas inteligentes"
                        }
                    </div>

                </div>

            </div>

            {isDemo && (

                <div
                    style={{
                        background:
                            "rgba(124,58,237,.12)",
                        border:
                            "1px solid rgba(124,58,237,.25)",
                        borderRadius: 10,
                        padding: "10px 12px",
                        marginBottom: 16,
                        fontSize: 12,
                        color: "#a78bfa",
                        textAlign: "center",
                    }}
                >
                    🚀 Vista Demo
                    <br />

                    <Link
                        to="/login"
                        style={{
                            color: "#4FD1C5",
                            fontWeight: 600,
                            textDecoration: "none",
                        }}
                    >
                        Regístrate gratis →
                    </Link>

                </div>

            )}

            <nav>

                {navLinks.map(
                    ({
                        to,
                        icon,
                        label
                    }) => (

                        <Link
                            key={to}
                            to={to}
                            className={
                                isActive(to)
                                    ? "active-link"
                                    : ""
                            }
                        >
                            {icon}
                            {label}
                        </Link>

                    )
                )}

                {isDemo && (

                    <Link
                        to="/"
                        style={{
                            marginTop: 8,
                        }}
                    >
                        <Home size={18} />
                        Volver al inicio
                    </Link>

                )}

            </nav>

            <div className="sidebar-footer">

                <BilletinAvatar size={38} />

                <div>

                    <div className="footer-user">

                        {
                            isDemo
                                ? "Visitante Demo"
                                : user?.nickname || "Usuario"
                        }

                    </div>

                    <div className="footer-plan">

                        {
                            isDemo
                                ? "Sin cuenta"
                                : "Plan Beta"
                        }

                    </div>

                </div>

            </div>

        </aside>

    );
}