import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserPets, createPet, performPetAction, deletePet } from "../services/petService";

export default function Pets() {
    const { token } = useContext(AuthContext);
    const [pets, setPets] = useState([]);
    const [name, setName] = useState("");
    const [type, setType] = useState("HEARTS");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const data = await getUserPets(token);
                setPets(data);
            } catch (err) {
                setError(err.response?.data || "Failed to load pets.");
            }
        };

        if (token) fetchPets();
    }, [token]);

    const handleCreatePet = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const newPet = await createPet(token, name, type);
            setPets([...pets, newPet]);
            setName("");
        } catch (err) {
            setError(err.response?.data || "Failed to create pet.");
        }
    };

    const handleAction = async (petId, action) => {
        setError(null);
        try {
            const updatedPet = await performPetAction(token, petId, action);
            setPets(pets.map((pet) => (pet.id === petId ? updatedPet : pet)));
        } catch (err) {
            setError(err.response?.data || `Failed to perform ${action}.`);
        }
    };

    const handleDeletePet = async (petId, petName) => {
        if (!window.confirm(`Are you sure you want to delete ${petName}?`)) return;

        setError(null);
        try {
            await deletePet(token, petId);
            setPets(pets.filter((pet) => pet.id !== petId)); // Remove pet from list
        } catch (err) {
            setError(err.response?.data || "Failed to delete pet.");
        }
    };

    return (
        <div className="pets-page">
            <div className="create-pet-panel">
                <form onSubmit={handleCreatePet}>
                    <input
                        type="text"
                        placeholder="Pet Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="HEARTS">Hearts</option>
                        <option value="DIAMONDS">Diamonds</option>
                        <option value="CLUBS">Clubs</option>
                        <option value="SPADES">Spades</option>
                    </select>
                    <button type="submit">Create Pet</button>
                </form>
            </div>

            <div className="pet-list-panel">
                {pets.length > 0 ? (
                    <div className="pet-grid">
                        {pets.map((pet) => (
                            <div className="pet-card" key={pet.id}>
                                <h2>{pet.name}</h2>
                                <p><strong>Type:</strong> {pet.type}</p>
                                <p><strong>Chips:</strong> {pet.chips}</p>
                                <p><strong>Luck:</strong> {pet.luck}</p>
                                <div className="pet-buttons">
                                    <button onClick={() => handleAction(pet.id, "PLACE_BET")}>🎲 Place Bet</button>
                                    <button onClick={() => handleAction(pet.id, "WIN_BIG")}>💰 Win Big</button>
                                    <button onClick={() => handleAction(pet.id, "GO_ALL_IN")}>♠️ Go All In</button>
                                    <button onClick={() => handleDeletePet(pet.id, pet.name)} className="danger">❌ Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No pets found. Create one!</p>
                )}
            </div>
        </div>
    );
}