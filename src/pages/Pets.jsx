import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserPets, createPet, performPetAction, deletePet } from "../services/petService";

export default function Pets() {
    const { token, role } = useContext(AuthContext);
    const [pets, setPets] = useState([]);
    const [name, setName] = useState("");
    const [type, setType] = useState("HEARTS");
    const [error, setError] = useState(null);

    const defaultBackground = "mountain.webp";
    const backgrounds = [
        "kingdom.webp",
        "forest.webp",
        "mountain.webp",
        "waterfall.webp"
    ];
    const petImages = {
        HEARTS: '/assets/hearts.png',
        SPADES: '/assets/spades.png',
        CLUBS: '/assets/clubs.png',
        DIAMONDS: '/assets/diamonds.png',
    };
    const petLaughImages = {
        HEARTS: '/assets/hearts_laugh.png',
        SPADES: '/assets/spades_laugh.png',
        CLUBS: '/assets/clubs_laugh.png',
        DIAMONDS: '/assets/diamonds_laugh.png',
    };

    const [backgroundMap, setBackgroundMap] = useState({});
    const [petBounceMap, setPetBounceMap] = useState({});
    const [petLaughMap, setPetLaughMap] = useState({});

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const data = await getUserPets(token);
                setPets(data);
                const initialBackgrounds = {};
                data.forEach((pet) => {
                    initialBackgrounds[pet.id] = defaultBackground;
                });
                setBackgroundMap(initialBackgrounds);
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
            setBackgroundMap((prev) => ({
                ...prev,
                [newPet.id]: defaultBackground,
            }));
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
            setPets(pets.filter((pet) => pet.id !== petId));
            setBackgroundMap((prev) => {
                const updated = { ...prev };
                delete updated[petId];
                return updated;
            });
        } catch (err) {
            setError(err.response?.data || "Failed to delete pet.");
        }
    };

    const cycleBackground = (petId) => {
        setBackgroundMap((prev) => {
            const current = prev[petId] || defaultBackground;
            const currentIndex = backgrounds.indexOf(current);
            const next = backgrounds[(currentIndex + 1) % backgrounds.length];
            return { ...prev, [petId]: next };
        });
    };

    const triggerBounce = (petId) => {
        setPetBounceMap((prev) => ({ ...prev, [petId]: true }));
        setPetLaughMap((prev) => ({ ...prev, [petId]: true }));

        setTimeout(() => {
            setPetBounceMap((prev) => ({ ...prev, [petId]: false }));
            setPetLaughMap((prev) => ({ ...prev, [petId]: false }));
        }, 600); // match bounce duration
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
                        <option value="HEARTS">♥️ Hearts</option>
                        <option value="DIAMONDS">♦️ Diamonds</option>
                        <option value="CLUBS">♣️ Clubs</option>
                        <option value="SPADES">♠️ Spades</option>
                    </select>
                    <button type="submit">Create Pet</button>
                </form>
            </div>

            <div className="pet-list-panel">
                <div className="pet-list-wrapper">
                    {pets.length > 0 ? (
                        <div className="pet-grid">
                            {pets.map((pet) => (
                                <div
                                    className="pet-card"
                                    key={pet.id}
                                    style={{
                                        backgroundImage: `url('/assets/${backgroundMap[pet.id] || defaultBackground}')`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        position: "relative"
                                    }}
                                >
                                    <div
                                        className="cycle-icon"
                                        title="Change Background"
                                        onClick={() => cycleBackground(pet.id)}
                                    >
                                        🖼️
                                    </div>
                                    <div className="pet-card-main">
                                        <img
                                            src={
                                                petLaughMap[pet.id]
                                                    ? petLaughImages[pet.type]
                                                    : petImages[pet.type]
                                            }
                                            alt={`${pet.type} icon`}
                                            className={`pet-image ${petBounceMap[pet.id] ? 'bounce' : ''}`}
                                            onClick={() => {
                                                triggerBounce(pet.id); // optional visual effect
                                                handleAction(pet.id, "INTERACT"); // trigger INTERACT on click
                                            }}
                                        />
                                        <div className="pet-info-panel">
                                            <div className="pet-info">
                                                <h2>{pet.name}</h2>
                                                <p>
                                                    <strong>Type:</strong>{" "}
                                                    {{
                                                        HEARTS: "♥️",
                                                        DIAMONDS: "♦️",
                                                        CLUBS: "♣️",
                                                        SPADES: "♠️"
                                                    }[pet.type] || "❓"}
                                                </p>
                                                <p>
                                                    <strong>Luck:</strong>{" "}
                                                    {{
                                                        HAPPY: "😎",
                                                        OKAY: "🙂",
                                                        UNHAPPY: "😐",
                                                        BANKRUPT: "😢"
                                                    }[pet.luck] || "❓"}
                                                </p>
                                                <div className="chips-bar-wrapper">
                                                    <span><strong>Chips:</strong> {pet.chips}</span>
                                                    <div className="chips-bar">
                                                        <div
                                                            className="chips-bar-fill"
                                                            style={{ width: `${Math.min(pet.chips, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pet-buttons">
                                        <button onClick={(e) => { e.stopPropagation(); handleAction(pet.id, "FEED"); }}>🎲 Feed</button>
                                        <button onClick={(e) => { e.stopPropagation(); handleAction(pet.id, "PLAY"); }}>💰 Play</button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeletePet(pet.id, pet.name); }} className="danger">❌ Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No pets found. Create one!</p>
                    )}
                </div>
            </div>
        </div>
    );
}
