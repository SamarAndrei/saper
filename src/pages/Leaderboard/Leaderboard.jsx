import React, { useState, useEffect } from "react";
import './Leaderboard.css'

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const results = JSON.parse(localStorage.getItem("leaderboard")) || [];
        setLeaderboard(results);
    }, []);

    return (
        <div className="leaderboard">
            <h2>Таблица лидеров</h2>
            <table>
                <thead>
                <tr>
                    <th>Имя игрока</th>
                    <th>Время (сек)</th>
                </tr>
                </thead>
                <tbody>
                {leaderboard.map((result, index) => (
                    <tr key={index}>
                        <td>{result.name}</td>
                        <td>{result.time}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Leaderboard;
