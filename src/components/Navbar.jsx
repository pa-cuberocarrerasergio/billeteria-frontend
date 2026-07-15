import { Link } from "react-router-dom";

export default function Navbar() {

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <nav>
            <Link to="/">Dashboard</Link>

            {" | "}

            <Link to="/transactions">
                Transacciones
            </Link>

            {" | "}

            <Link to="/saving-goals">
                Objetivos
            </Link>

            {" | "}

            <Link to="/coach">
                Coach IA
            </Link>

            {" | "}

            <Link to="/profile">
                👤 Perfil
            </Link>

            {" | "}

            <button onClick={logout}>
                Logout
            </button>

            <hr />
        </nav>
    );
}