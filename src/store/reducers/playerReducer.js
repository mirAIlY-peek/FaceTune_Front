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
    case 'SET_CURRENT_EMOTION':
      return {
        ...state,
        currentEmotion: action.emotion,
      };
    case 'SONG_ENDED':
      return {
        ...state,
        // You might want to reset some state here
      };
    default:
      return state;
  }
};

export default playerReducer;
