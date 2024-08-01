const initialState = {
  // ... other initial state properties
  currentEmotion: null,
  isPaused: false,
};

const playerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_STATUS_SUCCESS':
      return {
        ...state,
        status: action.status
      };
    case 'PLAY_STATE':
      return {
        ...state,
        playing: true,
        isPaused: false,
        pausedPosition: null
      };
    case 'PAUSE_STATE':
      return {
        ...state,
        playing: false,
        isPaused: true,
        pausedPosition: state.trackPosition
      };
    case 'SONG_ENDED':
      console.log("SONG_ENDED action received in reducer");
      return {
        ...state,
        playing: false,
        isPaused: false
      };
    case 'SET_PLAYING_STATE':
      return {
        ...state,
        playing: action.payload
      };
    case 'RESUME_STATE':
      return {
        ...state,
        playing: true,
        isPaused: false
      };
    default:
      return state;
  }
};

export default playerReducer;
