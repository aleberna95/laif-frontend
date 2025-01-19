<template>
  <div class="flex items-center justify-center">
    <div class="max-w-2xl w-full p-8 bg-white rounded-lg shadow-md">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-800">{{ $t('newRecurringExpense') }}</h1>
        <p class="text-gray-600 mt-2">{{ $t('newExpenseDescription') }}</p>
      </div>

      <form v-if="!loading" @submit.prevent="submitExpense" class="space-y-6 mt-8">
        <!-- Sezione ricorsività -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Tipo ricorsione -->
          <div>
            <BaseSelector :label="$t('recursiveType')" :options="recursiveTypes" v-model="localForm.recursiveType" />
          </div>

          <!-- Frequenza e count (es. ogni 2 settimane) -->
          <div class="flex items-center space-x-2">
            <label for="frequencyCount" class="block text-sm font-medium text-gray-700">
              {{ $t('every') }}
            </label>
            <!-- frequencyCount -->
            <input
              id="frequencyCount"
              type="number"
              min="1"
              class="w-16 px-2 py-1 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              v-model.number="localForm.frequencyCount" />
            <!-- Frequency -->
            <BaseSelector :label="null" :options="frequencies" v-model="localForm.frequency" hideLabel />
          </div>
        </div>

        <!-- Se UNTIL_DATE, mostro data finale + calcolo maxOccurrences in readonly -->
        <div v-if="localForm.recursiveType === 'UNTIL_DATE'">
          <label for="endDate" class="block text-sm font-medium text-gray-700 mt-4">
            {{ $t('endDate') }}
          </label>
          <!-- Inserisco due base selector, uno con data e uno anno -->
          <div class="grid grid-cols-2 gap-4">
            <BaseSelector :label="null" :options="months" v-model="localForm.endDate" hideLabel />
            <BaseSelector :label="null" :options="years" v-model="localForm.endDate" hideLabel />
          </div>

          <!-- Campo read-only per visualizzare maxOccurrences calcolato -->
          <div class="mt-2">
            <label for="maxOccurrencesCalc" class="block text-sm font-medium text-gray-700">
              {{ $t('calculatedOccurrences') }}
            </label>
            <input
              id="maxOccurrencesCalc"
              type="number"
              readonly
              :value="localForm.maxOccurrences || 0"
              class="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none text-gray-600" />
          </div>
        </div>

        <!-- Se OCCURRENCES_LIMIT, mostro maxOccurrences da compilare manualmente -->
        <div v-if="localForm.recursiveType === 'OCCURRENCES_LIMIT'">
          <label for="maxOccurrences" class="block text-sm font-medium text-gray-700 mt-4">
            {{ $t('maxOccurrences') }}
          </label>
          <input
            type="number"
            id="maxOccurrences"
            min="1"
            v-model.number="localForm.maxOccurrences"
            class="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none" />
        </div>

        <!-- Amount -->
        <div class="relative">
          <label for="amount" class="block text-sm font-medium text-gray-700">{{ $t('amount') }}</label>
          <input
            id="amount"
            v-model.number="localForm.amount"
            type="number"
            step="0.01"
            required
            class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none" />
          <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">{{ $t('description') }}</label>
          <textarea
            id="description"
            v-model="localForm.description"
            required
            class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm resize-none focus:outline-none"></textarea>
        </div>

        <!-- Category -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700">{{ $t('category') }}</label>
          <select
            id="category"
            v-model="localForm.category"
            required
            class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none">
            <option v-for="cat in expenseCategories" :key="cat.value" :value="cat.value">
              {{ $t(cat.label) }}
            </option>
          </select>
        </div>

        <!-- Submit Button -->
        <div class="mt-6">
          <button
            type="submit"
            class="w-full py-3 bg-blue-600 text-white font-medium text-lg rounded-md shadow-sm hover:bg-blue-700">
            {{ $t('saveExpense') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import BaseSelector from '@/components/BaseSelector.vue';
  import router from '@/router';
  import { useOperationsStore } from '@/store/operations';
  import { useGlobalStore } from '@/store/global';

  // Store / enumerations
  const operationStore = useOperationsStore();
  const globalStore = useGlobalStore();

  // Opzioni dal backend (categorie, frequenze, tipi ricorsione)
  const expenseCategories = computed(() => operationStore.expenseCategories);
  const frequencies = computed(() => operationStore.frequencies); // [DAILY, WEEKLY, MONTHLY, YEARLY]
  const recursiveTypes = computed(() => operationStore.recursiveTypes); // [INFINITE, UNTIL_DATE, OCCURRENCES_LIMIT]
  const months = computed(() => globalStore.months);
  const years = computed(() => globalStore.years);

  // Dati del form
  const localForm = ref({
    amount: null,
    description: '',
    category: '',

    recursiveType: '', // "INFINITE" | "UNTIL_DATE" | "OCCURRENCES_LIMIT"
    frequency: 'MONTHLY', // default
    frequencyCount: 1, // default 1

    // Questi due campi dipendono dal recursiveType
    maxOccurrences: null,
    endDate: null, // solo se UNTIL_DATE
  });

  // Caricamento iniziale (categorie, frequenze, ecc.)
  const loading = ref(true);
  const getRecurringExpenseData = async () => {
    loading.value = true;
    // ritorno una promessa per attendere il caricamento e quando finisce setto il booleano di caricamento a true
    return Promise.all([
      operationStore.getExpenseCategories(),
      operationStore.getRecursiveTypes(),
      operationStore.getFrequencies(),
    ]).then(() => {
      loading.value = false;
    });
    /* await operationStore.getExpenseCategories();
    await operationStore.getRecursiveTypes();
    await operationStore.getFrequencies(); */
  };

  onMounted(() => {
    getRecurringExpenseData();
  });

  // Watch su recursiveType per impostare comportamenti di default
  watch(
    () => localForm.value.recursiveType,
    (newVal) => {
      if (newVal === 'INFINITE') {
        localForm.value.maxOccurrences = 9999;
        localForm.value.endDate = null;
      } else if (newVal === 'OCCURRENCES_LIMIT') {
        localForm.value.maxOccurrences = 5; // un default a piacere
        localForm.value.endDate = null;
      } else if (newVal === 'UNTIL_DATE') {
        localForm.value.maxOccurrences = 0; // verrà calcolato
        // localForm.value.endDate = null; // l'utente dovrà sceglierla
      }
    },
  );

  // Per calcolare maxOccurrences quando (UNTIL_DATE) e l’utente cambia data, freq o freqCount
  watch(
    () => [localForm.value.endDate, localForm.value.frequency, localForm.value.frequencyCount],
    () => {
      if (localForm.value.recursiveType === 'UNTIL_DATE') {
        computeMaxOccurrences();
      }
    },
  );

  // Funzione di calcolo
  function computeMaxOccurrences() {
    const { endDate, frequency, frequencyCount } = localForm.value;
    if (!endDate) {
      localForm.value.maxOccurrences = 0;
      return;
    }

    // Calcolo naive di differenza in giorni tra "oggi" e endDate
    const start = new Date();
    const end = new Date(endDate);
    const diffInMs = end - start;

    if (diffInMs <= 0) {
      // La data finale è nel passato (o oggi) => 0
      localForm.value.maxOccurrences = 0;
      return;
    }

    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    let occ = 1; // di base, almeno 1 ricorrenza

    const fc = frequencyCount || 1;

    switch (frequency) {
      case 'DAILY':
        // Ogni fc giorni => (diffInDays / fc)
        occ = Math.floor(diffInDays / fc);
        break;
      case 'WEEKLY':
        // 7 giorni a settimana => (diffInDays / (7 * fc))
        occ = Math.floor(diffInDays / (7 * fc));
        break;
      case 'MONTHLY':
        // approx 30.4 giorni per mese => (diffInDays / (30.4 * fc))
        occ = Math.floor(diffInDays / (30.4 * fc));
        break;
      case 'YEARLY':
        // approx 365 giorni => (diffInDays / (365 * fc))
        occ = Math.floor(diffInDays / (365 * fc));
        break;
      default:
        occ = 1;
    }

    // Almeno 1 se il calcolo produce 0
    localForm.value.maxOccurrences = Math.max(occ, 1);
  }

  // Invio del form
  function submitExpense() {
    // Validazione base
    if (!localForm.value.amount || !localForm.value.description || !localForm.value.category) {
      console.error('Compila tutti i campi obbligatori (amount, description, category).');
      return;
    }

    if (localForm.value.recursiveType === 'OCCURRENCES_LIMIT' && !localForm.value.maxOccurrences) {
      console.error('Max Occurrences is required for OCCURRENCES_LIMIT!');
      return;
    }

    if (localForm.value.recursiveType === 'UNTIL_DATE' && !localForm.value.endDate) {
      console.error('End date is required for UNTIL_DATE type!');
      return;
    }

    // Esempio: passare i dati al tuo store / API
    operationStore
      .addRecurringOperation({
        amount: localForm.value.amount,
        description: localForm.value.description,
        category: localForm.value.category,
        frequency: localForm.value.frequency,
        frequencyCount: localForm.value.frequencyCount,
        recursiveType: localForm.value.recursiveType,
        maxOccurrences: localForm.value.maxOccurrences,
        type: 'EXPENSE',
      })
      .then(() => {
        console.log('Uscita salvata con successo!');
        router.push({ name: 'AddOperation' });
      })
      .catch((err) => console.error(err));
  }
</script>
