<template>
  <div class="min-h-full flex items-end justify-center">
    <div class="max-w-2xl w-full p-8 bg-white rounded-lg shadow-md">
      <BaseBackButton />
      <div class="text-center">
        <p class="text-gray-600 mt-2">{{ $t('newIncomeDescription') }}</p>
      </div>

      <BaseLoader v-if="loading" />
      <form v-else @submit.prevent="submitIncome" class="space-y-6 my-6">
        <!-- Alert errore -->
        <div v-if="errorMessage" class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          {{ errorMessage }}
        </div>

        <!-- Amount -->
        <div class="relative">
          <label for="amount" class="block text-sm font-medium text-gray-700">{{ $t('amount') }}</label>
          <input
            id="amount"
            v-model.number="amount"
            type="number"
            step="0.01"
            required
            class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none" />
          <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 ml-2">{{ currency }}</span>
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">{{ $t('description') }}</label>
          <textarea
            id="description"
            v-model="description"
            required
            class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm resize-none focus:outline-none"></textarea>
        </div>

        <!-- Category -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700">{{ $t('category') }}</label>
          <select
            id="category"
            v-model="selectedCategory"
            required
            class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none">
            <option value="" disabled>{{ $t('selectCategory') }}</option>
            <option v-for="cat in categories" :key="cat" :value="cat.value">
              {{ cat.label }}
            </option>
          </select>
        </div>

        <!-- Month, Day and Year -->
        <div class="grid grid-cols-8 gap-2">
          <BaseSelector class="col-span-2" label="day" :options="days" v-model="day" />
          <BaseSelector class="col-span-4" label="month" :options="months" v-model="month" />
          <BaseSelector class="col-span-2" label="year" :options="years" v-model="year" />
        </div>

        <!-- Submit Button -->
        <div class="mt-6">
          <button
            type="submit"
            class="w-full py-3 bg-blue-600 text-white font-medium text-lg rounded-md shadow-sm hover:bg-blue-700">
            {{ $t('saveIncome') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useOperationsStore } from '@/store/operations';
  import { useGlobalStore } from '@/store/global';
  import BaseSelector from '@/components/BaseSelector.vue';
  import router from '@/router';
  import BaseBackButton from '@/components/BaseBackButton.vue';
  import BaseLoader from '@/components/BaseLoader.vue';
  import { useUserStore } from '@/store/user';

  const userStore = useUserStore();
  const currency = computed(() => userStore.user?.currency);

  const { t } = useI18n();
  const globalStore = useGlobalStore();
  const operationStore = useOperationsStore();

  const categories = computed(() => operationStore.categories);
  const amount = ref(null);
  const description = ref('');
  const selectedCategory = ref('');
  const month = ref(new Date().getMonth() + 1); // Default current month
  const year = ref(new Date().getFullYear()); // Default current year
  const day = ref(new Date().getDate()); // Default current day

  const months = globalStore.months;
  const years = globalStore.years;
  const days = globalStore.days;
  const loading = ref(false);
  const errorMessage = ref('');

  const submitIncome = () => {
    errorMessage.value = '';

    // Verifica dei campi obbligatori
    if (!amount.value || amount.value <= 0) {
      errorMessage.value = t('pleaseEnterAmount'); // Traduci la chiave in i18n oppure sostituisci con "Inserisci un importo valido"
      return;
    }
    if (!description.value || description.value.trim() === '') {
      errorMessage.value = t('pleaseEnterDescription'); // Traduci la chiave oppure usa "Inserisci una descrizione"
      return;
    }
    if (!selectedCategory.value || selectedCategory.value === '') {
      errorMessage.value = t('pleaseSelectCategory'); // Traduci la chiave oppure usa "Seleziona una categoria"
      return;
    }

    // Se tutto è inserito, procedi con l'operazione
    loading.value = true;
    operationStore
      .addOperation({
        amount: amount.value,
        description: description.value,
        category: selectedCategory.value,
        month: month.value,
        year: year.value,
        type: 'INCOME',
        day: day.value,
      })
      .then(() => {
        console.log('Entrata salvata con successo!');
        router.push({ name: 'AddOperation' });
      })
      .catch((error) => {
        console.error(error);
        // Potresti mostrare anche un messaggio d'errore generico in caso di fallimento
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const getCategories = async () => {
    loading.value = true;
    await operationStore.getCategories().finally(() => {
      loading.value = false;
    });
  };

  onMounted(() => {
    getCategories();
    globalStore.setAppTitle(t('newIncome'));
  });
</script>

<style scoped>
  textarea {
    min-height: 100px;
  }
</style>
