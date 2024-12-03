const initialState = {
  // ... other initial state properties
  currentEmotion: null,
  isPaused: false,
  playHistory: [],
  currentIndex: -1,
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
    case 'SET_EMOTION_BUFFER':
      return {
        ...state,
        emotionBuffer: action.payload
      };
    case 'SONG_ENDED':
      // console.log("SONG_ENDED action received in reducer");
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
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        playHistory: [...state.playHistory, action.payload],
        currentIndex: state.currentIndex + 1,
      };
    case 'SET_CURRENT_INDEX':
      return {
        ...state,
        currentIndex: action.payload,
      };
    default:
      return state;
  }
};

export default playerReducer;
