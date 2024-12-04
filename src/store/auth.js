// store/modules/auth.js
const state = {
    user: null,
    token: null,
    isAuthenticated: false,
};

const mutations = {
    SET_USER(state, user) {
        state.user = user;
        state.isAuthenticated = !!user;
    },
    SET_TOKEN(state, token) {
        state.token = token;
        localStorage.setItem('userToken', token);
    },
    CLEAR_AUTH(state) {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('userToken');
    },
};

const actions = {
    login({ commit }, { user, token }) {
        commit('SET_USER', user);
        commit('SET_TOKEN', token);
    },
    logout({ commit }) {
        commit('CLEAR_AUTH');
    },
};

const getters = {
    isAuthenticated: (state) => state.isAuthenticated, // Definisci come funzione
    getUser: (state) => state.user,
    getToken: (state) => state.token,
};

export default {
    state,
    mutations,
    actions,
    getters,
};
