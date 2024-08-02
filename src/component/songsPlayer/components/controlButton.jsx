import React from 'react';
import '../songsPlayer.css'


const button = props => (
  <div className={'control-btn ' + props.className} onClick={props.onClick}>
    <i className={'fa ' + props.icon} />
  </div>
);

export default button;
