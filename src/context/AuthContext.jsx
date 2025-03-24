import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [role, setRole] = useState(null);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            try {
                const decoded = jwtDecode(token);
                setRole(decoded.role);
                setUsername(decoded.sub); // assuming the username is in 'sub'
            } catch (err) {
                console.error("Failed to decode JWT", err);
                setRole(null);
                setUsername(null);
            }
        } else {
            localStorage.removeItem("token");
            setRole(null);
            setUsername(null);
        }
    }, [token]);

    const logout = () => {
        setToken(null);
        localStorage.removeItem("token");
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ token, role, username, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
