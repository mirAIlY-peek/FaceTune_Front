const initialState = {
  songs: {
    items: [],
    total: 0,
    next: null
  },
  fetchSongsError: false,
  fetchSongsPending: false,
  lastFetchTime: null,
  containsCurrent: false
};

export const playlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_SONGS_SUCCESS':
      return {
        ...state,
        songs: {
          ...action.songs,
          items: action.songs.items.map(song => ({
            ...song,
            genres: song.genres || [],
            emotion: song.emotion || 'neutral'
          }))
        },
        fetchSongsError: false,
        fetchSongsPending: false,
        lastFetchTime: Date.now()
      };
    case 'FETCH_SONGS_PENDING':
      return {
        ...state,
        fetchSongsPending: true
      };
    case 'FETCH_SONGS_ERROR':
      return {
        ...state,
        fetchSongsError: true,
        fetchSongsPending: false
      };
    case 'FETCH_MORE_SONGS_SUCCESS':
      return {
        ...state,
        songs: {
          ...state.songs,
          next: action.next,
          items: [...state.songs.items, ...action.songs]
        }
      };
    case 'CONTAINS_CURRENT_SUCCESS':
      return {
        ...state,
        containsCurrent: action.contains.data.includes(true)
      };
    case 'REMOVE_SONG_SUCCESS':
      return {
        ...state,
        containsCurrent: action.current ? false : state.containsCurrent
      };
    case 'ADD_SONG_SUCCESS':
      return {
        ...state,
        containsCurrent: action.current ? true : state.containsCurrent
      };
    default:
      return state;
  }
};

export default playlistReducer;
