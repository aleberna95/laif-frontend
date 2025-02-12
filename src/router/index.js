import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';

import ViewHome from '@/views/ViewHome.vue';
import ViewLogin from '@/views/ViewLogin.vue';
import ViewOperations from '@/views/ViewOperations.vue';
import ViewTips from '@/views/ViewTips.vue';

// Operations
import ViewAddOperation from '@/views/ViewAddOperation.vue';
import OperationChoice from '@/components/layout/operations/OperationChoice.vue';
import AddIncome from '@/components/layout/operations/AddIncome.vue';
import ExpenseChoice from '@/components/layout/operations/ExpenseChoice.vue';
import AddExpense from '@/components/layout/operations/AddExpense.vue';
import AddRecurringExpense from '@/components/layout/operations/AddRecurringExpense.vue';

// User
import ViewUser from '@/views/ViewUser.vue';
import UserChoice from '@/components/layout/user/UserChoice.vue';
import RecurrenceAndSettings from '@/components/layout/user/RecurrenceAndSettings.vue';
import UserSetting from '@/components/layout/user/UserSetting.vue';
import ClonesTool from '@/components/layout/user/ClonesTool.vue';
import ExcelDocuments from '@/components/layout/user/ExcelDocuments.vue';

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
        path: '/addOperation',
        name: 'AddOperation',
        redirect: '/addOperation/operationChoice',
        component: ViewAddOperation,
        meta: {
            requiresAuth: true, // Accesso consentito solo se autenticato
        },
        children: [
            {
                // aggiungo la rotta per aggiungere le entrate
                path: 'operationChoice',
                name: 'OperationChoice',
                component: OperationChoice,
                meta: {
                    requiresAuth: true, // Accesso consentito solo se autenticato
                },
            },
            {
                // aggiungo la rotta per aggiungere le entrate
                path: 'income',
                name: 'AddIncome',
                component: AddIncome,
                meta: {
                    requiresAuth: true, // Accesso consentito solo se autenticato
                },
            },
            {
                path: 'expenseChoice',
                name: 'ExpenseChoice',
                component: ExpenseChoice,
                meta: {
                    requiresAuth: true, // Accesso consentito solo se autenticato
                },
            },
            {
                // aggiungo la rotta per aggiungere le entrate
                path: 'singleExpense',
                name: 'AddExpense',
                component: AddExpense,
                meta: {
                    requiresAuth: true, // Accesso consentito solo se autenticato
                },
            },
            {
                // aggiungo la rotta per aggiungere le entrate
                path: 'recurringExpense',
                name: 'AddRecurringExpense',
                component: AddRecurringExpense,
                meta: {
                    requiresAuth: true, // Accesso consentito solo se autenticato
                },
            },

        ]
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
        redirect: '/user/userChoice',
        component: ViewUser,
        meta: {
            requiresAuth: true, // Accesso consentito solo se autenticato
        },
        children: [
            {
                path: 'userChoice',
                name: 'UserChoice',
                component: UserChoice,
                meta: {
                    requiresAuth: true, // Accesso consentito solo se autenticato
                },
            },
            {
                path: 'recurrenceAndSettings',
                name: 'RecurrenceAndSettings',
                component: RecurrenceAndSettings,
                meta: {
                    requiresAuth: true, // Accesso consentito solo se autenticato
                },
            },
            {
                path: 'userSetting',
                name: 'UserSetting',
                component: UserSetting,
                meta: {
                    requiresAuth: true, // Accesso consentito solo se autenticato
                },
            },
            {
                path: 'clonesTool',
                name: 'ClonesTool',
                component: ClonesTool,
                meta: {
                    requiresAuth: true, // Accesso consentito solo se autenticato
                },
            },
            {
                path: 'excelDocuments',
                name: 'ExcelDocuments',
                component: ExcelDocuments,
                meta: {
                    requiresAuth: true, // Accesso consentito solo se autenticato
                },
            },
        ]
    },
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
        const store = useAuthStore();
        if (!store.isAuthenticated) {
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
