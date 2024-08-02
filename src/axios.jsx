import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.spotify.com/v1',
  timeout: 5000,
});

// Добавьте интерцептор для логирования запросов (для отладки)
instance.interceptors.request.use(request => {
  // console.log('Starting Request', request)
  return request
})

export default instance;
