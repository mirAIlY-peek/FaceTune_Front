import React from 'react';
import withUiActions from '../../../hoc/uiHoc';
import withStatus from '../../../hoc/statusHoc';

const DetailSection = props => {
    const artists = props.artists.length;
    return (
        <div className="details-section ">
            <p
                onClick={() => props.onAlbumClick(props.album)}
                className="song-name text-white text-sm font-semibold truncate hover:underline cursor-pointer"
            >
                {props.songName}
            </p>
            <div className="artist-name text-gray-400 text-xs">
                {props.artists.map((artist, i) => (
                    <span key={i}>
                        <span
                            className="artist hover:underline cursor-pointer"
                            onClick={() => props.onArtistClick(artist.uri.split(':')[2])}
                        >
                            {artist.name}
                        </span>
                        {i + 1 !== artists ? ', ' : ''}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default withUiActions(withStatus(DetailSection));
