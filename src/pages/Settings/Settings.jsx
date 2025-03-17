import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

const difficulties = {
    easy: { rows: 8, cols: 8, mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 },
    hard: { rows: 32, cols: 16, mines: 100 },
};

export default function Settings() {
    const [difficulty, setDifficulty] = useState("easy");
    const navigate = useNavigate();

    const startGame = () => {
        localStorage.setItem("gameSettings", JSON.stringify(difficulties[difficulty]));
        navigate("/game");
    };

    return (
        <div className="settings-container">
            <h1 className="title">Выберите сложность</h1>
            <select className="difficulty-select" value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}>
                <option value="easy">Простой (8x8, 10 мин)</option>
                <option value="medium">Средний (16x16, 40 мин)</option>
                <option value="hard">Сложный (32x16, 100 мин)</option>
            </select>
            <button className="start-button" onClick={startGame}>Начать игру</button>
            <button onClick={() => navigate("/leaderboard")}>🏆 Таблица лидеров</button>
        </div>
    );
}
