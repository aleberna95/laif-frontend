<template>
  <div class="flex justify-center items-end overflow-hidden">
    <div>
      <BaseLoader v-if="loadingSettings" />
      <div v-else class="bg-gray-50 min-w-full">
        <div class="max-w-4xl mx-auto p-5 h-full">
          <!-- Sezione dei valori principali -->
          <div class="grid grid-cols-1 gap-6">
            <p>{{ $t('settingsPercent') }}</p>
            <!-- Casella Leisure Amount -->
            <div class="flex justify-between items-start bg-white shadow-md rounded-lg p-4">
              <div class="text-gray-600 font-semibold">{{ $t('leisureAmount') }}</div>
              <div class="flex items-start bg-gray-100 rounded px-3 py-1">
                <span class="text-gray-800 font-medium">{{ leisureAmountEdit }}€</span>
                <button
                  @click="openPopup('leisureAmount')"
                  class="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                  <span class="material-icons-outlined">edit</span>
                </button>
              </div>
            </div>

            <!-- Casella Save Percentage -->
            <div class="flex justify-between items-center bg-white shadow-md rounded-lg p-4">
              <div class="text-gray-600 font-semibold">{{ $t('savePercentage') }}</div>
              <div class="flex items-center bg-gray-100 rounded px-3 py-1">
                <span class="text-gray-800 font-medium">{{ savePercentageEdit }}%</span>
                <button
                  @click="openPopup('savePercentage')"
                  class="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                  <span class="material-icons-outlined">edit</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Casella Invest Percentage -->
          <div class="flex justify-between items-center bg-white shadow-md rounded-lg p-4">
            <div class="text-gray-600 font-semibold">{{ $t('investPercentage') }}</div>
            <div class="flex items-centercenter bg-gray-100 rounded px-3 py-1">
              <span class="text-gray-800 font-medium">{{ investPercentageEdit }}%</span>
              <button
                @click="openPopup('investPercentage')"
                class="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                <span class="material-icons-outlined">edit</span>
              </button>
            </div>
          </div>
          <!-- Popup Modifica Valore -->
          <div v-if="showPopup" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-white p-6 rounded-2xl shadow-lg">
              <p class="text-gray-800 mb-4 font-semibold">{{ $t('insertNewVal') }}</p>
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
        </div>
      </div>

      <BaseLoader v-if="loadingRecurringExpenses" />
      <!-- Contenitore della tabella con scrolling verticale e orizzontale -->
      <div class="pb-28" v-else>
        <p class="p-2 mt-6">{{ $t('settingsRecursiveList') }}</p>
        <div class="bg-white shadow-md rounded-lg overflow-hidden h-[200px] overflow-y-auto">
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
            <tbody v-if="recurringExpenses && recurringExpenses.length > 0" class="divide-y divide-gray-200 text-sm">
              <tr v-for="operation in recurringExpenses" :key="operation.id" class="hover:bg-gray-50 transition-colors">
                <!-- Descrizione -->
                <td class="px-4 py-3">
                  {{ operation.description }}
                </td>

                <!-- Categoria (incomeCategory o expenseCategory) -->
                <td class="px-4 py-3 text-gray-500">
                  {{ $t(operation.category) }}
                </td>

                <!-- Importo (+/-) -->
                <td class="px-4 py-3 font-medium flex justify-end items-center w-full">
                  <p>{{ operation.amount + '€' }}</p>
                  <button @click="confirmDelete(operation.id)" class="text-black flex items-end ml-2">
                    <span class="material-icons-outlined">delete</span>
                  </button>
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
            <button @click="deleteOperation()" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
              {{ $t('confirm') }}
            </button>
          </div>
        </div>
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
      const showPopup = ref(false);
      const popupKey = ref(null);
      const newValue = ref(null);

      const userStore = useUserStore();
      const operationsStore = useOperationsStore();
      /* 
      const leisureAmount = computed(() => userStore.leisureAmount);
      const investPercentage = computed(() => userStore.investPercentage);
      const savePercentage = computed(() => userStore.savePercentage); */
      const leisureAmountEdit = ref(0); // Variabile per il valore modificabile di leisureAmount
      const investPercentageEdit = ref(0); // Variabile per il valore modificabile di investPercentage
      const savePercentageEdit = ref(0); // Variabile per il valore modificabile di savePercentage

      const loadingSettings = ref(true);
      const fetchUserSettings = async () => {
        try {
          loadingSettings.value = true;
          await userStore.getUserSettings();
          leisureAmountEdit.value = userStore.leisureAmount; // Popola leisureAmountEdit
          investPercentageEdit.value = userStore.investPercentage * 100; // Popola investPercentageEdit
          savePercentageEdit.value = userStore.savePercentage * 100; // Popola savePercentageEdit
        } catch (error) {
          console.error('Errore durante il recupero dei settings:', error);
        } finally {
          loadingSettings.value = false;
        }
      };

      const loadingRecurringExpenses = ref(true);
      const recurringExpenses = computed(() => operationsStore.recurringExpenses);
      const fetchRecurringExpenses = async () => {
        try {
          loadingRecurringExpenses.value = true;
          await operationsStore.getRecurringExpenses();
        } catch (error) {
          console.error('Errore durante il recupero delle spese ricorrenti:', error);
        } finally {
          loadingRecurringExpenses.value = false;
        }
      };

      const deleteRecurringExpense = async (expenseId) => {
        try {
          await operationsStore.deleteRecurringExpense(expenseId);
          await fetchRecurringExpenses();
        } catch (error) {
          console.error("Errore durante l'eliminazione della spesa ricorrente:", error);
        }
      };

      const updateUserSettings = async () => {
        try {
          await userStore
            .updateSettings({
              leisureAmount: leisureAmountEdit.value, // Usa la variabile modificabile
              investPercentage: investPercentageEdit.value / 100, // Converte in decimale
              savePercentage: savePercentageEdit.value / 100, // Converte in decimale
            })
            .then(() => {
              fetchUserSettings();
            });
          alert('Impostazioni aggiornate con successo!');
        } catch (error) {
          console.error("Errore durante l'aggiornamento dei settings:", error);
        }
      };

      const openPopup = (key) => {
        popupKey.value = key;
        newValue.value =
          key === 'leisureAmount'
            ? leisureAmountEdit.value // Usa leisureAmountEdit
            : key === 'investPercentage'
            ? investPercentageEdit.value // Usa investPercentageEdit
            : savePercentageEdit.value; // Usa savePercentageEdit
        showPopup.value = true;
      };

      const closePopup = () => {
        showPopup.value = false;
        popupKey.value = null;
        newValue.value = null;
      };

      const confirmValue = () => {
        if (popupKey.value === 'investPercentage') {
          // Aggiorna investPercentageEdit
          investPercentageEdit.value = newValue.value;

          // Controlla se la somma supera 100
          if (investPercentageEdit.value + savePercentageEdit.value > 100) {
            savePercentageEdit.value = 100 - investPercentageEdit.value; // Riequilibrio
          }
        } else if (popupKey.value === 'savePercentage') {
          // Aggiorna savePercentageEdit
          savePercentageEdit.value = newValue.value;

          // Controlla se la somma supera 100
          if (investPercentageEdit.value + savePercentageEdit.value > 100) {
            investPercentageEdit.value = 100 - savePercentageEdit.value; // Riequilibrio
          }
        } else if (popupKey.value === 'leisureAmount') {
          leisureAmountEdit.value = newValue.value; // Aggiorna leisureAmountEdit
        }

        closePopup();
        updateUserSettings();
      };

      onMounted(() => {
        fetchUserSettings();
        fetchRecurringExpenses();
      });

      const deleteId = ref(null);
      const showConfirm = ref(false);

      const confirmDelete = (id) => {
        console.log('Conferma cancellazione operazione con id:', id);

        deleteId.value = id;
        showConfirm.value = true;
      };

      const cancelDelete = () => {
        deleteId.value = null;
        showConfirm.value = false;
      };

      const deleteOperation = async () => {
        const id = deleteId.value;
        try {
          console.log('Cancellazione operazione con id:', id);
          if (!id) {
            return;
          }
          await operationsStore.deleteRecurringExpense(id);
          fetchRecurringExpenses(); // Aggiorna la lista dopo la cancellazione
          cancelDelete();
        } catch (error) {
          console.error("Errore durante la cancellazione dell'operazione:", error);
        }
      };

      return {
        showConfirm,
        updateUserSettings,
        confirmDelete,
        cancelDelete,
        deleteOperation,
        leisureAmountEdit,
        investPercentageEdit,
        savePercentageEdit,
        recurringExpenses,
        showPopup,
        popupKey,
        newValue,
        loadingRecurringExpenses,
        loadingSettings,
        openPopup,
        closePopup,
        confirmValue,
        deleteRecurringExpense,
      };
    },
  };
</script>

<style scoped>
  .material-icons-outlined {
    font-size: 1.5rem;
  }
</style>
