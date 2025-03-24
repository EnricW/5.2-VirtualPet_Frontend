import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
    const { token, logout, role, username } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link to="/">🏠 Home</Link>
                {token ? (
                    <div className="nav-links">
                        <Link to="/pets">
                            {role === "ROLE_ADMIN"
                                ? "🛠️ Admin Panel"
                                : `🐾 ${username}'s Pets`}
                        </Link>
                        <button onClick={logout}>🚪 Logout</button>
                    </div>
                ) : (
                    <div className="nav-links">
                        <Link to="/login">🔑 Login</Link>
                        <Link to="/register">📝 Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
}