import axios from 'axios';
import { useAuthStore } from '@/store/auth';
import { auth } from '@/services/firebase';
import { signOut } from 'firebase/auth';
import router from '@/router'; // Assicurati che questo percorso sia corretto

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
        const { token, refreshToken } = store;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            config.headers['x-refresh-token'] = refreshToken;
        }
        return config;
    },
    (error) => {
        console.log("Errore nella richiesta", error);
        return Promise.reject(error);
    }
);

// Intercettore per gestire gli errori nelle risposte
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Esempio di gestione specifica per errori di autenticazione
        if (error.response && error.response.status === 401) {
            try {
                signOut(auth);
                const store = useAuthStore();
                // Reindirizza alla pagina di login
                store.logout();
                router.push('/login');
            } catch (error) {
                console.error('Errore durante il logout:', error);
            }
        }

        // Gestione di altri errori o logica di retry
        return Promise.reject(error);
    }
);


export default {
    getData(url, params = {}) {
        return apiClient.get(url, { params });
    },
    postData(url, data, config = {}) {
        return apiClient.post(url, data, { ...config });
    },
    putData(url, data) {
        return apiClient.put(url, data);
    },
    deleteData(url) {
        return apiClient.delete(url);
    },
};
