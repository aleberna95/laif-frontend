<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="max-w-2xl w-full bg-white rounded-lg shadow-md px-4">
      <!-- Header -->
      <div class="text-center p-8">
        <BaseBackButton />
        <h1 class="text-4xl font-bold text-gray-800">{{ $t('newRecurringExpense') }}</h1>
        <p class="text-gray-500 mt-2">{{ $t('newExpenseDescription') }}</p>
        <!-- Campo read-only -->
        <div>
          <div class="relative mt-1 w-full flex justify-end">
            <input
              id="maxOccurrencesCalc"
              type="number"
              readonly
              :value="localForm.maxOccurrences || 0"
              class="cursor-default w-20 text-center bg-gray-100 border border-gray-300 rounded-full text-sm text-gray-700 px-2 py-1 shadow focus:outline-none" />
          </div>
          <div class="flex justify-end mt-1">
            <label for="maxOccurrencesCalc" class="text-sm font-medium text-gray-700">
              {{ $t('calculatedOccurrences') }}
            </label>
          </div>
        </div>
      </div>

      <!-- Contenitore scrollabile -->
      <div class="overflow-y-auto max-h-[70vh] px-8 mb-12">
        <!-- Loading state -->
        <div v-if="loading" class="flex flex-col items-center justify-center h-60">
          <svg
            class="animate-spin h-12 w-12 text-gray-400 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 008 8V4a8 8 0 00-8 8z"></path>
          </svg>
          <p class="text-gray-500 text-lg">{{ $t('loading') }}...</p>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="submitExpense" class="space-y-6 mb-16">
          <!-- Sezione ricorsività -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BaseSelector :label="$t('recursiveType')" :options="recursiveTypes" v-model="localForm.recursiveType" />
            <div class="flex items-center gap-2">
              <div>
                <label for="frequencyCount" class="text-sm font-bold text-gray-700">{{ $t('every') }}</label>
                <input
                  id="frequencyCount"
                  type="number"
                  min="1"
                  class="w-16 px-2 py-1 bg-gray-50 border border-gray-300 rounded shadow focus:outline-none"
                  v-model.number="localForm.frequencyCount" />
              </div>
              <BaseSelector :label="$t('frequencies')" :options="frequencies" v-model="localForm.frequency" hideLabel />
            </div>
          </div>

          <!-- Se UNTIL_DATE -->
          <div v-if="localForm.recursiveType === 'UNTIL_DATE'">
            <label for="endDate" class="text-sm font-medium text-gray-700">{{ $t('endDate') }}</label>
            <div class="grid grid-cols-2 gap-4 mt-2">
              <BaseSelector :label="null" :options="months" v-model="localForm.endDate.month" hideLabel />
              <BaseSelector :label="null" :options="years" v-model="localForm.endDate.year" hideLabel />
            </div>
          </div>

          <!-- Se OCCURRENCES_LIMIT -->
          <div v-if="localForm.recursiveType === 'OCCURRENCES_LIMIT'">
            <label for="maxOccurrences" class="text-sm font-medium text-gray-700">{{ $t('maxOccurrences') }}</label>
            <input
              id="maxOccurrences"
              type="number"
              min="1"
              v-model.number="localForm.maxOccurrences"
              class="mt-2 w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded shadow focus:outline-none" />
          </div>

          <!-- Amount e Category -->
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label for="amount" class="text-sm font-medium text-gray-700">{{ $t('amount') }}</label>
              <div class="relative mt-1">
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  v-model.number="localForm.amount"
                  class="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded shadow focus:outline-none" />
                <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
              </div>
            </div>
            <div class="col-span-2">
              <label for="category" class="text-sm font-medium text-gray-700">{{ $t('category') }}</label>
              <select
                id="category"
                v-model="localForm.category"
                class="mt-1 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded shadow focus:outline-none">
                <option v-for="cat in expenseCategories" :key="cat.value" :value="cat.value">
                  {{ $t(cat.label) }}
                </option>
              </select>
            </div>
          </div>

          <!-- Descrizione -->
          <div>
            <label for="description" class="text-sm font-medium text-gray-700">{{ $t('description') }}</label>
            <textarea
              id="description"
              v-model="localForm.description"
              class="mt-1 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded shadow resize-none focus:outline-none"></textarea>
          </div>

          <!-- Bottone submit -->
          <button
            type="submit"
            class="w-full py-3 bg-blue-600 text-white text-lg font-medium rounded shadow hover:bg-blue-700 transition">
            {{ $t('saveExpense') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import BaseSelector from '@/components/BaseSelector.vue';
  import router from '@/router';
  import { useOperationsStore } from '@/store/operations';
  import { useGlobalStore } from '@/store/global';
  import BaseBackButton from '@/components/BaseBackButton.vue';

  // Store / enumerations
  const operationStore = useOperationsStore();
  const globalStore = useGlobalStore();

  const expenseCategories = computed(() => operationStore.expenseCategories);
  const frequencies = computed(() => operationStore.frequencies);
  const recursiveTypes = computed(() => operationStore.recursiveTypes);
  const months = computed(() => globalStore.months);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => ({ label: currentYear + i, value: currentYear + i }));

  // Dati del form
  const localForm = ref({
    amount: null,
    description: '',
    category: '',
    recursiveType: '',
    frequency: 'MONTHLY',
    frequencyCount: 1,
    maxOccurrences: null,
    endDate: {
      month: new Date().getMonth() + 2,
      year: new Date().getFullYear(),
    },
  });

  const loading = ref(true);
  const getRecurringExpenseData = async () => {
    loading.value = true;
    await Promise.all([
      operationStore.getExpenseCategories(),
      operationStore.getRecursiveTypes(),
      operationStore.getFrequencies(),
    ]);
    loading.value = false;
  };

  onMounted(() => {
    getRecurringExpenseData();
  });

  // Watch recursiveType per impostare comportamenti di default
  watch(
    () => localForm.value.recursiveType,
    (newVal) => {
      if (newVal === 'INFINITE') {
        localForm.value.maxOccurrences = 9999;
        localForm.value.endDate = null;
      } else if (newVal === 'OCCURRENCES_LIMIT') {
        localForm.value.maxOccurrences = 5;
        localForm.value.endDate = null;
      } else if (newVal === 'UNTIL_DATE') {
        localForm.value.maxOccurrences = 0;
      }
    },
  );

  // Watch per calcolare maxOccurrences e impostare lastOccurenceDate
  watch(
    () => [localForm.value.endDate, localForm.value.frequency, localForm.value.frequencyCount],
    () => {
      if (localForm.value.recursiveType === 'UNTIL_DATE') {
        computeMaxOccurrences();
      }
    },
  );

  // Funzione per calcolare maxOccurrences
function computeMaxOccurrences() {
    console.log('Computing max occurrences...');
    
    const { endDate, frequency, frequencyCount } = localForm.value;
    if (!endDate || !endDate.month || !endDate.year) {
      localForm.value.maxOccurrences = 0;
      return;
    }

    const start = new Date();
    const end = new Date(endDate.year, endDate.month - 1, 0, 23, 59, 59); // Ultimo giorno del mese
    const diffInMs = end - start;

    if (diffInMs <= 0) {
      localForm.value.maxOccurrences = 0;
      return;
    }

    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    let occ = 1;
    const fc = frequencyCount || 1;

    switch (frequency) {
      case 'DAILY':
        occ = Math.floor(diffInDays / fc);
        break;
      case 'WEEKLY':
        occ = Math.floor(diffInDays / (7 * fc));
        break;
      case 'MONTHLY':
        occ = Math.floor(diffInDays / (30.4 * fc));
        break;
      case 'YEARLY':
        occ = Math.floor(diffInDays / (365 * fc));
        break;
      default:
        occ = 1;
    }

    localForm.value.maxOccurrences = Math.max(occ, 1);
  }

  // Invio del form
  function submitExpense() {
    if (!localForm.value.amount || !localForm.value.description || !localForm.value.category) {
      console.error('Compila tutti i campi obbligatori (amount, description, category).');
      return;
    }

    if (localForm.value.recursiveType === 'OCCURRENCES_LIMIT' && !localForm.value.maxOccurrences) {
      console.error('Max Occurrences is required for OCCURRENCES_LIMIT!');
      return;
    }

    if (
      localForm.value.recursiveType === 'UNTIL_DATE' &&
      (!localForm.value.endDate || !localForm.value.endDate.month || !localForm.value.endDate.year)
    ) {
      console.error('End date is required for UNTIL_DATE type!');
      return;
    }

    const lastOccurrenceDate =
      localForm.value.recursiveType === 'UNTIL_DATE'
        ? new Date(localForm.value.endDate.year, localForm.value.endDate.month - 1, 0, 23, 59, 59)
        : null;

    operationStore
      .addRecurringOperation({
        amount: localForm.value.amount,
        description: localForm.value.description,
        category: localForm.value.category,
        frequency: localForm.value.frequency,
        frequencyCount: localForm.value.frequencyCount,
        recursiveType: localForm.value.recursiveType,
        maxOccurrences: localForm.value.maxOccurrences,
        lastOccurenceDate: lastOccurrenceDate ? lastOccurrenceDate.toISOString() : null,
        type: 'EXPENSE',
      })
      .then(() => {
        console.log('Uscita salvata con successo!');
        router.push({ name: 'AddOperation' });
      })
      .catch((err) => console.error(err));
  }
</script>
