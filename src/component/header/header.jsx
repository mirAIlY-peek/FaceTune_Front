import React, { useState } from 'react';
import UserHeader from '../userDetails/userDetails';
import './header.css';

const Header = ({ username, img, handleSubmit, handleConnectSpotify, isLoading, toggleMenu }) => {
    const [activeMode, setActiveMode] = useState('spotify');

    const handleModeChange = (mode) => {
        setActiveMode(mode);
        if (mode === 'spotify') {
            handleConnectSpotify();
        } else {
            handleSubmit();
        }
    };

    return (
        <div className="main-header bg-emo bg-opacity-60 p-4 rounded-xl flex items-center justify-between">
            <div className="flex space-x-6">
                <button className="lg:hidden" onClick={toggleMenu}>
                    Menu
                </button>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleModeChange('spotify')}
                        className={`font-semibold focus:outline-none ${
                            activeMode === 'spotify' ? 'text-green-500' : 'text-gray-400'
                        }`}
                    >
                        From Spotify
                    </button>
                    <span className="text-gray-400">|</span>
                    <button
                        onClick={() => handleModeChange('generate')}
                        className={`font-semibold focus:outline-none ${
                            activeMode === 'generate' ? 'text-purple-400' : 'text-gray-400'
                        }`}
                        disabled={isLoading}
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
