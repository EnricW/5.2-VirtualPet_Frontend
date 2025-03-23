import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            try {
                const decoded = jwtDecode(token);
                setRole(decoded.role);
            } catch (err) {
                console.error("Failed to decode JWT", err);
                setRole(null);
            }
        } else {
            localStorage.removeItem("token");
            setRole(null);
        }
    }, [token]);

    const logout = () => {
        setToken(null);
        localStorage.removeItem("token");
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ token, role, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
