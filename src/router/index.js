import { createRouter, createWebHistory } from 'vue-router';
import ViewHome from '@/views/ViewHome.vue';

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
    }
    // Puoi aggiungere qui altre rotte quando crei nuove pagine, ad esempio:
    // {
    //   path: '/about',
    //   name: 'About',
    //   component: () => import('@/views/About.vue'), // Lazy-loaded
    // },
];

// Creazione del router
const router = createRouter({
    history: createWebHistory(process.env.VUE_APP_BASE_URL),
    routes,
});

export default router;
