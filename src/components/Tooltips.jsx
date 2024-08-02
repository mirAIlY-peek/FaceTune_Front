import React from 'react';

const Tooltip = ({ children, content, isVisible, placement = 'center' }) => {
    if (!isVisible) return children;

    return (
        <div className="relative">
            {children}
            <div className={`absolute z-50 p-2 bg-gray-800 text-white text-sm rounded shadow-lg ${getPlacementClasses(placement)}`}>
                {content}
            </div>
        </div>
    );
};

const getPlacementClasses = (placement) => {
    switch (placement) {
        case 'center': return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
        default: return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    }
};

export default Tooltip;
