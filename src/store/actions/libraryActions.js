import axios from '../../axios.jsx';

import axioss from 'axios';

const backendApi = axioss.create({
  baseURL: 'http://localhost:3005'
});




const fetchSongsPending = () => {
  return {
    type: 'FETCH_SONGS_PENDING'
  };
};

const fetchSongsSuccess = songs => {
  return {
    type: 'FETCH_SONGS_SUCCESS',
    songs
  };
};

const fetchMoreSucess = (songs, next) => {
  return {
    type: 'FETCH_MORE_SONGS_SUCCESS',
    songs,
    next
  };
};

const fetchSongsError = () => {
  return {
    type: 'FETCH_SONGS_ERROR'
  };
};


const containsSongSuccess = contains => {
  return {
    type: 'CONTAINS_CURRENT_SUCCESS',
    contains: contains
  };
};

export const removeSong = (id, current = false) => {
  axios.delete(`/me/tracks?ids=${id}`);
  return {
    type: 'REMOVE_SONG_SUCCESS',
    current: current
  };
};

export const addSong = (id, current = false) => {
  axios.put(`/me/tracks?ids=${id}`);
  return {
    type: 'ADD_SONG_SUCCESS',
    current: current
  };
};

export const containsCurrentSong = id => {
  return async dispatch => {
    try {
      const response = await axios.get(`/me/tracks/contains?ids=${id}`);
      dispatch(containsSongSuccess(response, true));
      return response.data;
    } catch (error) {
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
      return error;
    }
  };
};

export const fetchSongs = () => {
  return async dispatch => {
    dispatch(fetchSongsPending());
    try {
      // Получаем все треки пользователя
      let allSongs = [];
      let nextUrl = '/me/tracks?limit=50';

      while (nextUrl) {
        const response = await axios.get(nextUrl);
        allSongs = [...allSongs, ...response.data.items];
        nextUrl = response.data.next;
      }

      // Перемешиваем треки и выбираем первые 100
      const shuffledSongs = allSongs.sort(() => 0.5 - Math.random()).slice(0, 20);

      // Собираем уникальные ID артистов
      const artistIds = [...new Set(shuffledSongs.map(song => song.track.artists[0].id))];

      // Разбиваем ID артистов на группы по 50 (максимум для одного запроса к API)
      const artistIdGroups = [];
      for (let i = 0; i < artistIds.length; i += 50) {
        artistIdGroups.push(artistIds.slice(i, i + 50));
      }

      // Получаем информацию обо всех артистах за минимальное количество запросов
      const artistsInfo = {};
      for (const group of artistIdGroups) {
        const artistsResponse = await axios.get(`/artists?ids=${group.join(',')}`);
        artistsResponse.data.artists.forEach(artist => {
          artistsInfo[artist.id] = artist.genres;
        });
      }

      // Добавляем жанры к песням
      const songsWithGenres = shuffledSongs.map(song => ({
        ...song,
        genres: artistsInfo[song.track.artists[0].id] || []
      }));

      // Классификация песен по эмоциям
      const classifiedSongs = await classifySongEmotions(songsWithGenres);

      // Вывод результата в консоль
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
      return classifiedSongs;
    } catch (error) {
      dispatch(fetchSongsError());
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

  const prompt = `Classify the following songs into 7 emotions: angry, sad, disgust, fear, surprise, happy, neutral. Return the results as a JSON object with emotion categories as keys and arrays of song IDs as values. Only return the JSON object, nothing else. Songs:\n${JSON.stringify(songData, null, 2)}`;

  try {
    const response = await backendApi.post('/chat', { prompt });
    let classifiedSongs;

    // Попытка извлечь JSON из ответа
    const jsonMatch = response.data.response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      classifiedSongs = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('No valid JSON found in the response');
    }

    console.log('Classified songs:', classifiedSongs);

    return songs.map(song => ({
      ...song,
      emotion: Object.keys(classifiedSongs).find(emotion => classifiedSongs[emotion].includes(song.track.id)) || 'neutral'
    }));
  } catch (error) {
    console.error('Error classifying songs:', error);
    // В случае ошибки, присваиваем всем песням эмоцию 'neutral'
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
        dispatch(fetchMoreSucess(songs, response.data.next));
        return songs;
      }
    } catch (error) {
      dispatch(fetchSongsError());
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
      return error;
    }
  };
};
