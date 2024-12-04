import { createRouter, createWebHashHistory } from 'vue-router';
import store from '@/store';
import ViewHome from '@/views/ViewHome.vue';
import ViewLogin from '@/views/ViewLogin.vue';
import ViewOperations from '@/views/ViewOperations.vue';
import ViewTips from '@/views/ViewTips.vue';
import ViewUser from '@/views/ViewUser.vue';
import ViewAddOperation from '@/views/ViewAddOperation.vue';

// Definizione delle rotte
const routes = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'ViewHome',
        component: ViewHome,
        meta: {
            requiresAuth: true, // Accesso consentito solo se autenticato
        },
    },
    {
        path: '/login',
        name: 'Login',
        component: ViewLogin,
        meta: {
            guestOnly: true, // Accesso consentito solo se non autenticato
        },
    },
    {
        path: '/operations',
        name: 'Operations',
        component: ViewOperations,
        meta: {
            requiresAuth: true, // Accesso consentito solo se autenticato
        },
    },
    {
        path: '/tips',
        name: 'Tips',
        component: ViewTips,
        meta: {
            requiresAuth: true, // Accesso consentito solo se autenticato
        },
    },
    {
        path: '/user',
        name: 'User',
        component: ViewUser,
        meta: {
            requiresAuth: true, // Accesso consentito solo se autenticato
        },
    },
    {
        path: '/addOperation',
        name: 'AddOperation',
        component: ViewAddOperation,
        meta: {
            requiresAuth: true, // Accesso consentito solo se autenticato
        },
    }
];

// Creazione del router
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

// Navigation Guard per proteggere le route
router.beforeEach((to, from, next) => {
    // Se la route richiede autenticazione e l'utente non è autenticato, viene reindirizzato al login
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!store.getters.isAuthenticated) {
            next('/login');
        }
        else {
            next();
        }
    }
    // Altrimenti, proseguire normalmente
    else {
        next();
    }
});

export default router;
