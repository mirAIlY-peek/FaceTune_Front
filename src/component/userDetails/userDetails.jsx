import React from 'react';
import './userDetails.css';

const UserHeader = ({ username, img }) => (
    <div className='user-details-container'>
        <img alt='user' className='user-image' src={img} />
        <p className='user-name'>{username}</p>
    </div>
);

export default UserHeader;
