import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
    const { token, logout } = useContext(AuthContext);

    return (
        <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
            <Link to="/">🏠 Home</Link> |{" "}
            {token ? (
                <>
                    <Link to="/pets">🐾 My Pets</Link> |{" "}
                    <button onClick={logout} style={{ color: "red" }}>🚪 Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login">🔑 Login</Link> |{" "}
                    <Link to="/register">📝 Register</Link>
                </>
            )}
        </nav>
    );
}