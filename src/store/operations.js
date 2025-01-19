import { defineStore } from 'pinia';
import apiClient from '@/utils/apiService'; // Importa il client configurato

export const useOperationsStore = defineStore('operations', {
    state: () => ({
        operations: [],
        incomeCategories: [],
        expenseCategories: [],
        recursiveTypes: [],
        frequencies: [],
    }),

    actions: {
        async addRecurringOperation(operation) {
            //insertRecurringExpense
            try {
                await apiClient.postData('/api/operations/insertRecurringExpense', operation);
            } catch (error) {
                console.error('Errore durante l\'aggiunta dell\'operazione ricorrente:', error);
                throw error;
            }
        },
        async addOperation(operation) {
            try {
                await apiClient.postData('/api/operations/insertOperation', operation);
            } catch (error) {
                console.error('Errore durante l\'aggiunta dell\'operazione:', error);
                throw error;
            }
        },
        async getIncomeCategories() {
            try {
                const response = await apiClient.getData('/api/operations/getIncomeCategories');
                this.incomeCategories = response.data.data;
            } catch (error) {
                console.error('Errore durante il fetch delle categorie:', error);
                throw error;
            }
        },

        async getRecursiveTypes() {
            try {
                const response = await apiClient.getData('/api/operations/getRecursiveTypes');
                this.recursiveTypes = response.data.data;
            } catch (error) {
                console.error('Errore durante il fetch dei tipi ricorsivi:', error);
                throw error;
            }
        },
        async getFrequencies() {
            try {
                const response = await apiClient.getData('/api/operations/getFrequencies');
                this.frequencies = response.data.data;
            } catch (error) {
                console.error('Errore durante il fetch delle frequenze:', error);
                throw error;
            }
        },
        async getExpenseCategories() {
            try {
                const response = await apiClient.getData('/api/operations/getExpenseCategories');
                this.expenseCategories = response.data.data;
            } catch (error) {
                console.error('Errore durante il fetch delle categorie:', error);
                throw error;
            }
        },
        async fetchOperations(year, month, pageSize, cursor = null) {
            try {
                const response = await apiClient.getData('/api/operations/getOperations', { year, month, pageSize, cursor });
                this.operations = response.data.data.records;
                return response.data; // Restituisce i dati per essere usati nel componente
            } catch (error) {
                console.error('Errore durante il fetch delle operazioni:', error);
                throw error;
            }
        },
    },
});
