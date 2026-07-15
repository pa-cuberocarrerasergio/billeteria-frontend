import {
    LayoutDashboard,
    Receipt,
    Target,
    Bot,
    User
} from "lucide-react";

import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <aside className="sidebar">

            <div className="logo">
                BilleterIA
            </div>

            <nav>

                <Link to="/dashboard">
                    <LayoutDashboard size={18} />
                    Dashboard
                </Link>

                <Link to="/transactions">
                    <Receipt size={18} />
                    Transacciones
                </Link>

                <Link to="/saving-goals">
                    <Target size={18} />
                    Objetivos
                </Link>

                <Link to="/coach">
                    <Bot size={18} />
                    Billetín IA
                </Link>

                <Link to="/profile">
                    <User size={18} />
                    Perfil
                </Link>

            </nav>

        </aside>
    );
}