import React, { Component } from 'react';
import { connect } from 'react-redux';
import './songsPlayer.css';

import DetailSection from './components/detailsSection';
import SongsControl from './components/songsControl';
import SongSider from './components/songSider';
import VolumeControl from './components/volumeControl';
import withPlayer from '../../hoc/playerHoc';
import TrackCover from "../trackCover/trackCover.jsx";


class SongsPlayer extends Component {
    toSeconds = (ms) => ms / 1000;

    render = () => {
        const { currentSong, trackPosition, contains, seekSong } = this.props;
        const position = this.toSeconds(trackPosition) || 0;
        const duration = currentSong ? this.toSeconds(currentSong.duration_ms) : 1;

        return (
            <div className='player-container'>
                {/*<TrackCover />*/}
                {currentSong.id && (
                    <DetailSection
                        ids={
                            currentSong.linked_from?.id
                                ? `${currentSong.linked_from.id},${currentSong.id}`
                                : currentSong.id
                        }
                        contains={contains}
                        songName={currentSong.name || ''}
                        album={currentSong.album.uri.split(':')[2]}
                        artists={currentSong.artists || []}
                    />
                )}

                <SongsControl {...this.props} />
                <SongSider
                    isEnabled={true}
                    value={position / duration}
                    position={position}
                    duration={duration}
                    onChange={(value) => seekSong(Math.round(value * duration * 1000))}
                />
                <VolumeControl />
            </div>
        );
    };
}

const mapStateToProps = (state) => ({
    currentSong: state.playerReducer.currentSong,
    trackPosition: state.playerReducer.trackPosition,
    contains: state.libraryReducer.containsCurrent,
});

export default connect(mapStateToProps)(withPlayer(SongsPlayer));
