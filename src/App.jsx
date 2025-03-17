import './App.css'
import {Route, Router, Routes} from "react-router-dom";

function App() {

  return (
      <Router>
        <Routes>
          <Route path="/" element={<Settings />} />
          <Route path="/game" element={<Game />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </Router>
  )
}

export default App
