import React from "react";
import { Route, Routes } from "react-router-dom";
import Lending from "./pages/Lending.jsx";
import EmoAI from "./pages/EmoAI.jsx";
import Registration from "./pages/Registration.jsx";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Lending />} />
            <Route path="/pricing/*" element={<EmoAI />} />
            <Route path="/registration" element={<Registration />} />
        </Routes>
    );
};

export default App;
