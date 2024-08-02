// components/songSider.jsx
import React from 'react';

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const SongSider = ({ isEnabled, value, position, duration, onChange }) => {
    // Ensure value is a number between 0 and 100
    const sliderValue = isNaN(value) || value < 0 ? 0 : value > 1 ? 100 : value * 100;

    return (
        <div className="song-slider-container">
            <span>{formatTime(position)}</span>
            <input
                type="range"
                className="song-slider"
                disabled={!isEnabled}
                min={0}
                max={100}
                value={sliderValue}
                onChange={(e) => onChange(Number(e.target.value) / 100)}
            />
            <span>{formatTime(duration || 0)}</span>
        </div>
    );
};

export default SongSider;
