<template>
  <div class="flex items-end justify-center w-full min-h-full bg-gray-50">
    <div class="max-w-2xl w-full bg-white rounded-lg shadow-md px-4">
      <!-- Header -->
      <div class="text-center p-4 w-full">
        <BaseBackButton />
        <p class="text-gray-500 mt-2">{{ $t('newExpenseDescription') }}</p>
      </div>

      <!-- Contenitore scrollabile -->
      <div class="overflow-y-auto max-h-[70vh] px-6 mb-12">
        <BaseLoader v-if="loading" />
        <!-- Form -->
        <form v-else @submit.prevent="submitExpense" class="space-y-6 mb-16">
          <!-- Sezione ricorsività -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BaseSelector label="recursiveType" :options="recursiveTypes" v-model="localForm.recursiveType" />

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
            <div class="flex items-center gap-2">
              <div class="mb-1">
                <label for="frequencyCount" class="text-sm font-bold text-gray-700">{{ $t('every') }}</label>
                <input
                  id="frequencyCount"
                  type="number"
                  min="1"
                  class="w-16 mt-2 px-2 py-1 bg-gray-50 border border-gray-300 rounded shadow focus:outline-none"
                  v-model.number="localForm.frequencyCount" />
              </div>
              <BaseSelector label="frequencies" :options="frequencies" v-model="localForm.frequency" hideLabel />
            </div>
          </div>
          <div>
            <label for="endDate" class="text-sm font-medium text-gray-700">{{ $t('firstOccurrence') }}</label>
            <div class="grid grid-cols-5 gap-2 mt-2">
              <BaseSelector class="" :options="days" v-model="localForm.firstOccurrence.day" hideLabel />
              <BaseSelector class="col-span-2" :options="months" v-model="localForm.firstOccurrence.month" hideLabel />
              <BaseSelector class="col-span-2" :options="years" v-model="localForm.firstOccurrence.year" hideLabel />
            </div>
          </div>

          <!-- Amount e Category -->
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label for="amount" class="text-sm font-medium text-gray-700">{{ $t('amount') }}</label>
              <span class="text-gray-500 ml-1">{{ currency }}</span>
              <div class="relative mt-1">
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  v-model.number="localForm.amount"
                  class="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded shadow focus:outline-none" />
              </div>
            </div>
            <div class="col-span-2">
              <label for="category" class="text-sm font-medium text-gray-700">{{ $t('category') }}</label>
              <select
                id="category"
                v-model="localForm.category"
                class="mt-1 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded shadow focus:outline-none">
                <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                  {{ cat.label }}
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
  import BaseLoader from '@/components/BaseLoader.vue';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '@/store/user';

  const userStore = useUserStore();
  const currency = computed(() => userStore.user?.currency);

  const { t } = useI18n();
  // Store / enumerations
  const operationStore = useOperationsStore();
  const globalStore = useGlobalStore();

  const categories = computed(() => operationStore.categories);
  const frequencies = computed(() => operationStore.frequencies);
  const recursiveTypes = computed(() => operationStore.recursiveTypes);
  const months = computed(() => globalStore.months);
  const days = computed(() => globalStore.days);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => ({ label: currentYear + i, value: currentYear + i }));

  // Dati del form
  const localForm = ref({
    amount: null,
    description: '',
    category: '',
    recursiveType: 'INFINITE',
    frequency: 'MONTHLY',
    frequencyCount: 1,
    maxOccurrences: null,
    firstOccurrence: {
      day: 1,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    },
  });

  const loading = ref(true);
  const getRecurringExpenseData = async () => {
    loading.value = true;
    await Promise.all([
      operationStore.getCategories(),
      operationStore.getRecursiveTypes(),
      operationStore.getFrequencies(),
    ]);
    loading.value = false;
  };

  onMounted(() => {
    getRecurringExpenseData();
    globalStore.setAppTitle(t('newRecurringExpense'));
  });

  // Watch recursiveType per impostare comportamenti di default
  watch(
    () => localForm.value.recursiveType,
    (newVal) => {
      if (newVal === 'INFINITE') {
        localForm.value.maxOccurrences = 9999;
      } else if (newVal === 'OCCURRENCES_LIMIT') {
        localForm.value.maxOccurrences = 5;
      } else if (newVal === 'UNTIL_DATE') {
        localForm.value.maxOccurrences = 0;
      }
    },
  );

  // Watch per calcolare maxOccurrences e impostare lastOccurenceDate
  watch(
    () => [
      localForm.value.frequency,
      localForm.value.frequencyCount,
      localForm.value.recursiveType,
      localForm.value.maxOccurrences,
      localForm.value.firstOccurrence?.month,
      localForm.value.firstOccurrence?.year,
    ],
    () => {
      if (localForm.value.recursiveType === 'UNTIL_DATE') {
        computeMaxOccurrences();
      }
    },
  );

  function computeMaxOccurrences() {
    console.log('Computing max occurrences...');

    const { frequency, frequencyCount, firstOccurrence } = localForm.value;

    // Verifica validità di `firstOccurrence`
    if (!firstOccurrence || !firstOccurrence.month || !firstOccurrence.year) {
      localForm.value.maxOccurrences = 0;
      return;
    }

    // Data iniziale (da `firstOccurrence`)
    const start = new Date(firstOccurrence.year, firstOccurrence.month - 1, 1); // Primo giorno del mese di `firstOccurrence`

    // Intervallo di ricorrenza
    const fc = frequencyCount || 1;

    // Contatore delle occorrenze
    let occurrences = 0;

    // Calcolo delle occorrenze basato sulla ricorsività
    const currentDate = new Date(); // Data attuale
    let current = new Date(start); // Copia della data iniziale per calcoli

    while (current <= currentDate) {
      occurrences++;

      switch (frequency) {
        case 'MONTHLY':
          current.setMonth(current.getMonth() + fc); // Incremento di X mesi
          break;
        case 'YEARLY':
          current.setFullYear(current.getFullYear() + fc); // Incremento di X anni
          break;
        default:
          console.warn('Tipo di ricorsività non supportato');
          localForm.value.maxOccurrences = 0;
          return;
      }
    }

    // Assegna il numero di occorrenze calcolate
    localForm.value.maxOccurrences = occurrences;
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

    loading.value = true;
    operationStore
      .addRecurringOperation({
        amount: localForm.value.amount,
        description: localForm.value.description,
        category: localForm.value.category,
        frequency: localForm.value.frequency,
        frequencyCount: localForm.value.frequencyCount,
        recursiveType: localForm.value.recursiveType,
        maxOccurrences: localForm.value.maxOccurrences,
        firstOccurrenceDate: new Date(
          localForm.value.firstOccurrence.year,
          localForm.value.firstOccurrence.month - 1,
          localForm.value.firstOccurrence.day,
        ).toISOString(),
        lastOccurenceDate: lastOccurrenceDate ? lastOccurrenceDate.toISOString() : null,
        type: 'EXPENSE',
      })
      .then(() => {
        console.log('Uscita salvata con successo!');
        loading.value = false;

        router.push({ name: 'AddOperation' });
      })
      .catch((err) => console.error(err));
  }
</script>
