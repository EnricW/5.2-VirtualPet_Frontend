import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate("/pets");
        }
    }, [token, navigate]);

    return (
        <div>
            <h1>Welcome to the Virtual Pet App!</h1>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")} style={{ marginLeft: "10px" }}>
                Register
            </button>
        </div>
    );
}