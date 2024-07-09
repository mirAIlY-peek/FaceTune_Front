import React from "react";
import { Route, Routes } from "react-router-dom";
import Lending from "./pages/Lending.jsx";
import EmoAI from "./pages/EmoAI.jsx";
import { SpeedInsights } from "@vercel/speed-insights/next"
// import Registration from "./pages/Registration.jsx";
// import Search from "./pages/Search.jsx";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Lending />} />
            <Route path="/pricing" element={<EmoAI />} />
            <SpeedInsights />
            {/*<Route path="/search" element={<Search />} />*/}
            {/*<Route path="/registration" element={<Registration />} />*/}
        </Routes>
    );
};

export default App;
