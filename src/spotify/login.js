const client_id = import.meta.env.VITE_CLIENT_ID;
const redirect_uri = import.meta.env.VITE_REDIRECT_URI;
const client_secret = import.meta.env.VITE_CLIENT_SECRET;

const Login = {
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
      '&response_type=code',
      '&show_dialog=true',
    ].join('');
  },

  getToken: async () => {
    const accessToken = localStorage.getItem('spotify_access_token');
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    const expiryTime = localStorage.getItem('spotify_token_expiry');

    if (!accessToken || !refreshToken || !expiryTime) {
      return null;
    }

    if (Date.now() > parseInt(expiryTime)) {
      // Token has expired, refresh it
      return await Login.refreshAccessToken(refreshToken);
    }

    return accessToken;
  },

  exchangeCodeForTokens: async (code) => {
    const tokenEndpoint = 'https://accounts.spotify.com/api/token';

    const data = new URLSearchParams();
    data.append('grant_type', 'authorization_code');
    data.append('code', code);
    data.append('redirect_uri', redirect_uri);
    data.append('client_id', client_id);
    data.append('client_secret', client_secret);

    try {
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      const { access_token, refresh_token, expires_in } = responseData;

      // Store tokens
      localStorage.setItem('spotify_access_token', access_token);
      localStorage.setItem('spotify_refresh_token', refresh_token);
      localStorage.setItem('spotify_token_expiry', (Date.now() + expires_in * 1000).toString());

      return access_token;
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      return null;
    }
  },

  refreshAccessToken: async (refreshToken) => {
    const tokenEndpoint = 'https://accounts.spotify.com/api/token';

    const data = new URLSearchParams();
    data.append('grant_type', 'refresh_token');
    data.append('refresh_token', refreshToken);
    data.append('client_id', client_id);
    data.append('client_secret', client_secret);

    try {
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      const { access_token, expires_in } = responseData;

      // Update stored tokens
      localStorage.setItem('spotify_access_token', access_token);
      localStorage.setItem('spotify_token_expiry', (Date.now() + expires_in * 1000).toString());

      return access_token;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return null;
    }
  },
};

export default Login;
