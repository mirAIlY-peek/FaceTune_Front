const initialState = {
  // ... other initial state properties
  currentEmotion: null,
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
        isEmotionFrozen: true,
        pausedPosition: null
      };
    case 'PAUSE_STATE':
      return {
        ...state,
        playing: false,
        pausedPosition: state.trackPosition
      };
    case 'SONG_ENDED':
      console.log("SONG_ENDED action received in reducer");
      return {
        ...state,
        playing: false,
        isEmotionFrozen: false
      };
    case 'SET_PLAYING_STATE':
      return {
        ...state,
        playing: action.payload
      };
    default:
      return state;
  }
};

export default playerReducer;
