import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import del router
import './assets/tailwind.css'; // Importa qui il tuo file Tailwind CSS

createApp(App)
    .use(router)  // Utilizza il router nell'applicazione
    .mount('#app');
