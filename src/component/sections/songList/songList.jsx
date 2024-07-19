import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    fetchSongs,
    fetchRecentSongs,
    fetchMoreSongs
} from '../../../store/actions/libraryActions';
import { playSong, pauseSong } from '../../../store/actions/playerActions';
import Playlist from '../../songsTable/playlistTable/playlistTable';
import Header from '../../header/songsHeader';
import Spinner from '../../spinner/spinner';

class Songs extends Component {



    async componentDidMount() {
        await this.fetchSongs();
        this.logAllSongs();
    }

    fetchSongs() {
        const { recently, fetchRecentSongs, fetchSongs } = this.props;
        if (recently) {
            return fetchRecentSongs();
        } else {
            return fetchSongs();
        }
    }

    logAllSongs() {
        console.log('All songs:', this.props.songs);

        // Добавляем вывод статистики по эмоциям
        const emotionStats = this.props.songs.reduce((acc, song) => {
            acc[song.emotion] = (acc[song.emotion] || 0) + 1;
            return acc;
        }, {});
        console.log('Emotion statistics:', emotionStats);
    }

    playTracks = (context, offset) => {
        const { songs, playSong } = this.props;
        const songUris = songs.slice(offset).map(s => s.track ? s.track.uri : s.uri);
        playSong(songUris, offset);
    };

    render() {
        const { fetching, songs, pauseSong, playing, currentSong, next, fetchMoreSongs, recently } = this.props;

        return (
            <Spinner section loading={fetching}>
                <div className="player-container">
                    <Header
                        title={recently ? 'Recently Played' : 'Songs'}
                        playSong={() => this.playTracks(songs, 0)}
                        pauseSong={pauseSong}
                        playing={playing}
                    />
                    <Playlist
                        songs={songs}
                        playSong={this.playTracks}
                        pauseSong={pauseSong}
                        current={currentSong}
                        playing={playing}
                        more={!!next}
                        fetchMoreSongs={fetchMoreSongs}
                    />
                </div>
            </Spinner>
        );
    }
}

const mapStateToProps = state => ({
    songs: state.libraryReducer.songs ? state.libraryReducer.songs.items : [],
    user: state.userReducer.user ? state.userReducer.user.id : null,
    fetching: state.libraryReducer.fetchSongsPending,
    next: state.libraryReducer.songs ? state.libraryReducer.songs.next : false,
    currentSong: state.playerReducer.currentSong,
    playing: state.playerReducer.playing
});

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        fetchSongs,
        fetchRecentSongs,
        fetchMoreSongs,
        playSong,
        pauseSong
    },
    dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(Songs);
