import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Game.css";

export default function Game() {
    const navigate = useNavigate();
    const [grid, setGrid] = useState([]);
    const [minesLeft, setMinesLeft] = useState(0);
    const [flags, setFlags] = useState(0);
    const [timer, setTimer] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gridSize, setGridSize] = useState({ rows: 0, cols: 0 });

    useEffect(() => {
        const settings = localStorage.getItem("gameSettings");
        if (!settings) {
            navigate("/");
            return;
        }

        const { rows, cols, mines } = JSON.parse(settings);
        setGridSize({ rows, cols });
        setMinesLeft(mines);
        setFlags(0);
        setGrid(generateGrid(rows, cols, mines));

        const interval = setInterval(() => setTimer((t) => t + 1), 1000);

        return () => clearInterval(interval);
    }, [navigate]);

    function saveResult(playerName, time) {
        const results = JSON.parse(localStorage.getItem("leaderboard")) || [];

        results.push({ name: playerName, time });

        results.sort((a, b) => a.time - b.time);

        if (results.length > 10) {
            results.pop();
        }

        localStorage.setItem("leaderboard", JSON.stringify(results));
    }

    function generateGrid(rows, cols, mines) {
        let grid = Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => ({
                isMine: false,
                isOpen: false,
                isFlagged: false,
                adjacentMines: 0,
            }))
        );

        let placedMines = 0;
        while (placedMines < mines) {
            const r = Math.floor(Math.random() * rows);
            const c = Math.floor(Math.random() * cols);
            if (!grid[r][c].isMine) {
                grid[r][c].isMine = true;
                placedMines++;
            }
        }

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (!grid[r][c].isMine) {
                    grid[r][c].adjacentMines = countAdjacentMines(grid, r, c);
                }
            }
        }

        return grid;
    }

    function countAdjacentMines(grid, row, col) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = row + dr, nc = col + dc;
                if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length && grid[nr][nc].isMine) {
                    count++;
                }
            }
        }
        return count;
    }

    function openCell(row, col) {
        if (grid[row][col].isOpen || grid[row][col].isFlagged || gameOver) return;

        let newGrid = [...grid];
        newGrid[row][col].isOpen = true;

        if (newGrid[row][col].isMine) {
            setGameOver(true);
            alert("💥 Игра окончена! Вы наступили на мину.");
            return;
        }

        if (checkVictory(newGrid)) {
            setGameOver(true);
            const playerName = prompt("Вы выиграли! Введите ваше имя:");
            if (playerName) {
                saveResult(playerName, timer); // Сохранение результата
            }
        }

        if (newGrid[row][col].adjacentMines === 0) {
            openAdjacentCells(newGrid, row, col);
        }

        setGrid(newGrid);
    }

    function checkVictory(grid) {
        let nonMineCells = 0;
        let openedCells = 0;

        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[0].length; c++) {
                if (!grid[r][c].isMine) {
                    nonMineCells++;
                    if (grid[r][c].isOpen) {
                        openedCells++;
                    }
                }
            }
        }

        return nonMineCells === openedCells;
    }

    function openAdjacentCells(grid, row, col) {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = row + dr, nc = col + dc;
                if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length) {
                    if (!grid[nr][nc].isOpen && !grid[nr][nc].isFlagged) {
                        grid[nr][nc].isOpen = true;

                        if (grid[nr][nc].adjacentMines === 0) {
                            openAdjacentCells(grid, nr, nc);
                        }
                    }
                }
            }
        }
    }

    function toggleFlag(row, col, e) {
        e.preventDefault();
        if (grid[row][col].isOpen || gameOver) return;

        let newGrid = [...grid];
        newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged;
        setFlags(newGrid[row][col].isFlagged ? flags + 1 : flags - 1);
        setGrid(newGrid);
    }

    function restartGame() {
        setGameOver(false);
        setFlags(0);
        setTimer(0);
        setGrid(generateGrid(gridSize.rows, gridSize.cols, minesLeft));
    }

    return (
        <div className="game-container">
            <div className="header">
                <button onClick={() => navigate("/")}>⬅ Назад</button>
                <div>⏳ {timer} сек</div>
                <div>💣 {minesLeft - flags}</div>
                <button onClick={restartGame}>🔄 Перезапуск</button>
            </div>

            <div
                className="grid"
                style={{
                    gridTemplateColumns: `repeat(${gridSize.cols}, 30px)`,
                    gridTemplateRows: `repeat(${gridSize.rows}, 30px)`,
                }}
            >
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`cell ${cell.isOpen ? "open" : ""} ${cell.isMine && gameOver ? "mine" : ""}`}
                            onClick={() => openCell(rowIndex, colIndex)}
                            onContextMenu={(e) => toggleFlag(rowIndex, colIndex, e)}
                        >
                            {cell.isOpen
                                ? cell.isMine
                                    ? "💥"
                                    : cell.adjacentMines > 0
                                        ? <span className={`cell-number-${cell.adjacentMines}`}>{cell.adjacentMines}</span>
                                        : ""
                                : cell.isFlagged
                                    ? "🚩"
                                    : ""}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
