import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const { token, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div>
            <h1>Welcome to the Virtual Pet App!</h1>
            {token ? (
                <>
                    <button onClick={() => navigate("/pets")}>Go to Pets</button>
                    <button onClick={logout} style={{ marginLeft: "10px" }}>Logout</button>
                </>
            ) : (
                <>
                    <button onClick={() => navigate("/login")}>Login</button>
                    <button onClick={() => navigate("/register")} style={{ marginLeft: "10px" }}>Register</button>
                </>
            )}
        </div>
    );
}