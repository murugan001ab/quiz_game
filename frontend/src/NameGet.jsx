import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function NameGet() {
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleNext = () => {
        if (name.trim()) {
            // Optionally, save the name to context or localStorage here
            navigate("/readyquiz");
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "2rem auto", textAlign: "center" }}>
            <h2>Enter your name</h2>
            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                style={{ padding: "0.5rem", width: "80%" }}
            />
            <br />
            <button
                onClick={handleNext}
                disabled={!name.trim()}
                style={{ marginTop: "1rem", padding: "0.5rem 1.5rem" }}
            >
                Next
            </button>
        </div>
    );
}

export default NameGet;