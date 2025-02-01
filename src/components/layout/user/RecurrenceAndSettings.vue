<template>
  <!-- Contenitore principale a colonna, in cui occuperemo l'intera altezza a disposizione -->
  <div class="flex flex-col h-full w-full">
    <!-- Sezione “Settings” (parte alta) -->
    <div class="p-4">
      <BaseLoader v-if="loadingSettings" />

      <!-- Box settings utente -->
      <div v-else class="bg-white shadow-md rounded-lg p-4">
        <p class="text-gray-700 mb-4 font-semibold">
          {{ $t('settingsPercent') }}
        </p>

        <!-- Leisure Amount -->
        <div class="flex justify-between items-start bg-gray-50 rounded-md p-3 mb-3">
          <div>
            <div class="text-gray-600 font-semibold">
              {{ $t('leisureAmount') }}
            </div>

            <p class="text-xs text-gray-400">
              {{ currency }}
            </p>
          </div>
          <div class="flex items-start bg-gray-200 rounded px-3 py-1">
            <span class="text-gray-800 font-medium">
              {{ leisureAmountEdit }}
            </span>
            <button @click="openPopup('leisureAmount')" class="ml-2 text-gray-500 hover:text-gray-700">
              <span class="material-icons-outlined">edit</span>
            </button>
          </div>
        </div>

        <!-- Save Percentage -->
        <div class="flex justify-between items-start bg-gray-50 rounded-md p-3 mb-3">
          <div class="text-gray-600 font-semibold">
            {{ $t('savePercentage') }}
          </div>
          <div class="flex items-center bg-gray-200 rounded px-3 py-1">
            <span class="text-gray-800 font-medium">{{ savePercentageEdit }}%</span>
            <button @click="openPopup('savePercentage')" class="ml-2 text-gray-500 hover:text-gray-700">
              <span class="material-icons-outlined">edit</span>
            </button>
          </div>
        </div>

        <!-- Invest Percentage -->
        <div class="flex justify-between items-start bg-gray-50 rounded-md p-3">
          <div class="text-gray-600 font-semibold">
            {{ $t('investPercentage') }}
          </div>
          <div class="flex items-center bg-gray-200 rounded px-3 py-1">
            <span class="text-gray-800 font-medium">{{ investPercentageEdit }}%</span>
            <button @click="openPopup('investPercentage')" class="ml-2 text-gray-500 hover:text-gray-700">
              <span class="material-icons-outlined">edit</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sezione “Lista ricorrenti” (parte bassa) -->
    <!-- flex-1 min-h-0 fa sì che questo blocco si espanda e abbia scroll interno -->
    <BaseLoader v-if="loadingRecurringExpenses" />

    <!-- Contenitore tabella che scorre solo lei -->
    <div
      v-else
      class="flex-1 min-h-0 bg-white shadow-md rounded-lg overflow-x-hidden md:overflow-x-auto overflow-y-auto">
      <!-- Titolo tabella -->

      <table class="table-fixed w-full text-left">
        <thead class="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th class="px-2 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider w-2/4">
              {{ $t('description') }}
            </th>
            <th class="px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider w-3/4 text-center">
              {{ $t('nextDebit') }}
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider w-2/4 break-words text-right">
              {{ $t('amount') }}
              <p class="text-xs text-gray-500">
                {{ currency }}
              </p>
            </th>
          </tr>
        </thead>

        <tbody v-if="recurringExpenses && recurringExpenses.length > 0" class="divide-y divide-gray-200 text-sm">
          <tr v-for="operation in recurringExpenses" :key="operation.id" class="hover:bg-gray-50 transition-colors">
            <!-- Descrizione -->
            <td class="px-4 py-3">
              <p class="text-gray-400 text-xs">
                {{ $t(operation.category) }}
              </p>
              {{ operation.description }}
            </td>

            <!-- Prossima Scadenza + Tipo -->
            <td class="px-4 py-3">
              <span class="flex items-center justify-center gap-1">
                <p>{{ formatDate(operation.nextDueDate) }}</p>
              </span>
            </td>

            <!-- Importo -->
            <td class="px-4 py-3 font-medium">
              <div class="min-h-full flex justify-end items-center">
                <p>{{ operation.amount }}</p>
                <button @click="confirmDelete(operation.id)" class="text-gray-400 hover:text-black ml-2">
                  <span class="material-icons-outlined">delete</span>
                </button>
              </div>
              <span class="text-xs text-gray-400 flex items-center justify-end gap-1">
                <p>
                  {{ $t('every') }}
                </p>
                <p>
                  {{ $t(operation.frequency) }}
                </p>
              </span>
            </td>
          </tr>
        </tbody>

        <!-- Nessun dato -->
        <tbody v-else-if="!loadingRecurringExpenses && recurringExpenses && recurringExpenses.length === 0">
          <tr>
            <td class="px-4 py-3 text-center" colspan="4">
              {{ $t('noData') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Popup edit -->
  <div v-if="showPopup" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full mx-2">
      <p class="text-gray-800 mb-4 font-semibold">
        {{ $t('insertNewVal') }}
      </p>
      <input
        v-model="newValue"
        type="number"
        :min="popupKey === 'leisureAmount' ? null : 0"
        :max="popupKey === 'leisureAmount' ? null : 100"
        class="border border-gray-300 rounded w-full p-3 mb-4 focus:outline-none focus:ring" />
      <div class="flex justify-end gap-4">
        <button @click="closePopup" class="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-5 rounded-lg">
          {{ $t('cancel') }}
        </button>
        <button @click="confirmValue" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-5 rounded-lg">
          {{ $t('confirm') }}
        </button>
      </div>
    </div>
  </div>

  <!-- Popup conferma eliminazione -->
  <div v-if="showConfirm" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white p-6 rounded shadow-md max-w-sm w-full mx-2">
      <p class="text-gray-800 mb-4">
        {{ $t('confirmDelete') }}
      </p>
      <div class="flex justify-end gap-4">
        <button @click="cancelDelete" class="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded">
          {{ $t('cancel') }}
        </button>
        <button @click="deleteOperation()" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
          {{ $t('confirm') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, onMounted, computed } from 'vue';
  import { useOperationsStore } from '@/store/operations';
  import { useUserStore } from '@/store/user';
  import BaseLoader from '@/components/BaseLoader.vue';

  export default {
    name: 'RecurrenceAndSettings',
    components: {
      BaseLoader,
    },
    setup() {
      const userStore = useUserStore();
      const operationsStore = useOperationsStore();

      const currency = computed(() => userStore.user?.currency);

      // Variabili per la UI
      const showPopup = ref(false);
      const popupKey = ref(null);
      const newValue = ref(null);

      // Valori per i Settings
      const leisureAmountEdit = ref(0);
      const investPercentageEdit = ref(0);
      const savePercentageEdit = ref(0);

      // Loading states
      const loadingSettings = ref(true);
      const loadingRecurringExpenses = ref(true);

      // Spese ricorrenti
      const recurringExpenses = computed(() => operationsStore.recurringExpenses);

      // Fetch impostazioni utente
      const fetchUserSettings = async () => {
        try {
          loadingSettings.value = true;
          await userStore.getUserSettings();
          leisureAmountEdit.value = userStore.leisureAmount;
          investPercentageEdit.value = userStore.investPercentage * 100;
          savePercentageEdit.value = userStore.savePercentage * 100;
        } catch (error) {
          console.error('Errore durante il recupero dei settings:', error);
        } finally {
          loadingSettings.value = false;
        }
      };

      // Fetch spese ricorrenti
      const fetchRecurringExpenses = async () => {
        try {
          loadingRecurringExpenses.value = true;
          await operationsStore.getRecurringExpenses();
        } catch (error) {
          console.error('Errore nel recupero spese ricorrenti:', error);
        } finally {
          loadingRecurringExpenses.value = false;
        }
      };

      // Apertura popup edit
      const openPopup = (key) => {
        popupKey.value = key;
        newValue.value =
          key === 'leisureAmount'
            ? leisureAmountEdit.value
            : key === 'investPercentage'
            ? investPercentageEdit.value
            : savePercentageEdit.value;
        showPopup.value = true;
      };
      const closePopup = () => {
        showPopup.value = false;
        popupKey.value = null;
        newValue.value = null;
      };

      // Conferma valore editato
      const confirmValue = () => {
        if (popupKey.value === 'leisureAmount') {
          leisureAmountEdit.value = newValue.value;
        } else if (popupKey.value === 'investPercentage') {
          investPercentageEdit.value = newValue.value;
          if (investPercentageEdit.value + savePercentageEdit.value > 100) {
            savePercentageEdit.value = 100 - investPercentageEdit.value;
          }
        } else if (popupKey.value === 'savePercentage') {
          savePercentageEdit.value = newValue.value;
          if (investPercentageEdit.value + savePercentageEdit.value > 100) {
            investPercentageEdit.value = 100 - savePercentageEdit.value;
          }
        }
        closePopup();
        updateUserSettings();
      };

      // Update settings nel backend
      const updateUserSettings = async () => {
        try {
          await userStore.updateSettings({
            leisureAmount: leisureAmountEdit.value,
            investPercentage: investPercentageEdit.value / 100,
            savePercentage: savePercentageEdit.value / 100,
          });
          fetchUserSettings();
          alert('Impostazioni aggiornate con successo!');
        } catch (error) {
          console.error("Errore durante l'aggiornamento dei settings:", error);
        }
      };

      // Eliminazione spesa ricorrente
      const deleteRecurringExpense = async (expenseId) => {
        try {
          await operationsStore.deleteRecurringExpense(expenseId);
          await fetchRecurringExpenses();
        } catch (error) {
          console.error('Errore durante l’eliminazione:', error);
        }
      };

      // Popup conferma eliminazione
      const showConfirm = ref(false);
      const deleteId = ref(null);

      const confirmDelete = (id) => {
        deleteId.value = id;
        showConfirm.value = true;
      };
      const cancelDelete = () => {
        deleteId.value = null;
        showConfirm.value = false;
      };
      const deleteOperation = async () => {
        if (!deleteId.value) return;
        try {
          await operationsStore.deleteRecurringExpense(deleteId.value);
          fetchRecurringExpenses();
          cancelDelete();
        } catch (error) {
          console.error('Errore durante la cancellazione:', error);
        }
      };

      const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('it-IT', options);
      };

      // Avvio
      onMounted(() => {
        fetchUserSettings();
        fetchRecurringExpenses();
      });

      return {
        formatDate,
        // Vari di setup
        showPopup,
        popupKey,
        newValue,
        leisureAmountEdit,
        investPercentageEdit,
        savePercentageEdit,

        // Loading
        loadingSettings,
        loadingRecurringExpenses,

        // Spese ricorrenti
        recurringExpenses,

        // Metodi
        openPopup,
        closePopup,
        confirmValue,
        updateUserSettings,
        deleteRecurringExpense,

        // Conferma eliminazione
        showConfirm,
        deleteId,
        confirmDelete,
        cancelDelete,
        deleteOperation,
        currency,
      };
    },
  };
</script>

<style scoped>
  .material-icons-outlined {
    font-size: 1.5rem;
  }
</style>
