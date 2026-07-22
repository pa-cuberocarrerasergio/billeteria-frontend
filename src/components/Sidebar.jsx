import { LayoutDashboard, Receipt, Target, Bot, User, Trophy, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BilletinAvatar from "./BilletinAvatar";

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const isDemo = location.pathname.startsWith("/demo");

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
        <BilletinAvatar size={40} mood="happy" />
        <div>
          <div className="footer-user">{user ? user.nickname || "Usuario" : "Usuario"}</div>
          <div className="footer-plan">{isDemo ? "Demo Gratuita" : "Plan Gratuito"}</div>
        </div>
      </div>
    </aside>
  );
}
