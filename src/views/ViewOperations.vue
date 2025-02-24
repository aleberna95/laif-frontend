<template>
  <div class="flex flex-col h-full min-w-full px-4">
    <!-- Sezione Filtri -->
    <div class="flex flex-wrap gap-4 mb-4 min-w-full">
      <!-- Filtro Anno -->
      <DateSelector label="year" :options="years" v-model="selectedYear" @update:modelValue="applyFilters" />
      <!-- Filtro Mese -->
      <DateSelector label="month" :options="months" v-model="selectedMonth" @update:modelValue="applyFilters" />
      <!-- Nuovo Filtro Operazioni -->
      <div class="flex flex-col">
        <label class="text-gray-600 text-xs uppercase mb-1">
          {{ $t('search') }}
        </label>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Cerca operazione..."
          class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
    </div>

    <!-- Loader se stiamo caricando -->
    <BaseLoader v-if="loading" />

    <!-- Tabella, se non stiamo caricando -->
    <div
      v-else
      class="flex-1 min-h-0 bg-white shadow-md rounded-lg overflow-x-hidden md:overflow-x-auto overflow-y-auto">
      <div class="flex flex-row justify-between px-4 py-2 text-xs text-gray-500">
        <div class="text-left">
          <p class="text-green-600 font-semibold">Entrate</p>
          <p>{{ totalIncome?.toFixed(2) }}</p>
        </div>
        <div class="text-right">
          <p class="text-red-600 font-semibold">Uscite</p>
          <p>{{ totalExpense?.toFixed(2) }}</p>
        </div>
      </div>
      <table class="table-fixed w-full text-left">
        <!-- Header della tabella -->
        <thead class="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th
              scope="col"
              class="px-2 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider w-12 text-center">
              {{ $t('day') }}
            </th>
            <th scope="col" class="px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
              {{ $t('description') }}
            </th>
            <th scope="col" class="px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
              {{ $t('category') }}
            </th>
            <th scope="col" class="px-4 py-3 text-xs font-medium text-right text-gray-600 uppercase tracking-wider">
              {{ $t('amount') }}
              <p class="text-xs text-gray-500">
                {{ currency }}
              </p>
            </th>
          </tr>
        </thead>

        <!-- Corpo della tabella -->
        <tbody v-if="filteredOperations && filteredOperations.length > 0" class="divide-y divide-gray-200 text-sm">
          <tr v-for="operation in filteredOperations" :key="operation.id" class="hover:bg-gray-50 transition-colors">
            <!-- Giorno -->
            <td class="px-2 py-3 text-center text-xs">
              <span class="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center">
                {{ operation.day }}
              </span>
            </td>
            <!-- Descrizione -->
            <td class="px-4 py-3 break-words whitespace-normal">
              {{ operation.description }}
            </td>
            <!-- Categoria -->
            <td class="px-4 py-3 text-gray-500 break-words whitespace-normal">
              {{ $t(operation.category) }}
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

        <!-- Messaggio di "Nessun dato" -->
        <tbody v-else-if="!loading && filteredOperations && filteredOperations.length === 0">
          <tr>
            <td class="px-4 py-3 text-center text-gray-500" colspan="4">
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
  import { computed, ref, onMounted, onUpdated } from 'vue';
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
      // Le operazioni vengono lette dallo store
      const operations = computed(() => operationsStore.operations);
      const userStore = useUserStore();

      const currency = computed(() => userStore.user?.currency);

      // Filtri anno/mese
      const selectedYear = ref(new Date().getFullYear());
      const selectedMonth = ref(new Date().getMonth() + 1);

      const years = globalStore.years;
      const months = globalStore.months;

      // Campo ricerca per filtro client-side
      const searchQuery = ref('');

      // Stato caricamento
      const loading = ref(true);

      // Popup conferma eliminazione
      const showConfirm = ref(false);
      const deleteId = ref(null);

      // Fetch delle operazioni (lato server, in base ad anno/mese)
      const fetchOperations = async () => {
        loading.value = true;
        try {
          await operationsStore.fetchOperations({
            year: selectedYear.value,
            month: selectedMonth.value,
          });
        } catch (error) {
          console.error('Errore durante il caricamento delle operazioni:', error);
        } finally {
          loading.value = false;
        }
      };

      // Filtro client-side sulle operazioni già disponibili
      const filteredOperations = computed(() => {
        const query = searchQuery.value.trim().toLowerCase();
        if (!query) return operations.value;
        return operations.value.filter((op) => {
          // se si tratta di una categoria devo tradurla e poi cercare
          if (op.category) {
            const category = t(op.category).toLowerCase();
            return (
              (op.description && op.description.toLowerCase().includes(query)) ||
              category.includes(query) ||
              (op.day && String(op.day).includes(query)) ||
              (op.amount && String(op.amount).includes(query))
            );
          } else
            return (
              (op.description && op.description.toLowerCase().includes(query)) ||
              (op.day && String(op.day).includes(query)) ||
              (op.amount && String(op.amount).includes(query))
            );
        });
      });

      // Calcolo dinamico di totalIncome e totalExpense dalle operazioni filtrate
      const totalIncome = computed(() => {
        return filteredOperations.value.filter((op) => op.type === 'INCOME').reduce((acc, op) => acc + op.amount, 0);
      });

      const totalExpense = computed(() => {
        return filteredOperations.value.filter((op) => op.type === 'EXPENSE').reduce((acc, op) => acc + op.amount, 0);
      });

      // Aggiorna i filtri (fetch lato server per anno/mese, mentre la ricerca è client-side)
      const applyFilters = () => {
        fetchOperations();
      };

      // Gestione della cancellazione
      const confirmDelete = (id) => {
        deleteId.value = id;
        showConfirm.value = true;
      };

      const cancelDelete = () => {
        deleteId.value = null;
        showConfirm.value = false;
      };

      const deleteOperation = async (id) => {
        if (!id) return;
        try {
          await operationsStore.deleteOperation(id);
          fetchOperations();
          cancelDelete();
        } catch (error) {
          console.error("Errore durante la cancellazione dell'operazione:", error);
        }
      };

      onMounted(() => {
        globalStore.setAppTitle(t('operationListTitle'));
        fetchOperations();
      });
      onUpdated(() => {
        globalStore.setAppTitle(t('operationListTitle'));
      });

      return {
        currency,
        filteredOperations,
        selectedYear,
        selectedMonth,
        years,
        months,
        searchQuery,
        loading,
        applyFilters,
        confirmDelete,
        cancelDelete,
        deleteOperation,
        showConfirm,
        deleteId,
        t,
        totalIncome,
        totalExpense,
      };
    },
  };
</script>
