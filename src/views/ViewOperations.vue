<template>
  <div class="flex flex-col h-full w-screen px-4">
    <!-- Titolo pagina (opzionale) -->
    <h2 class="text-xl font-semibold mb-4">
      {{ $t('operations') }}
    </h2>

    <!-- Sezione Filtri (anno/mese) -->
    <div class="flex flex-wrap gap-4 mb-4 min-w-full">
      <DateSelector label="year" :options="years" v-model="selectedYear" @update:modelValue="updateOperations" />
      <DateSelector label="month" :options="months" v-model="selectedMonth" @update:modelValue="updateOperations" />
    </div>

    <!-- Loader se stiamo caricando -->
    <BaseLoader v-if="loading" />

    <!-- Tabella, se non stiamo caricando -->
    <div
      v-else
      class="flex-1 min-h-0 bg-white shadow-md rounded-lg overflow-x-hidden md:overflow-x-auto overflow-y-auto">
      <table class="table-fixed w-full text-left">
        <!-- Intestazione (thead) -->
        <thead class="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th
              scope="col"
              class="px-2 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider w-2/4 break-words">
              {{ $t('description') }}
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider w-2/4 break-words">
              {{ $t('category') }}
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider w-2/4 break-words">
              {{ $t('amount') }}
              <p class="text-xs text-gray-500">
                {{ currency }}
              </p>
            </th>
          </tr>
        </thead>

        <!-- Corpo Tabella (tbody) -->
        <tbody v-if="operations && operations.length > 0" class="divide-y divide-gray-200 text-sm">
          <tr v-for="operation in operations" :key="operation.id" class="hover:bg-gray-50 transition-colors">
            <!-- Descrizione -->
            <td class="px-4 py-3 break-words whitespace-normal">
              {{ operation.description }}
            </td>

            <!-- Categoria -->
            <td class="px-4 py-3 text-gray-500 break-words whitespace-normal">
              {{ operation.type === 'INCOME' ? $t(operation.incomeCategory) : $t(operation.expenseCategory) }}
            </td>

            <!-- Importo -->
            <td
              class="px-4 py-3 font-medium text-right break-words whitespace-normal"
              :class="{
                'text-green-600': operation.type === 'INCOME',
                'text-red-500': operation.type === 'EXPENSE',
              }">
              <div class="flex justify-end items-center">
                <p>{{ operation.type === 'INCOME' ? '+' : '-' }}{{ operation.amount }}</p>
                <button @click="confirmDelete(operation.id)" class="text-gray-400 hover:text-black ml-2">
                  <span class="material-icons-outlined text-base">delete</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>

        <!-- Nessun dato -->
        <tbody v-else-if="!loading && operations && operations.length === 0">
          <tr>
            <td class="px-4 py-3 text-center text-gray-500" colspan="3">
              {{ $t('noData') }}
            </td>
          </tr>
        </tbody>

        <!-- Skeleton se serve (opzionale) -->
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
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Popup conferma eliminazione -->
    <div v-if="showConfirm" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded shadow-md max-w-sm w-full mx-2">
        <p class="text-gray-800 mb-6">
          {{ $t('confirmDelete') }}
        </p>
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
</template>

<script>
  import { computed, ref, onMounted } from 'vue';
  import { useOperationsStore } from '@/store/operations';
  import { useGlobalStore } from '@/store/global';
  import DateSelector from '@/components/BaseSelector.vue';
  import BaseLoader from '@/components/BaseLoader.vue';
  import { useUserStore } from '@/store/user';
  import { useI18n } from 'vue-i18n';

  export default {
    name: 'OperationsList',
    components: { DateSelector, BaseLoader },
    setup() {
      const { t } = useI18n();

      const globalStore = useGlobalStore();
      const operationsStore = useOperationsStore();
      const operations = computed(() => operationsStore.operations);
      const userStore = useUserStore();

      const currency = computed(() => userStore.user?.currency);

      // Filtri anno/mese
      const selectedYear = ref(new Date().getFullYear());
      const selectedMonth = ref(new Date().getMonth() + 1);

      const years = globalStore.years;
      const months = globalStore.months;

      // Paginazione
      const pageSize = ref();
      const cursor = ref(null);

      // Stato caricamento
      const loading = ref(true);

      // Popup conferma
      const showConfirm = ref(false);
      const deleteId = ref(null);

      // Funzione fetch
      const fetchOperations = async () => {
        cursor.value = null;
        loading.value = true;
        try {
          const operationsData = await operationsStore.fetchOperations(
            selectedYear.value,
            selectedMonth.value,
            pageSize.value,
            cursor.value,
          );
          cursor.value = operationsData.nextCursor;
        } catch (error) {
          console.error('Errore durante il caricamento delle operazioni:', error);
        } finally {
          loading.value = false;
        }
      };

      // Aggiorna le operazioni al cambio di anno/mese
      const updateOperations = () => {
        fetchOperations();
      };

      // Conferma e cancellazione operazione
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
          if (!id) return;
          await operationsStore.deleteOperation(id);
          fetchOperations(); // Ricarica la lista dopo la cancellazione
          cancelDelete();
        } catch (error) {
          console.error("Errore durante la cancellazione dell'operazione:", error);
        }
      };

      onMounted(() => {
        globalStore.setAppTitle(t('operationListTitle'));
        fetchOperations();
      });

      return {
        currency,
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
