import {
    LayoutDashboard,
    Receipt,
    Target,
    Bot,
    User,
    Trophy
} from "lucide-react";

import { Link } from "react-router-dom";

export default function Sidebar() {

    return (

        <aside className="sidebar">

            <div className="logo">

                💵 BilleterIA

                <p
                    style={{
                        fontSize: "12px",
                        color: "#94A3B8",
                        marginTop: "8px",
                    }}
                >
                    Finanzas inteligentes
                </p>

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

                <Link to="/achievements">
                    <Trophy size={18} />
                    Logros
                </Link>

                <Link to="/profile">
                    <User size={18} />
                    Perfil
                </Link>

            </nav>

            <div
                style={{
                    marginTop: "auto",
                    paddingTop: "40px",
                    color: "#94A3B8",
                    fontSize: "12px",
                }}
            >
                BilleterIA v1.0 Beta
            </div>

        </aside>
    );
}