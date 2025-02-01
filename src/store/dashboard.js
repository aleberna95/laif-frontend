import { defineStore } from 'pinia';
import apiClient from '@/utils/apiService'; // Importa il client configurato

export const useDashboardStore = defineStore('dashboard', {
    state: () => ({
        totalIncome: 0,
        totalExpense: 0,
        incomeChange: 0,
        expenseChange: 0,
        operations: [],
        categories: [],
    }),
    actions: {
        async fetchDashboardData(data) {
            // api get /api/operations/getMonthlySummary come params year e month
            this.categories = [];
            try {
                await apiClient.getData('/api/operations/getMonthlySummary', data).then(response => {
                    console.log('fetchDashboardData', response.data.data);

                    this.totalIncome = response.data.data.totalIncome;
                    this.totalExpense = response.data.data.totalExpense;
                    this.incomeChange = response.data.data.incomeChange;
                    this.expenseChange = response.data.data.expenseChange;
                });
            }
            catch (error) {
                console.log("Errore durante il fetch dei dati del dashboard", error);
                throw error;
            }

        },
        async fetchCategories(type) {
            const path = type === 'INCOME' ? '/api/operations/getIncomeCategories' : '/api/operations/getExpenseCategories';
            this.categories = [];
            try {
                const response = await apiClient.getData(path);
                this.categories = response.data.data;
                return response.data.data;
            } catch (error) {
                console.error('Errore durante il fetch delle operazioni ricorrenti:', error);
                throw error;
            }
        },
        async fetchOperations(data) {
            this.operations = [];
            try {
                await apiClient.getData('/api/operations/getOperations', data).then(response => {
                    console.log('fetchOperations', response.data.data);
                    this.operations = response.data.data.records;
                });
            }
            catch (error) {
                console.log("Errore durante il fetch dei dati del dashboard", error);
                throw error;
            }
        }
    }
});