import { defineStore } from 'pinia';
import apiClient from '@/utils/apiService'; // Importa il client configurato

export const useExcelStore = defineStore('excel', {
    state: () => ({
    }),
    actions: {
        async downloadExcel({ categories, months, years, type }) {
            const data = {
                categories,
                months,
                years,
                type
            };
            const excel = await apiClient.postData('/api/user/getExcel', data, { responseType: 'blob' });
            return excel;
        },
        async importExcel(formData) {
            try {
                await apiClient.postData('/api/operations/importExcel', formData)
            } catch (error) {
                console.error('Errore durante l\'importazione dell\'excel:', error)
                throw error
            }
        }
    },
});
