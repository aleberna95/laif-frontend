import { defineStore } from 'pinia';
import apiClient from '@/utils/apiService'; // Importa il client configurato

export const useOperationsStore = defineStore('operations', {
    state: () => ({
        operations: [],
        incomeCategories: []
    }),

    actions: {
        async addIncomeOperation(operation) {
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
