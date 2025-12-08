// emotionReducer.js
const initialState = {
    currentEmotion: null,
};

export default function emotionReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_CURRENT_EMOTION':
            return {
                ...state,
                currentEmotion: action.payload,
            };
        default:
            return state;
    }
}
