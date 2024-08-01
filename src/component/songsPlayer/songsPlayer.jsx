import React, { Component } from 'react';
import { connect } from 'react-redux';
import './songsPlayer.css';

import DetailSection from './components/detailsSection';
import SongsControl from './components/songsControl';
import SongSider from './components/songSider';
import VolumeControl from './components/volumeControl';
import withPlayer from '../../hoc/playerHoc';
import TrackCover from "../trackCover/trackCover.jsx";
import { playEmotionSong, songEnded, playSong, pauseSong, resumeSong, nextSong, previousSong } from '../../store/actions/playerActions';

class SongsPlayer extends Component {
    toSeconds = (ms) => ms / 1000;

    handlePlayPause = () => {
        const { playing, pauseSong, resumeSong, pausedPosition, seekSong } = this.props;
        if (playing) {
            pauseSong();
        } else {
            if (pausedPosition !== null) {
                seekSong(pausedPosition);
            }
            resumeSong();
        }
    };

    componentDidUpdate(prevProps) {
        const { currentSong, trackPosition, songEnded, playing } = this.props;
        const position = this.toSeconds(trackPosition) || 0;
        const duration = currentSong ? this.toSeconds(currentSong.duration_ms) : 1;

        if (prevProps.trackPosition !== trackPosition && position >= duration) {
            console.log("Song ended, dispatching songEnded action");
            songEnded();
        }

        // Add this check
        if (prevProps.playing && !playing) {
            console.log("Playing state changed to false, dispatching songEnded action");
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
                    <SongsControl
                        {...this.props}
                        handlePlayPause={this.handlePlayPause}
                        nextSong={this.props.nextSong}
                        previousSong={this.props.previousSong}
                    />
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
    playing: state.playerReducer.playing,
    pausedPosition: state.playerReducer.pausedPosition,
});

const mapDispatchToProps = {
    playEmotionSong,
    songEnded,
    playSong,
    pauseSong,
    resumeSong,
    nextSong,
    previousSong,
};

export default connect(mapStateToProps, mapDispatchToProps)(withPlayer(SongsPlayer));
