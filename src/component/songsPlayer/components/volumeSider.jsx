// components/volumeSider.jsx
import React from 'react';

const VolumeSider = ({ value, onClick, onChange, onChangeEnd }) => {
    const volumeClass = value > 0.5 ? 'fa-volume-up' : value === 0 ? 'fa-volume-off' : 'fa-volume-down';

    return (
        <div className='volume-sider-container'>
            <i onClick={onClick} className={`volumen fa ${volumeClass}`} aria-hidden='true' />
            <input
                type="range"
                className='volume-sider'
                min={0}
                max={100}
                value={value * 100}
                onChange={(e) => {
                    const newValue = Number(e.target.value) / 100;
                    onChange(newValue);
                }}
                onMouseUp={(e) => {
                    const newValue = Number(e.target.value) / 100;
                    onChangeEnd(newValue);
                }}
                style={{
                    cursor: 'pointer',
                }}
            />
        </div>
    );
};

export default VolumeSider;

