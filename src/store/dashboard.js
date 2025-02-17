import { defineStore } from 'pinia';
import apiClient from '@/utils/apiService'; // Importa il client configurato

export const useDashboardStore = defineStore('dashboard', {
    state: () => ({
        totalIncome: 0,
        totalExpense: 0,
        incomeChange: 0,
        expenseChange: 0,
        estimatedRemainingTotal: 0,
        estimatedReminingPercentage: 0,
    }),
    actions: {
        async fetchEstimatedRemainingTotal() {
            // api get /api/operations/getEstimatedRemainingTotal
            try {
                await apiClient.getData('/api/operations/getEstimedRemainingBudget').then(response => {
                    console.log('getEstimatedRemainingTotal', response.data.data);
                    this.estimatedRemainingTotal = response.data.data.estimatedRemainingBudget;
                    this.estimatedReminingPercentage = response.data.data.percentage;
                });
            }
            catch (error) {
                console.log("Errore durante il fetch dei dati del dashboard", error);
                throw error;
            }
        },
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
    }
});