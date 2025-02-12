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

            console.log('Risposta dal backend:', excel);
            console.log('Tipo di dati ricevuto:', excel.data instanceof Blob ? 'Blob valido' : 'Non è un Blob');
            console.log('Dimensione del file ricevuto:', excel.data?.size);


            return excel;
        },
        async importExcel(file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                await apiClient.postData('/api/user/importExcel', formData);
            } catch (error) {
                console.error('Errore durante l\'importazione dell\'excel:', error);
                throw error;
            }
        }
    },
});
