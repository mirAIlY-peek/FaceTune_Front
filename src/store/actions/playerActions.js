import axios from '../../axios.jsx';

export const setStatus = status => ({
  type: 'FETCH_STATUS_SUCCESS',
  status
});

export const setCurrentEmotion = emotion => ({
  type: 'SET_CURRENT_EMOTION',
  emotion
});

export const playEmotionSong = (emotion) => async (dispatch, getState) => {
  try {
    console.log(`Attempting to play song for emotion: ${emotion}`);
    const state = getState();
    const allSongs = state.libraryReducer.songs.items;
    console.log(`Total songs in library: ${allSongs.length}`);
    const emotionSongs = allSongs.filter(song => song.emotion.toLowerCase() === emotion.toLowerCase());
    console.log(`Songs matching emotion ${emotion}: ${emotionSongs.length}`);

    if (emotionSongs.length === 0) {
      console.log(`No songs found for emotion: ${emotion}`);
      return;
    }

    const randomSong = emotionSongs[Math.floor(Math.random() * emotionSongs.length)];
    const songId = randomSong.track.id;

    console.log(`Selected song for emotion ${emotion}: ${songId} (${randomSong.track.name})`);

    await dispatch(playSong([`spotify:track:${songId}`], songId));
    dispatch(setCurrentEmotion(emotion));
    dispatch({ type: 'PLAY_STATE' });
  } catch (error) {
    console.error('Error in playEmotionSong:', error);
  }
};

export const setPlayingState = (isPlaying) => ({
  type: 'SET_PLAYING_STATE',
  payload: isPlaying
});

export const checkAndPlayNextEmotionSong = () => async (dispatch, getState) => {
  const state = getState();
  const { currentEmotion } = state.playerReducer;

  if (currentEmotion) {
    await dispatch(playEmotionSong(currentEmotion));
  }
};

export const nextSong = () => async dispatch => {
  try {
    await axios.post('/me/player/next');
    dispatch({ type: 'CHANGE_SONG' });
  } catch (error) {
    console.error('Error playing next song:', error);
  }
};

export const previousSong = () => async dispatch => {
  await axios.post('/me/player/previous');
  dispatch({ type: 'CHANGE_SONG' });
};

export const playSong = (uris, songId) => async (dispatch, getState) => {
  try {
    const state = getState();
    const allSongs = state.libraryReducer.songs.items;
    console.log('All songs in state:', allSongs);
    console.log('Trying to play song with ID:', songId);

    const songIndex = allSongs.findIndex(song => (song.track ? song.track.id : song.id) === songId);
    console.log("Found song index", songIndex);
    if (songIndex === -1) {
      console.error('Song not found in the list');
      console.log('Available song IDs:', allSongs.map(song => song.track ? song.track.id : song.id));
      return;
    }

    const response = await axios.put('/me/player/play', {
      uris: uris,
      // offset: { position: songIndex },
    });

    console.log('Play response:', response);

    dispatch({ type: 'PLAY_STATE' });
  } catch (error) {
    console.error('Error in playSong:', error.response?.data || error.message);

    if (error.response?.status === 404) {
      console.error('No active device found');
      dispatch({ type: 'NO_ACTIVE_DEVICE' });
    } else {
      dispatch({ type: 'PLAY_ERROR', payload: error.response?.data || error.message });
    }

    throw error;
  }
};

export const playTracks = (tracks, offset) => {
  axios.put('/me/player/play', {
    uris: tracks,
    offset: { position: offset }
  });
  return {
    type: 'PLAY_STATE'
  };
};

export const pauseSong = () => async (dispatch, getState) => {
  try {
    await axios.put('/me/player/pause');
    const { trackPosition } = getState().playerReducer;
    dispatch({
      type: 'PAUSE_STATE',
      payload: trackPosition
    });
  } catch (error) {
    console.error('Error pausing song:', error);
  }
};

export const seekSong = ms => dispatch => {
  axios.put(`/me/player/seek?position_ms=${ms}`);
  dispatch({ type: 'SEEK_SONG' });
};

export const updateCurrentEmotion = (emotion) => (dispatch, getState) => {
  const currentEmotion = getState().playerReducer.currentEmotion;
  if (emotion !== currentEmotion) {
    dispatch(setCurrentEmotion(emotion));
  }
};

// Add this new action
export const songEnded = () => (dispatch, getState) => {
  // console.log("songEnded action creator called");
  dispatch({ type: 'SONG_ENDED' });

  // Add a slight delay before playing the next song
  setTimeout(() => {
    const state = getState();
    const { currentEmotion, isPaused } = state.playerReducer;
    if (currentEmotion && !isPaused) {
      dispatch(playEmotionSong(currentEmotion));
    }
  }, 1000); // 1 second delay
};
export const repeatContext = status => {
  axios.put(`/me/player/repeat?state=${status}`);
  return {
    type: 'REPEAT'
  };
};


export const shuffle = status => {
  axios.put(`/me/player/shuffle?state=${status}`);
  return {
    type: 'Shuffle'
  };
};

export const resumeSong = () => async (dispatch) => {
  try {
    await axios.put('/me/player/play');
    dispatch({
      type: 'RESUME_STATE'
    });
  } catch (error) {
    console.error('Error resuming song:', error);
  }
};
