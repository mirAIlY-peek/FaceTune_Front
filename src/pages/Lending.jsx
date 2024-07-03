import React from "react";
import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import Pricing from "../components/Pricing.jsx";
import Roadmap from "../components/Roadmap.jsx";

const Lending = () => {
    return (
        <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
            <Header />
            <Hero />
            <Roadmap />
            {/*<Benefits />*/}
            {/*<Collaboration />*/}
            {/*<Services />*/}
            <Pricing />
            <Footer />
        </div>
    );
};

export default Lending;
