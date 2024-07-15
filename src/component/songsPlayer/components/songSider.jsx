import React, { useState, useRef, useEffect } from 'react';
import '../songsPlayer.css';

const ProgressBar = ({ isEnabled, direction = 'horizontal', value, onChange, onClick }) => {
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef(null);

    const handleMouseDown = (e) => {
        if (!isEnabled) return;
        setIsDragging(true);
        updateValue(e);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        updateValue(e);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const updateValue = (e) => {
        if (!sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const position = direction === 'horizontal' ? e.clientX - rect.left : rect.bottom - e.clientY;
        const size = direction === 'horizontal' ? rect.width : rect.height;
        let newValue = position / size;
        newValue = Math.max(0, Math.min(1, newValue));
        onChange(newValue);
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const volumeClass =
        value > 0.5 ? 'fa-volume-up' : value === 0 ? 'fa-volume-off' : 'fa-volume-down';

    return (
        <div className='volume-slider-container'>
            <i onClick={onClick} className={`volume fa ${volumeClass}`} aria-hidden='true' />
            <div
                ref={sliderRef}
                className={`custom-slider ${direction}`}
                onMouseDown={handleMouseDown}
            >
                <div
                    className='slider-bar'
                    style={{
                        [direction === 'horizontal' ? 'width' : 'height']: `${value * 100}%`
                    }}
                />
                <div
                    className='slider-handle'
                    style={{
                        [direction === 'horizontal' ? 'left' : 'bottom']: `${value * 100}%`,
                        transform: `translate${direction === 'horizontal' ? 'X' : 'Y'}(-50%)`
                    }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
