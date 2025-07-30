// services/axiosInstance.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // 🔥 Importante para enviar cookies
});

export default api;
