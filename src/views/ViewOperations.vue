<template>
  <div class="max-w-4xl mx-auto bg-color-primary p-5 h-full overflow-hidden">
    <!-- Filtri per anno e mese -->
    <div class="flex justify-between space-x-4">
      <DateSelector :label="$t('year')" :options="years" v-model="selectedYear" @update:modelValue="updateOperations" />
      <DateSelector
        :label="$t('month')"
        :options="months"
        v-model="selectedMonth"
        @update:modelValue="updateOperations" />
    </div>

    <!-- Tabella delle operazioni -->
    <div class="overflow-y-auto bg-white shadow-lg rounded-lg mt-4 h-[calc(100%-140px)]">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              {{ $t('description') }}
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider rounded-tr-lg">
              {{ $t('category') }}
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider rounded-tl-lg">
              {{ $t('amount') }}
            </th>
          </tr>
        </thead>
        <tbody v-if="operations && operations.length > 0" class="bg-white divide-y divide-gray-200">
          <tr v-for="operation in operations" :key="operation.id" class="hover:bg-gray-100 transition duration-200">
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              {{ operation.description }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 rounded-r-lg">
              {{ operation.type === 'INCOME' ? $t(operation.incomeCategory) : $t(operation.expenseCategory) }}
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 rounded-l-lg"
              :class="{ 'text-green-500': operation.type === 'INCOME', 'text-red-500': operation.type === 'EXPENSE' }">
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
  import { useGlobalStore } from '@/store/global';
  import DateSelector from '@/components/DateSelector.vue';

  export default {
    name: 'OperationsList',
    components: { DateSelector },
    setup() {
      const globalStore = useGlobalStore();
      const operationsStore = useOperationsStore();
      const operations = computed(() => operationsStore.operations);

      const selectedYear = ref(new Date().getFullYear());
      const selectedMonth = ref(new Date().getMonth() + 1);

      const years = globalStore.years;
      const months = globalStore.months;
      
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
