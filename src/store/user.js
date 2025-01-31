import { defineStore } from 'pinia';
import apiClient from '@/utils/apiService'; // Importa il client configurato
import { getCurrencySymbol } from '@/utils/globalUtils'; // Importa la funzione formatCurrency

export const useUserStore = defineStore('user', {
    state: () => ({
        userSettings: null,
        user: null,
        leisureAmount: 0,
        investPercentage: 0,
        savePercentage: 0,
        currency: "€",
        darkMode: false,
        language: 'it',
    }),

    actions: {
        async updateSettings(settings) {
            try {
                await apiClient.putData('/api/user/updateSettings', settings);
            } catch (error) {
                console.error('Errore durante l\'aggiornamento delle impostazioni utente:', error);
                throw error;
            }
        },
        async getUser() {
            this.user = null;
            try {
                const response = await apiClient.getData('/api/user/getUser');
                this.user = response.data.data;
                this.currency = getCurrencySymbol(response.data.data.currency);
                // salvo darkMode e language in localStorage
                localStorage.setItem('darkMode', response.data.data.darkMode);
                localStorage.setItem('userLanguage', response.data.data.language);

                this.darkMode = response.data.data.darkMode;
                this.language = response.data.data.language;
                return response.data.data;
            } catch (error) {
                console.error('Errore durante il fetch dell\'utente:', error);
                throw error;
            }
        },
        async getUserSettings() {
            this.userSettings = null;
            return apiClient.getData(`/api/user/getUserSettings`)
                .then((response) => {
                    this.userSettings = response.data.data;
                    this.leisureAmount = response.data.data.leisureAmount || 0;
                    this.investPercentage = response.data.data.investPercentage || 0;
                    this.savePercentage = response.data.data.savePercentage || 0;
                    return response.data.data;
                })
                .catch((error) => {
                    console.error('Errore durante il fetch delle impostazioni utente:', error);
                    throw error;
                });
        },
    },
});
