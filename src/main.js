import { createApp } from 'vue';
import { useAuthStore } from '@/store/auth';
import App from './App.vue';
import './assets/tailwind.css'; // Importa qui il tuo file Tailwind CSS
import pinia from './store';
import i18n from '../i18n'; // Import dell'istanza di i18n
import router from './router'; // Import del router

const app = createApp(App);
app.use(pinia)
// Inizializza l'autenticazione
const authStore = useAuthStore();
authStore.initializeAuth();

app.use(router)  // Utilizza il router nell'applicazione
app.use(i18n) // Utilizza l'istanza di i18n nell'applicazione

app.mount('#app');

