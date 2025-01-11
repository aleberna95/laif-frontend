import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        isAuthenticated: false,
    }),

    actions: {
        initializeAuth() {
            const token = localStorage.getItem('userToken');
            if (token) {
                this.token = token;
                this.isAuthenticated = true;
                // Puoi aggiungere altre informazioni sull'utente se necessario
                // ad esempio, caricarle da un'API.
            }
        },
        login(user, token) {
            this.user = user;
            this.token = token;
            this.isAuthenticated = !!user;
            localStorage.setItem('userToken', token);
        },
        logout() {
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;
            localStorage.removeItem('userToken');
        },
    },
});
