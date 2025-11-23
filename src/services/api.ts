import axios from 'axios';

export const API_BASE_URL = 'http://192.168.0.110:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para logging (apenas desenvolvimento)
api.interceptors.request.use(
    (config) => {
        console.log(`${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('Erro na requisição:', error);
        return Promise.reject(error);
    },
);

export default api;