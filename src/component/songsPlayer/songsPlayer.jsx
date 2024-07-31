import React, { Component } from 'react';
import { connect } from 'react-redux';
import './songsPlayer.css';

import DetailSection from './components/detailsSection';
import SongsControl from './components/songsControl';
import SongSider from './components/songSider';
import VolumeControl from './components/volumeControl';
import withPlayer from '../../hoc/playerHoc';
import TrackCover from "../trackCover/trackCover.jsx";
import { playEmotionSong, songEnded } from '../../store/actions/playerActions';

class SongsPlayer extends Component {
    toSeconds = (ms) => ms / 1000;

    componentDidUpdate(prevProps) {
        const { currentSong, trackPosition, songEnded } = this.props;
        const position = this.toSeconds(trackPosition) || 0;
        const duration = currentSong ? this.toSeconds(currentSong.duration_ms) : 1;

        if (prevProps.trackPosition !== trackPosition && position >= duration) {
            songEnded();
        }
    }

    render = () => {
        const { currentSong, trackPosition, contains, seekSong } = this.props;
        const position = this.toSeconds(trackPosition) || 0;
        const duration = currentSong ? this.toSeconds(currentSong.duration_ms) : 1;

        return (
            <div className="player-container">
                <div className="player-left">
                    <TrackCover />
                    <DetailSection
                        ids={
                            currentSong.linked_from?.id
                                ? `${currentSong.linked_from.id},${currentSong.id}`
                                : currentSong.id
                        }
                        contains={contains}
                        songName={currentSong.name || ''}
                        album={currentSong.album?.uri.split(':')[2]}
                        artists={currentSong.artists || []}
                    />
                </div>
                <div className="player-center">
                    <SongsControl {...this.props} />
                    <SongSider
                        isEnabled={true}
                        value={position / duration}
                        position={position}
                        duration={duration}
                        onChange={(value) => seekSong(Math.round(value * duration * 1000))}
                    />
                </div>
                <div className="player-right">
                    <VolumeControl />
                </div>
            </div>
        );
    };
}

const mapStateToProps = (state) => ({
    token: state.sessionReducer.token,
    currentSong: state.playerReducer.currentSong,
    trackPosition: state.playerReducer.trackPosition,
    contains: state.libraryReducer.containsCurrent,
    currentEmotion: state.playerReducer.currentEmotion,
});

const mapDispatchToProps = {
    playEmotionSong,
    songEnded
};

export default connect(mapStateToProps, mapDispatchToProps)(withPlayer(SongsPlayer));
