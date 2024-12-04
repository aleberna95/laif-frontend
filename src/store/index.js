import { createStore } from 'vuex';

export default createStore({
    state: {
        isAuthenticated: false,
    },
    mutations: {
        setAuthentication(state, status) {
            state.isAuthenticated = status;
        },
    },
    actions: {
        login({ commit }) {
            // Effettua la chiamata di login qui e imposta lo stato
            commit('setAuthentication', true);
        },
        logout({ commit }) {
            // Azione di logout, per esempio rimuovere un token
            commit('setAuthentication', false);
        },
    },
    getters: {
        isAuthenticated: (state) => state.isAuthenticated,
    },
});
