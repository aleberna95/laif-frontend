import { defineStore } from 'pinia';
// Calcola gli anni una volta sola, al momento della definizione dello store
const currentYear = new Date().getFullYear();
const years = [];
for (let i = currentYear; i >= 2020; i--) {
    years.push({ label: i.toString(), value: i });
}
const days = [];
for (let i = 1; i <= 31; i++) {
    days.push({ label: i.toString(), value: i });
}

export const useGlobalStore = defineStore('global', {
    state: () => ({
        currentPage: '',
        months: [
            { label: 'JANUARY', value: 1 },
            { label: 'FEBRUARY', value: 2 },
            { label: 'MARCH', value: 3 },
            { label: 'APRIL', value: 4 },
            { label: 'MAY', value: 5 },
            { label: 'JUNE', value: 6 },
            { label: 'JULY', value: 7 },
            { label: 'AUGUST', value: 8 },
            { label: 'SEPTEMBER', value: 9 },
            { label: 'OCTOBER', value: 10 },
            { label: 'NOVEMBER', value: 11 },
            { label: 'DECEMBER', value: 12 },
        ],
        years,
        days
    }),
    actions: {
        setAppTitle(page) {
            this.currentPage = page;
        }
    }
});