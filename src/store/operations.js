import { defineStore } from 'pinia';
import apiClient from '@/utils/apiService'; // Importa il client configurato
import { useI18n } from 'vue-i18n';

export const useOperationsStore = defineStore('operations', {
    state: () => ({
        operations: [],
        categories: [],
        recursiveTypes: [],
        frequencies: [],
        recurringExpenses: [],
        tips: null,
    }),

    actions: {
        async fetchTips() {
            try {
                const response = await apiClient.getData('/api/operations/getTips');
                this.tips = response.data.data;
                return response.data.data;
            } catch (error) {
                console.error('Errore durante il fetch dei suggerimenti:', error);
                throw error;
            }
        },
        async deleteRecurringExpense(id) {
            try {
                await apiClient.deleteData(`/api/operations/deleteRecurringExpense/${id}`);
            }
            catch (error) {
                console.error('Errore durante l\'eliminazione dell\'operazione ricorrente:', error);
                throw error;
            }
        },
        async getRecurringExpenses() {
            try {
                const response = await apiClient.getData('/api/operations/getRecurringExpenses');
                this.recurringExpenses = response.data.data.records;
                return response.data.data.records;
            } catch (error) {
                console.error('Errore durante il fetch delle operazioni ricorrenti:', error);
                throw error;
            }
        },
        async deleteOperation(id) {
            try {
                await apiClient.deleteData(`/api/operations/deleteOperation/${id}`);
            } catch (error) {
                console.error('Errore durante l\'eliminazione dell\'operazione:', error);
                throw error;
            }
        },
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
        async getCategories() {
            try {
                const { t } = useI18n();
                const response = await apiClient.getData('/api/operations/getCategories');
                const categories = response.data.data;

                // Definiamo le categorie speciali
                const priorityCategories = ['INVESTMENTS', 'SAVINGS', 'LEISURE'];
                const lastCategory = 'OTHER';

                // Separiamo le categorie
                let filteredCategories = categories.filter(cat =>
                    !priorityCategories.includes(cat.value) && cat.value !== lastCategory
                );

                // Ordiniamo alfabeticamente quelle in mezzo
                const parsedCategories = filteredCategories.map(cat => ({ value: cat.value, label: t(cat.value) }));

                parsedCategories.sort((a, b) => a.label.localeCompare(b.label));

                // Reinseriamo le categorie speciali nei posti giusti
                const sortedCategories = [
                    ...priorityCategories.map(value => ({ value, label: t(value) })),
                    ...parsedCategories.map(cat => ({ value: cat.value, label: cat.label })),
                    { value: lastCategory, label: t(lastCategory) }
                ];

                // Assegniamo la lista ordinata
                this.categories = sortedCategories;

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
        async fetchOperations({ year, month, type = undefined, category = undefined, pageSize, cursor = null }) {
            try {
                this.operations = [];
                const response = await apiClient.getData('/api/operations/getOperations', { year, month, pageSize, cursor, type, category });
                this.operations = response.data.data.records;
                return response.data; // Restituisce i dati per essere usati nel componente
            } catch (error) {
                console.error('Errore durante il fetch delle operazioni:', error);
                throw error;
            }
        },
        resetOperations() {
            this.operations = [];
        },

    },
});
