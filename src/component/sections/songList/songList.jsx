import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    fetchSongs,
    fetchRecentSongs,
    fetchMoreSongs,
} from '../../../store/actions/libraryActions';
import { playSong, pauseSong } from '../../../store/actions/playerActions.js'
import Playlist from '../../songsTable/playlistTable/playlistTable';
import Header from '../../header/songsHeader';
import Spinner from '../../spinner/spinner';

const Songs = ({
                   fetchSongs,
                   fetchRecentSongs,
                   playSong,
                   pauseSong,
                   songs,
                   fetching,
                   playing,
                   currentSong,
                   next,
                   fetchMoreSongs,
                   recently,
                   currentEmotion,
                   emotionSongMap,
                   fetchPlayerState
               }) => {
    const [lastPlayedEmotion, setLastPlayedEmotion] = useState(null);

    useEffect(() => {
        fetchSongs();
    }, [fetchSongs]);

    const playEmotionBasedSong = useCallback(() => {
        console.log('Current Emotion:', currentEmotion);
        console.log('Emotion Song Map:', emotionSongMap);
        if (currentEmotion && emotionSongMap) {
            const emotionSongIds = emotionSongMap[currentEmotion.toLowerCase()];
            console.log(`Found ${emotionSongIds ? emotionSongIds.length : 0} songs for emotion: ${currentEmotion}`);

            if (emotionSongIds && emotionSongIds.length > 0) {
                const randomSongId = emotionSongIds[Math.floor(Math.random() * emotionSongIds.length)];
                console.log('Selected song ID:', randomSongId);

                const songUri = `spotify:track:${randomSongId}`;
                console.log('Playing song with URI:', songUri);
                playSong([songUri]);
                setLastPlayedEmotion(currentEmotion);
            } else {
                console.log('No songs found for the current emotion');
            }
        }
    }, [currentEmotion, emotionSongMap, playSong]);

    useEffect(() => {
        if (currentEmotion !== lastPlayedEmotion) {
            playEmotionBasedSong();
        }
    }, [currentEmotion, lastPlayedEmotion, playEmotionBasedSong]);

    useEffect(() => {
        if (!playing && currentSong) {
            // Когда текущая песня заканчивается, воспроизводим следующую
            playEmotionBasedSong();
        }
    }, [playing, currentSong, playEmotionBasedSong]);

    const playTracks = (context, offset) => {
        const songUris = songs.slice(offset).map(s => s.track ? s.track.uri : s.uri);
        playSong(songUris, offset);
    };

    return (
        <Spinner section loading={fetching}>
            <div className="player-container">
                <Header
                    title={recently ? 'Recently Played' : 'Songs'}
                    playSong={() => playTracks(songs, 0)}
                    pauseSong={pauseSong}
                    playing={playing}
                />
                <Playlist
                    songs={songs}
                    playSong={playTracks}
                    pauseSong={pauseSong}
                    current={currentSong}
                    playing={playing}
                    more={!!next}
                    fetchMoreSongs={fetchMoreSongs}
                />
            </div>
        </Spinner>
    );
};

const mapStateToProps = state => ({
    songs: state.libraryReducer.songs ? state.libraryReducer.songs.items : [],
    user: state.userReducer.user ? state.userReducer.user.id : null,
    fetching: state.libraryReducer.fetchSongsPending,
    next: state.libraryReducer.songs ? state.libraryReducer.songs.next : false,
    currentSong: state.playerReducer.currentSong,
    playing: state.playerReducer.playing,
    emotionSongMap: state.libraryReducer.emotionSongMap,
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
