import axios from 'axios';

// Configurazione base di Axios
const apiClient = axios.create({
    baseURL: process.env.VUE_APP_ENV == 'local' ? 'http://localhost:3000' : process.env.VUE_APP_BACKEND_BASE_URL, // Indirizzo del backend
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Timeout per le richieste (10 secondi)
});
console.log('ENV', process.env.VUE_APP_ENV, process.env.VUE_APP_BACKEND_BASE_URL);

// Intercettori per gestire richieste ed errori
apiClient.interceptors.request.use(
    (config) => {
        // Aggiunta di un Bearer Token forzato per le richieste, per scopi di test
        config.headers['Authorization'] = `Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjNmZDA3MmRmYTM4MDU2NzlmMTZmZTQxNzM4YzJhM2FkM2Y5MGIyMTQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbGFpZi1kZTU4YyIsImF1ZCI6ImxhaWYtZGU1OGMiLCJhdXRoX3RpbWUiOjE3MzI5MjUyNDAsInVzZXJfaWQiOiJvVGRUWHZJMG5TUXdqdU9ra2U1ejVLTVlwSVMyIiwic3ViIjoib1RkVFh2STBuU1F3anVPa2tlNXo1S01ZcElTMiIsImlhdCI6MTczMjkyNTI0MCwiZXhwIjoxNzMyOTI4ODQwLCJlbWFpbCI6ImFsZWJlcm5hcmRpbmk5NSt0ZXN0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhbGViZXJuYXJkaW5pOTUrdGVzdEBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.mdNwE7_RosCTNaZ8jfUxuMXLCoiohPEm2fpJ4DokEyK00BYSBwWLtHVOjE7Sonwh_IQjKx6pOrCYFzo29rkzarm6g4KqzrhsPS994neZHBS3HNpg2CAKu2kh6nDeKehs3U9LGUcMLy0Q6dVW85o2SY63zVkrFJpYEkEYoHFYKbEUOWlb9smN7POdiFiFQ7cwg8czdvM8_QasmTQw4HQGNsyBo_Z5_uKBZdi8Ab7KP6bxmO_tKAmtPwSOkiv6M5pDpBpEz_XPVgJFMUOmIpjUkVHLSDpBUcXVCcF4KzvW_sHfdGy72oGwaiijts5gvw57cT1hQCKyaMWgrzpvpKCuhg`;
        return config;
    },
    (error) => {
        // Gestione degli errori di richiesta
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Gestione degli errori di risposta
        if (error.response) {
            // La richiesta è stata effettuata e il server ha risposto con uno status diverso da 2xx
            console.error('Errore risposta:', error.response);
        } else if (error.request) {
            // La richiesta è stata effettuata ma non è arrivata alcuna risposta
            console.error('Nessuna risposta dal server:', error.request);
        } else {
            // Errore generico
            console.error('Errore durante la richiesta:', error.message);
        }
        return Promise.reject(error);
    }
);

// Funzioni per le chiamate API
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