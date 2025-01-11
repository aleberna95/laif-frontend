import { defineStore } from 'pinia';
import apiClient from '@/utils/apiService'; // Importa il client configurato

export const useOperationsStore = defineStore('operations', {
    state: () => ({
        operations: [],
    }),

    actions: {
        async fetchOperations(year, month) {
            try {
                const response = await apiClient.getData(`/api/operations/getOperations?year=${year}&month=${month}`);
                this.operations = response.data.data;
                return response.data; // Restituisce i dati per essere usati nel componente
            } catch (error) {
                console.error('Errore durante il fetch delle operazioni:', error);
                throw error;
            }
        },
    },
});
