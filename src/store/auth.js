import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
    }),

    actions: {
        initializeAuth() {
            const token = localStorage.getItem('userToken');
            const refreshToken = localStorage.getItem('refreshToken');
            if (token) {
                this.token = token;
                this.refreshToken = refreshToken;
                this.isAuthenticated = true;
            }
        },
        login(user, token, refreshToken) {
            this.user = user;
            this.token = token;
            this.refreshToken = refreshToken;
            this.isAuthenticated = !!user;
            localStorage.setItem('userToken', token);
            localStorage.setItem('refreshToken', refreshToken);
        },
        logout() {
            this.user = null;
            this.token = null;
            this.refreshToken = null;
            this.isAuthenticated = false;
            localStorage.removeItem('userToken');
            localStorage.removeItem('refreshToken');
        },
    },
});
