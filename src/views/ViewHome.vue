<template>
  <div class="flex flex-col h-screen">
    <span>
      <!-- descrizione pagina -->
      <p class="font-semibold text-gray-800 p-4">{{ $t('homePageDescription') }}</p>
    </span>
    <!-- Contenuto scrollabile -->
    <main class="pt-8 flex-1 overflow-y-auto">
      <div class="container mx-auto p-4">
        <!-- Indicatori di performance -->

        <section class="mb-6">
          <!-- Filtro Mese e Anno -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <BaseSelector
              label="month"
              :options="months"
              v-model="selectedMonth"
              @update:modelValue="fetchDashboardData" />
            <BaseSelector
              label="year"
              :options="years"
              v-model="selectedYear"
              @update:modelValue="fetchDashboardData" />
          </div>

          <!-- loader -->
          <div v-if="dashboardLoading" class="flex justify-center items-center p-4">
            <BaseLoader />
          </div>
          <div v-else class="grid grid-cols-2 gap-4">
            <!-- Totale Entrate -->
            <div class="bg-green-100 p-4 rounded-xl shadow">
              <span>
                <p class="text-sm text-gray-600">{{ $t('totalIncome') }}</p>
                <p class="text-xs text-gray-500">{{ currency }}</p>
              </span>
              <span class="flex items-center">
                <p class="text-xl font-semibold">{{ totalIncome || 0 }}</p>
                <p
                  class="text-sm rounded-lg p-2"
                  :class="{
                    'text-green-600': incomeChange >= 0,
                    'text-red-600': incomeChange < 0,
                  }">
                  {{ incomeChange >= 0 ? '+' : '' }}{{ incomeChange }}%
                </p>
              </span>
            </div>
            <!-- Totale Spese -->
            <div class="bg-red-100 p-4 rounded-xl shadow">
              <span>
                <p class="text-sm text-gray-600">{{ $t('totalExpense') }}</p>
                <p class="text-xs text-gray-500">{{ currency }}</p>
              </span>
              <span class="flex items-center">
                <p class="text-xl font-semibold">{{ totalExpense || 0 }}</p>
                <p
                  class="text-sm rounded-lg p-2"
                  :class="{ 'text-red-600': expenseChange >= 0, ' text-green-600': expenseChange < 0 }">
                  {{ expenseChange >= 0 ? '+' : '' }}{{ expenseChange }}%
                </p>
              </span>
            </div>
          </div>
        </section>

        <!-- Filtri -->
        <section class="mb-6">
          <!-- Filtro Operazione e Categoria -->
          <div class="grid grid-cols-2 gap-4">
            <BaseSelector
              label="operationType"
              :options="operationTypes"
              v-model="selectedOperationType"
              @update:modelValue="onOperationTypeChange" />
            <BaseSelector v-if="showCategorySelect" label="category" :options="categories" v-model="selectedCategory" />
          </div>
        </section>

        <!-- Tabella delle Operazioni -->
        <section class="mb-6">
          <div v-if="operationLoading" class="flex justify-center items-center p-4">
            <BaseLoader />
          </div>
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
              <tbody v-else-if="!operationLoading && operations && operations.length === 0">
                <tr>
                  <td class="px-4 py-3 text-center text-gray-500" colspan="3">
                    {{ $t('noData') }}
                  </td>
                </tr>
              </tbody>

              <!-- Skeleton (opzionale) -->
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
        </section>
      </div>
    </main>
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
</template>

<script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { useDashboardStore } from '@/store/dashboard';
  import { useGlobalStore } from '@/store/global';
  import { useUserStore } from '@/store/user';
  import { useOperationsStore } from '@/store/operations';
  import BaseLoader from '@/components/BaseLoader.vue';
  import BaseSelector from '@/components/BaseSelector.vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  // --- Pinia Stores ---
  const dashboardStore = useDashboardStore();
  const globalStore = useGlobalStore();
  const userStore = useUserStore();
  const operationsStore = useOperationsStore();

  // --- Filtri ---
  // Filtro Mese e Anno (presi dal global store)
  const selectedMonth = ref(globalStore.currentMonth || new Date().getMonth());
  const selectedYear = ref(globalStore.currentYear || new Date().getFullYear());
  const months = computed(() => globalStore.months);
  const years = computed(() => globalStore.years);

  // Filtro per Tipo Operazione e Categoria
  const selectedOperationType = ref(null);
  const selectedCategory = ref(null);
  const operationTypes = ref([
    { label: 'income', value: 'INCOME' },
    { label: 'expense', value: 'EXPENSE' },
  ]);
  const showCategorySelect = computed(() => selectedOperationType.value !== null);

  // --- Dati di Dashboard ---
  //currency è la valuta dell'utente
  const currency = computed(() => userStore.user?.currency);
  // Indicatori di performance e lista operazioni (gestiti dallo store)
  const totalIncome = computed(() => dashboardStore.totalIncome);
  const totalExpense = computed(() => dashboardStore.totalExpense);
  const incomeChange = computed(() => dashboardStore.incomeChange);
  const expenseChange = computed(() => dashboardStore.expenseChange);
  const operations = computed(() => dashboardStore.operations);
  const categories = computed(() => dashboardStore.categories);

  const dashboardLoading = ref(false);

  // --- Funzioni di API ---
  // Funzione per ottenere i dati della dashboard in base ai filtri
  const fetchDashboardData = async () => {
    dashboardLoading.value = true;
    const filters = {
      month: selectedMonth.value,
      year: selectedYear.value,
    };

    await dashboardStore.fetchDashboardData(filters);
    dashboardLoading.value = false;
  };

  const operationLoading = ref(false);
  const fetchOperations = async () => {
    operationLoading.value = true;
    const filters = {
      month: selectedMonth.value,
      year: selectedYear.value,
      type: selectedOperationType.value,
      category: selectedCategory.value,
    };
    await dashboardStore.fetchOperations(filters).then(() => {
      operationLoading.value = false;
    });
  };

  // Funzione per ottenere le categorie in base al tipo di operazione selezionato
  const fetchCategories = async (type) => {
    try {
      dashboardStore.fetchCategories(type).then(() => {});
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  // Gestione del cambio di tipo operazione: resettare la categoria e caricare le categorie corrette
  const onOperationTypeChange = async (newValue) => {
    selectedOperationType.value = newValue;
    selectedCategory.value = null;
    if (newValue) {
      await fetchCategories(newValue);
    } else {
      categories.value = [];
    }
  };

  // Watcher per aggiornare i dati quando cambiano alcuni filtri
  watch([selectedMonth, selectedYear], () => {
    fetchDashboardData();
  });
  watch([selectedCategory], () => {
    fetchOperations();
  });

  // Carica i dati iniziali al montaggio del componente
  onMounted(() => {
    globalStore.setAppTitle(t('homePageTitle'));
    fetchDashboardData();
  });

  const deleteId = ref(null);
  const showConfirm = ref(false);
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
</script>

<style scoped>
  /* Aggiungi eventuali stili personalizzati se necessari */
</style>
