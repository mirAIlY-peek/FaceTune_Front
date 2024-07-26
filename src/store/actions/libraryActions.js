import axios from '../../axios.jsx';
import axioss from 'axios';

const backendApi = axioss.create({
  baseURL: 'http://localhost:3000'
});

const fetchSongsPending = () => ({
  type: 'FETCH_SONGS_PENDING'
});

const fetchSongsSuccess = songs => ({
  type: 'FETCH_SONGS_SUCCESS',
  songs
});

const fetchMoreSuccess = (songs, next) => ({
  type: 'FETCH_MORE_SONGS_SUCCESS',
  songs,
  next
});

const fetchSongsError = () => ({
  type: 'FETCH_SONGS_ERROR'
});

const containsSongSuccess = contains => ({
  type: 'CONTAINS_CURRENT_SUCCESS',
  contains
});

export const removeSong = (id, current = false) => {
  axios.delete(`/me/tracks?ids=${id}`);
  return {
    type: 'REMOVE_SONG_SUCCESS',
    current
  };
};

export const addSong = (id, current = false) => {
  axios.put(`/me/tracks?ids=${id}`);
  return {
    type: 'ADD_SONG_SUCCESS',
    current
  };
};

export const containsCurrentSong = id => {
  return async dispatch => {
    try {
      const response = await axios.get(`/me/tracks/contains?ids=${id}`);
      console.log('Response from containsCurrentSong:', response);
      if (response && response.data) {
        dispatch(containsSongSuccess(response.data));
        return response.data;
      } else {
        console.error('Unexpected response format:', response);
        return null;
      }
    } catch (error) {
      console.error('Error checking if song contains:', error);
      return error;
    }
  };
};

export const containsSong = id => {
  return async () => {
    try {
      const response = await axios.get(`/me/tracks/contains?ids=${id}`);
      return response.data;
    } catch (error) {
      console.error('Error checking if song contains:', error);
      return error;
    }
  };
};

// Флаг для отслеживания состояния запроса
let isFetchingSongs = false;

export const fetchSongs = () => {
  return async dispatch => {
    if (isFetchingSongs) return;  // Если запрос уже выполняется, выходим

    isFetchingSongs = true;
    dispatch(fetchSongsPending());
    try {
      let allSongs = [];
      let nextUrl = '/me/tracks?limit=50';

      while (nextUrl) {
        console.log('Requesting:', nextUrl);
        const response = await axios.get(nextUrl);
        allSongs = [...allSongs, ...response.data.items];
        nextUrl = response.data.next;
        console.log('Next URL:', nextUrl);
      }

      const shuffledSongs = allSongs.sort(() => 0.5 - Math.random()).slice(0, 10);

      const artistIds = [...new Set(shuffledSongs.map(song => song.track.artists[0].id))];

      const artistIdGroups = [];
      for (let i = 0; i < artistIds.length; i += 50) {
        artistIdGroups.push(artistIds.slice(i, i + 50));
      }

      const artistsInfo = {};
      for (const group of artistIdGroups) {
        const artistsResponse = await axios.get(`/artists?ids=${group.join(',')}`);
        artistsResponse.data.artists.forEach(artist => {
          artistsInfo[artist.id] = artist.genres;
        });
      }

      const songsWithGenres = shuffledSongs.map(song => ({
        ...song,
        genres: artistsInfo[song.track.artists[0].id] || []
      }));

      const classifiedSongs = await classifySongEmotions(songsWithGenres);

      console.log('Songs classified by emotion:',
          Object.fromEntries(
              ['angry', 'sad', 'disgust', 'fear', 'surprise', 'happy', 'neutral']
                  .map(emotion => [
                    emotion,
                    classifiedSongs.filter(song => song.emotion === emotion).map(song => song.track.id)
                  ])
          )
      );

      dispatch(fetchSongsSuccess({
        items: classifiedSongs,
        total: classifiedSongs.length,
        next: null
      }));

      isFetchingSongs = false;  // Сбрасываем флаг после завершения запроса
      return classifiedSongs;
    } catch (error) {
      dispatch(fetchSongsError());
      console.error('Error fetching songs:', error);
      isFetchingSongs = false;  // Сбрасываем флаг в случае ошибки
      return error;
    }
  };
};

const classifySongEmotions = async (songs) => {
  const songData = songs.map(song => ({
    id: song.track.id,
    name: song.track.name,
    artist: song.track.artists[0].name,
    genres: song.genres.join(', ')
  }));

  const prompt = `Classify the following songs into 7 emotions: angry, sad, disgust, fear, surprise, happy, neutral. Return the results as a JSON object with emotion categories as keys and arrays of song IDs as values. Songs:\n${JSON.stringify(songData, null, 2)}`;

  try {
    const response = await backendApi.post('/chat', { prompt });
    const classifiedSongs = JSON.parse(response.data.response);

    return songs.map(song => ({
      ...song,
      emotion: Object.keys(classifiedSongs).find(emotion => classifiedSongs[emotion].includes(song.track.id)) || 'neutral'
    }));
  } catch (error) {
    console.error('Error classifying songs:', error);
    return songs.map(song => ({ ...song, emotion: 'neutral' }));
  }
};

const filterRepeatedSongs = (keyFn, array) => {
  let ids = [];
  return array.filter(x => {
    let key = keyFn(x),
        isNew = !ids.includes(key);
    if (isNew) ids.push(key);
    return isNew;
  });
};

export const fetchMoreSongs = () => {
  return async (dispatch, getState) => {
    const next = getState().libraryReducer.songs.next;
    try {
      if (next) {
        const response = await axios.get(next);
        const songs = await filterRepeatedSongs(
            x => x.track.id,
            response.data.items
        );
        dispatch(fetchMoreSuccess(songs, response.data.next));
        return songs;
      }
    } catch (error) {
      dispatch(fetchSongsError());
      console.error('Error fetching more songs:', error);
      return error;
    }
  };
};

export const fetchRecentSongs = () => {
  return async dispatch => {
    dispatch(fetchSongsPending());
    try {
      const response = await axios.get('/me/player/recently-played?limit=50');
      const songs = filterRepeatedSongs(x => x.track.id, response.data.items);
      dispatch(fetchSongsSuccess({ items: songs, total: songs.length }));
      console.log('All recent songs fetched:', songs);
      return songs;
    } catch (error) {
      dispatch(fetchSongsError());
      console.error('Error fetching recent songs:', error);
      return error;
    }
  };
};
