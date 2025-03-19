import axios from "axios";

const API_URL = "http://localhost:8080/auth"; // Base backend URL

export const registerUser = async (username, password) => {
    console.log("Sending Register Request:", { username, password });
    try {
        const response = await axios.post(`${API_URL}/register`, { username, password });
        console.log("Register Response:", response.data);
        return response;
    } catch (error) {
        console.error("Register Error:", error.response?.data || error.message);
        throw error;
    }
};

export const loginUser = async (username, password) => {
    console.log("📡 Sending Login Request:", { username, password });
    try {
        const response = await axios.post(`${API_URL}/login`, { username, password });
        console.log("Login Response:", response.data);
        return response;
    } catch (error) {
        console.error("Login Error:", error.response?.data || error.message);
        throw error;
    }
};