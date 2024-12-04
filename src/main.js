import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import del router
import './assets/tailwind.css'; // Importa qui il tuo file Tailwind CSS
import store from './store'; // Import dello store Vuex

// Carica il token dal localStorage nello store all'avvio
const token = localStorage.getItem('userToken');
if (token) {
    store.commit('SET_TOKEN', token);
    // Potresti aggiungere anche altre informazioni sull'utente qui.
}

createApp(App)
    .use(router)  // Utilizza il router nell'applicazione
    .mount('#app');
