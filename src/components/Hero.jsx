import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button.jsx";
import Section from "./Section.jsx";
import CompanyLogos from "./CompanyLogos.jsx";
import './componentCSS/Styles.css';

const Hero = () => {
    let navigate = useNavigate();

    const handlePricingClick = () => {
        navigate("/main");
    };

    const handleRegistrationClick = () => {
        navigate("/registration");
    };

    return (
        <Section
            className="pt-[12rem] -mt-[5.25rem]"
            crossesOffset="lg:translate-y-[5.25rem]"
            customPaddings
            id="hero"
        >
            <div className="container relative">
                <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
                    <h1 className="h1 mb-6">Dive into Music that Feels You</h1>
                    <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
                        Immerse yourself in music that understands your every emotion and resonates with your soul.
                    </p>
                    {/*<Button onClick={handlePricingClick} white className="bg-gray-800 hover:bg-gray-700 rounded-full">*/}
                    {/*    Sign in*/}
                    {/*</Button>*/}
                    {/*<Button onClick={handleRegistrationClick} white className="bg-gray-800 hover:bg-gray-700 rounded-full">*/}
                    {/*    Register*/}
                    {/*</Button>*/}
                    <div className="button-container mt-8 justify-center">
                        {/*<a className="framer-button primary-button button-animate" onClick={handleRegistrationClick}>*/}
                        {/*    <div className="label-wrap">*/}
                        {/*        <p className="button-text" data-text="Join Waitlist">Join Waitlist</p>*/}
                        {/*    </div>*/}
                        {/*</a>*/}
                        <a className="framer-button ghost-button button-animate" onClick={handlePricingClick}>
                            <div className="label-wrap">
                                <p className="button-text" data-text="Join Community">Join Community</p>
                            </div>
                        </a>

                    </div>
                </div>
                <CompanyLogos className="hidden relative z-10 mt-20 lg:block" />
            </div>
        </Section>
    );
};

export default Hero;
