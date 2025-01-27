<template>
  <div class="min-h-full flex justify-center items-end">
    <!-- Contenitore globale con sfondo leggero -->
    <div class="bg-gray-50 min-w-full">
      <div class="max-w-4xl mx-auto p-5 h-full">
        <!-- Sezione Filtri (Anno / Mese) -->
        <div class="flex items-start mb-4">
          <div class="mr-4">
            <DateSelector label="year" :options="years" v-model="selectedYear" @update:modelValue="updateOperations" />
          </div>
          <div>
            <DateSelector
              label="month"
              :options="months"
              v-model="selectedMonth"
              @update:modelValue="updateOperations" />
          </div>
        </div>
        <BaseLoader v-if="loading" />
        <!-- Contenitore della tabella con scrolling verticale e orizzontale -->
        <div
          v-else
          class="bg-white shadow-md rounded-lg overflow-hidden overflow-x-auto overflow-y-auto max-h-[calc(100vh-200px)]">
          <table class="table-fixed text-left">
            <!-- Intestazione -->
            <thead class="bg-gray-100 sticky top-0 z-10">
              <tr>
                <!-- Colonna Descrizione -->
                <th
                  scope="col"
                  class="px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider w-2/5 sm:w-2/6 md:w-3/6">
                  {{ $t('description') }}
                </th>
                <!-- Colonna Categoria -->
                <th scope="col" class="px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider w-1/4">
                  {{ $t('category') }}
                </th>
                <!-- Colonna Importo -->
                <th scope="col" class="px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider w-1/4">
                  {{ $t('amount') }}
                </th>
              </tr>
            </thead>

            <!-- Corpo Tabella -->
            <tbody v-if="operations && operations.length > 0" class="divide-y divide-gray-200 text-sm">
              <tr v-for="operation in operations" :key="operation.id" class="hover:bg-gray-50 transition-colors">
                <!-- Descrizione -->
                <td class="px-4 py-3">
                  {{ operation.description }}
                </td>

                <!-- Categoria (incomeCategory o expenseCategory) -->
                <td class="px-4 py-3 text-gray-500">
                  {{ operation.type === 'INCOME' ? $t(operation.incomeCategory) : $t(operation.expenseCategory) }}
                </td>

                <!-- Importo (+/-) -->
                <td
                  class="px-4 py-3 font-medium flex justify-end items-center w-full"
                  :class="{
                    'text-green-600': operation.type === 'INCOME',
                    'text-red-500': operation.type === 'EXPENSE',
                  }">
                  <p>{{ operation.type === 'INCOME' ? '+' : '-' }}{{ operation.amount + '€' }}</p>
                  <button @click="confirmDelete(operation.id)" class="text-black flex items-end ml-2">
                    <span class="material-icons-outlined">delete</span>
                  </button>
                </td>
              </tr>
            </tbody>
            <!-- Nessun dato -->
            <tbody v-else-if="!loading && operations && operations.length === 0">
              <tr>
                <td class="px-4 py-3 text-center" colspan="4">
                  {{ $t('noData') }}
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr v-for="n in 3" :key="n" class="border-b last:border-0">
                <td class="px-4 py-3">
                  <div class="animate-pulse h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </td>
                <td class="px-4 py-3">
                  <div class="animate-pulse h-4 bg-gray-200 rounded w-2/4 mx-auto"></div>
                </td>
                <td class="px-4 py-3">
                  <div class="animate-pulse h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
                </td>
                <td class="px-4 py-3">
                  <div class="animate-pulse h-4 bg-gray-200 rounded w-1/6 mx-auto"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Popup conferma eliminazione -->
      <div v-if="showConfirm" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white p-6 rounded shadow-md">
          <p class="text-gray-800 mb-4">{{ $t('confirmDelete') }}</p>
          <div class="flex justify-end gap-4">
            <button @click="cancelDelete" class="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded">
              {{ $t('cancel') }}
            </button>
            <button @click="deleteOperation(deleteId)" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
              {{ $t('confirm') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { computed, ref, onMounted } from 'vue';
  import { useOperationsStore } from '@/store/operations';
  import { useGlobalStore } from '@/store/global';
  import DateSelector from '@/components/BaseSelector.vue';
  import BaseLoader from '@/components/BaseLoader.vue';

  export default {
    name: 'OperationsList',
    components: { DateSelector, BaseLoader },
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

      const loading = ref(true);

      const showConfirm = ref(false);
      const deleteId = ref(null);

      const fetchOperations = async () => {
        cursor.value = null;
        loading.value = true;
        try {
          const operationsData = await operationsStore
            .fetchOperations(selectedYear.value, selectedMonth.value, pageSize.value, cursor.value)
            .finally(() => {
              loading.value = false;
            });
          cursor.value = operationsData.nextCursor;
        } catch (error) {
          console.error('Errore durante il caricamento delle operazioni:', error);
        }
      };

      const updateOperations = () => {
        fetchOperations();
      };

      const confirmDelete = (id) => {
        deleteId.value = id;
        showConfirm.value = true;
      };

      const cancelDelete = () => {
        deleteId.value = null;
        showConfirm.value = false;
      };

      const deleteOperation = async (id) => {
        try {
          console.log('Cancellazione operazione con id:', id);

          if (!id) {
            return;
          }
          await operationsStore.deleteOperation(id);
          fetchOperations(); // Aggiorna la lista dopo la cancellazione
          cancelDelete();
        } catch (error) {
          console.error("Errore durante la cancellazione dell'operazione:", error);
        }
      };

      onMounted(fetchOperations);

      return {
        operations,
        selectedYear,
        selectedMonth,
        years,
        months,
        loading,
        updateOperations,
        confirmDelete,
        cancelDelete,
        deleteOperation,
        showConfirm,
        deleteId,
      };
    },
  };
</script>
