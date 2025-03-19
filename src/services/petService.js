import axios from "axios";

const API_URL = "http://localhost:8080/pets"; // Backend pets endpoint

export const getUserPets = async (token) => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`, // Send JWT token
            },
        });
        return response.data; // List of pets
    } catch (error) {
        console.error("Error fetching pets:", error.response?.data || error.message);
        throw error;
    }
};

export const createPet = async (token, name, type) => {
    try {
        const response = await axios.post(
            "http://localhost:8080/pets/create",
            { name, type },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data; // Returns the created pet
    } catch (error) {
        console.error("Error creating pet:", error.response?.data || error.message);
        throw error;
    }
};

export const performPetAction = async (token, petId, action) => {
    try {
        const response = await axios.post(
            `http://localhost:8080/pets/${petId}/action?action=${action}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data; // Updated pet
    } catch (error) {
        console.error(`Error performing action (${action}):`, error.response?.data || error.message);
        throw error;
    }
};

export const deletePet = async (token, petId) => {
    try {
        await axios.delete(`http://localhost:8080/pets/${petId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error("Error deleting pet:", error.response?.data || error.message);
        throw error;
    }
};