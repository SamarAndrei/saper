import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Leaderboard from "./pages/Leaderboard/Leaderboard.jsx";
import Settings from "./pages/Settings/Settings.jsx";
import Game from "./pages/Game/Game.jsx";

const routes = [
    { path: '/', element: <Settings /> },
    { path: '/game', element: <Game /> },
    { path: '/leaderboard', element: <Leaderboard /> },
];

const Router = () => {
    return (
        <BrowserRouter basename="/saper">
            <Routes>
                <Route path="/">
                    {routes.map((route, index) => (
                        <Route
                            key={index}
                            path={route.path}
                            element={route.element}
                        />
                    ))}
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;