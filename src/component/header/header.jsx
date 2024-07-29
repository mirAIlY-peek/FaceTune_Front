import React from 'react';
import UserHeader from '../userDetails/userDetails';
import './header.css';

const Header = ({ username, img, onModeChange, toggleMenu }) => {
    return (
        <div className="main-header bg-emo bg-opacity-60 p-4 rounded-xl flex items-center justify-between">
            <div className="flex space-x-6">
                <button className="lg:hidden" onClick={toggleMenu}>
                    Menu
                </button>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onModeChange('spotify')}
                        className="font-semibold focus:outline-none text-gray-400 hover:text-green-500"
                    >
                        From Spotify
                    </button>
                    <span className="text-gray-400">|</span>
                    <button
                        onClick={() => onModeChange('generate')}
                        className="font-semibold focus:outline-none text-gray-400 hover:text-purple-400"
                    >
                        Generate Music
                    </button>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <UserHeader username={username} img={img} />
            </div>
        </div>
    );
};

export default Header;
