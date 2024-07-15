const client_id = "9b233dda84b94e9c8c73db98f685fb21";
const redirect_uri = "http://localhost:5173/spotify";

export default {
  logInWithSpotify: () => {
    let scopes = [
      'streaming',
      'user-read-private',
      'user-read-email',
      'playlist-modify-public',
      'user-read-recently-played',
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-library-modify',
      'user-follow-modify',
      'playlist-read-private',
      'playlist-modify-public',
      'playlist-modify-private',
      'playlist-read-collaborative',
      'user-library-read',
      'user-read-playback-position',
      'user-top-read',
      'user-follow-modify',
      'user-follow-read',
    ].join(' ');

    let scopes_encoded = encodeURIComponent(scopes);

    window.location = [
      'https://accounts.spotify.com/authorize',
      `?client_id=${client_id}`,
      `&redirect_uri=${redirect_uri}`,
      `&scope=${scopes_encoded}`,
      '&response_type=token',
      '&show_dialog=true',
    ].join('');
  },

  getToken: () => {
    let hashParams = {};
    let e,
        r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    if (hashParams.access_token) {
      localStorage.setItem('spotify_token', hashParams.access_token);
      window.location.hash = '';
      return hashParams.access_token;
    } else {
      return localStorage.getItem('spotify_token');
    }
  },
};
