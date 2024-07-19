import axios from '../../axios.jsx';

export const setStatus = status => {
  return {
    type: 'FETCH_STATUS_SUCCESS',
    status
  };
};

export const nextSong = () => {
  axios.post('/me/player/next');
  return {
    type: 'CHANGE_SONG'
  };
};

export const previousSong = () => {
  axios.post('/me/player/previous');
  return {
    type: 'CHANGE_SONG'
  };
};
export const playSong = (uris, offset = 0) => async (dispatch) => {
  try {
    const response = await axios.put('/me/player/play', {
      uris: uris,
      offset: { position: offset }
    });

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

export const pauseSong = () => {
  axios.put('/me/player/pause');
  return {
    type: 'PAUSE_STATE'
  };
};

export const seekSong = ms => {
  axios.put(`/me/player/seek?position_ms=${ms}`);
  return {
    type: 'SEEK_SONG'
  };
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
