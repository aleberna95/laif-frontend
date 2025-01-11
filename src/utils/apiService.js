import axios from 'axios';
import { useAuthStore } from '@/store/auth';

// Configurazione base di Axios
const apiClient = axios.create({
    baseURL: process.env.VUE_APP_ENV == 'local' ? 'http://localhost:3000' : process.env.VUE_APP_BACKEND_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Intercettore per aggiungere il token alle richiesteF
apiClient.interceptors.request.use(
    (config) => {
        const store = useAuthStore();
        const token = store.token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default {
    getData(url) {
        return apiClient.get(url);
    },
    postData(url, data) {
        return apiClient.post(url, data);
    },
    putData(url, data) {
        return apiClient.put(url, data);
    },
    deleteData(url) {
        return apiClient.delete(url);
    },
};
