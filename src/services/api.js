import axios from 'axios';

const api = axios.create({
  baseURL: 'https://yts.lt/api/v2'
});

export default api;
