import React from "react";
import { Route, Routes } from "react-router-dom";
import Lending from "./pages/Lending.jsx";
import EmoAI from "./pages/EmoAI.jsx";
import Spotify from "./pages/Spotify.jsx";
import { Analytics } from "@vercel/analytics/react"


const App = () => {

    return (
        <>
            <Routes>
                <Route path="/" element={<Lending />} />
                <Route path="/main" element={<EmoAI />} />
                <Route path="/spotify" element={< Spotify  />} />
            </Routes>
            <Analytics />
        </>
    );
};

export default App;
