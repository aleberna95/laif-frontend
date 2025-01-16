<template>
  <div class="max-w-4xl mx-auto bg-gray-100 p-5 h-full overflow-hidden">
    <!-- Filtri per anno e mese -->
    <div class="flex justify-between space-x-4">
      <DateSelector label="Anno" :options="years" v-model="selectedYear" @update:modelValue="updateOperations" />
      <DateSelector label="Mese" :options="months" v-model="selectedMonth" @update:modelValue="updateOperations" />
    </div>

    <!-- Tabella delle operazioni -->
    <div class="overflow-y-auto bg-white shadow-lg rounded-lg mt-4 h-[calc(100%-140px)]">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Tipo
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider rounded-tr-lg">
              Categoria
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider rounded-tl-lg">
              Importo
            </th>
          </tr>
        </thead>
        <tbody v-if="operations && operations.length > 0" class="bg-white divide-y divide-gray-200">
          <tr v-for="operation in operations" :key="operation.id" class="hover:bg-gray-100 transition duration-200">
            <td
              class="px-6 py-4 whitespace-nowrap text-sm"
              :class="{ 'text-green-500': operation.type === 'INCOME', 'text-red-500': operation.type === 'EXPENSE' }">
              {{ operation.type === 'INCOME' ? 'Entrata' : 'Uscita' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 rounded-r-lg">
              {{ operation.type === 'INCOME' ? operation.incomeCategory : operation.expenseCategory }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 rounded-l-lg">
              {{ operation.amount }} €
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import { computed, ref, onMounted } from 'vue';
  import { useOperationsStore } from '@/store/operations';
  import DateSelector from '@/components/DateSelector.vue';

  export default {
    name: 'OperationsList',
    components: { DateSelector },
    setup() {
      const operationsStore = useOperationsStore();
      const operations = computed(() => operationsStore.operations);

      const selectedYear = ref(new Date().getFullYear());
      const selectedMonth = ref(new Date().getMonth() + 1);

      const years = ref([
        { label: '2025', value: 2025 },
        { label: '2024', value: 2024 },
        { label: '2023', value: 2023 },
      ]);

      const months = ref([
        { label: 'Gennaio', value: 1 },
        { label: 'Febbraio', value: 2 },
        { label: 'Marzo', value: 3 },
        { label: 'Aprile', value: 4 },
        { label: 'Maggio', value: 5 },
        { label: 'Giugno', value: 6 },
        { label: 'Luglio', value: 7 },
        { label: 'Agosto', value: 8 },
        { label: 'Settembre', value: 9 },
        { label: 'Ottobre', value: 10 },
        { label: 'Novembre', value: 11 },
        { label: 'Dicembre', value: 12 },
      ]);
      const pageSize = ref(5);
      const cursor = ref(null);

      const fetchOperations = async () => {
        cursor.value = null;
        try {
          console.log('Fetching operations...', selectedYear.value, selectedMonth.value);

          const operationsData = await operationsStore.fetchOperations(
            selectedYear.value,
            selectedMonth.value,
            pageSize.value,
            cursor.value,
          );

          cursor.value = operationsData.nextCursor;
        } catch (error) {
          console.error('Errore durante il caricamento delle operazioni:', error);
        }
      };

      const updateOperations = () => {
        fetchOperations();
      };

      onMounted(fetchOperations);

      return {
        operations,
        selectedYear,
        selectedMonth,
        years,
        months,
        updateOperations,
      };
    },
  };
</script>

<style scoped></style>
