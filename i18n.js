import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import it from './locales/it.json';

// Funzione per ottenere la lingua dell'utente (da localStorage o impostazioni API)
const getUserLanguage = () => {
    console.log(localStorage.getItem('userLanguage'));
    
    return localStorage.getItem('userLanguage') || 'it'; // Default: Italiano
};

const i18n = createI18n({
    locale: getUserLanguage(), // Usa la lingua salvata
    fallbackLocale: 'it', // Fallback se la lingua non è supportata
    messages: { en, it },
});

export default i18n;
