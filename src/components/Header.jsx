import {useLocation} from "react-router-dom";
import {disablePageScroll, enablePageScroll} from "scroll-lock";

import {logo} from "../assets/index.js";
import {navigation} from "../constants/index.js";
import Button from "./Button.jsx";
import MenuSvg from "../assets/svg/MenuSvg.jsx";
import {HamburgerMenu} from "./design/Header.jsx";
import {useState} from "react";

const Header = () => {
    const pathname = useLocation();
    const [openNavigation, setOpenNavigation] = useState(false);

    const toggleNavigation = () => {
        if (openNavigation) {
            setOpenNavigation(false);
            enablePageScroll();
        } else {
            setOpenNavigation(true);
            disablePageScroll();
        }
    };

    const handleClick = () => {
        if (!openNavigation) return;

        enablePageScroll();
        setOpenNavigation(false);
    };

    return (
        <div style={{
            background: 'linear-gradient(#000, rgba(0, 0, 0, .65) 50%, transparent)'
        }}
             className={`fixed top-0 left-0 w-full z-50 border-n-6  
      }`}
        >
            <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
                <a className="block w-[12rem] xl:mr-28" href="#hero">
                    <img src={logo} width={190} height={40} alt="FaceTune.ai"/>
                </a>

                <nav
                    className={`${
                        openNavigation ? "flex" : "hidden"
                    } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
                >

                    <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">

                        {navigation.map((item) => (

                            <a
                                key={item.id}
                                href={item.url}
                                onClick={handleClick}
                                className={`block relative font-code text-2xl text-n-1 transition-colors hover:text-color-1 ${
                                    item.onlyMobile ? "lg:hidden" : ""
                                } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-2xl lg:font-medium ${
                                    item.url === pathname.hash
                                        ? "z-2 lg:text-n-1"
                                        : ""
                                } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
                            >

                                {item.title}

                            </a>
                        ))}
                    </div>

                    <HamburgerMenu/>
                </nav>

                <a
                    href="#signup"
                    className="lg:font-medium lg:text-xl hidden mr-8 text-n-1/50 transition-colors hover:text-n-1 lg:block"
                >
                    Try Today
                </a>
                <Button className="hidden lg:font-medium lg:flex lg:text-xl" href="#login">
                    Sign In
                </Button>

                <Button
                    className="ml-auto lg:hidden"
                    px="px-3"
                    onClick={toggleNavigation}
                >
                    <MenuSvg openNavigation={openNavigation}/>
                </Button>
            </div>
        </div>
    );
};

export default Header;
