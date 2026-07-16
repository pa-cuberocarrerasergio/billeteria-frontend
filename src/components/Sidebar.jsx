import {
    LayoutDashboard,
    Receipt,
    Target,
    Bot,
    User,
    Trophy
} from "lucide-react";

import {
    Link,
    useLocation
} from "react-router-dom";

import BilletinAvatar from "./BilletinAvatar";

export default function Sidebar() {

    const location = useLocation();

    const isActive = (path) =>
        location.pathname === path;

    return (

        <aside className="sidebar">

            <div className="logo">

                <BilletinAvatar size={55} />

                <div>

                    <div className="logo-title">
                        BilleterIA
                    </div>

                    <div className="logo-subtitle">
                        Finanzas inteligentes
                    </div>

                </div>

            </div>

            <nav>

                <Link
                    to="/dashboard"
                    className={
                        isActive("/dashboard")
                            ? "active-link"
                            : ""
                    }
                >
                    <LayoutDashboard size={18} />
                    Dashboard
                </Link>

                <Link
                    to="/transactions"
                    className={
                        isActive("/transactions")
                            ? "active-link"
                            : ""
                    }
                >
                    <Receipt size={18} />
                    Transacciones
                </Link>

                <Link
                    to="/saving-goals"
                    className={
                        isActive("/saving-goals")
                            ? "active-link"
                            : ""
                    }
                >
                    <Target size={18} />
                    Objetivos
                </Link>

                <Link
                    to="/coach"
                    className={
                        isActive("/coach")
                            ? "active-link"
                            : ""
                    }
                >
                    <Bot size={18} />
                    Billetín IA
                </Link>

                <Link
                    to="/achievements"
                    className={
                        isActive("/achievements")
                            ? "active-link"
                            : ""
                    }
                >
                    <Trophy size={18} />
                    Logros
                </Link>

                <Link
                    to="/profile"
                    className={
                        isActive("/profile")
                            ? "active-link"
                            : ""
                    }
                >
                    <User size={18} />
                    Perfil
                </Link>

            </nav>

            <div className="sidebar-footer">

                <BilletinAvatar size={38} />

                <div>

                    <div className="footer-user">
                        Usuario
                    </div>

                    <div className="footer-plan">
                        Plan Beta
                    </div>

                </div>

            </div>

        </aside>
    );
}