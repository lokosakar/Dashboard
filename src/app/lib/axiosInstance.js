import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // Karena Next.js API ada di /api
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;