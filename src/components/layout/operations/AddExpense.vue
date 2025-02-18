<template>
  <div class="min-h-full flex items-end justify-center">
    <div class="max-w-2xl w-full p-8 bg-white rounded-lg shadow-md">
      <BaseBackButton />
      <div class="text-center">
        <!--         <h1 class="text-2xl font-bold text-gray-800">{{ $t('newExpense') }}</h1>
 -->
        <p class="text-gray-600 mt-2">{{ $t('newExpenseDescription') }}</p>
      </div>
      <BaseLoader v-if="loading" />
      <form v-else @submit.prevent="submitExpense" class="space-y-6">
        <!-- Amount -->
        <div class="relative">
          <label for="amount" class="block text-sm font-medium text-gray-700">{{ $t('amount') }}</label>
          <input
            id="amount"
            v-model="amount"
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
            v-model="category"
            required
            class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none">
            <option v-for="cat in categories" :key="cat" :value="cat.value">
              {{ cat.label }}
            </option>
          </select>
        </div>

        <!-- Month and Year -->
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
            {{ $t('saveExpense') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useOperationsStore } from '@/store/operations';
  import { useGlobalStore } from '@/store/global';
  import BaseSelector from '@/components/BaseSelector.vue';
  import router from '@/router';
  import BaseBackButton from '@/components/BaseBackButton.vue';
  import BaseLoader from '@/components/BaseLoader.vue';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '@/store/user';

  const userStore = useUserStore();
  const currency = computed(() => userStore.user?.currency);

  const { t } = useI18n();
  const globalStore = useGlobalStore();
  const operationStore = useOperationsStore();

  const categories = computed(() => operationStore.categories);

  const amount = ref(null);
  const description = ref('');
  const category = ref('');
  const month = ref(new Date().getMonth() + 1); // Default to current month
  const year = ref(new Date().getFullYear()); // Default to current year
  const day = ref(new Date().getDate()); // Default to current day

  const months = globalStore.months;
  const years = globalStore.years;
  const days = globalStore.days;

  const loading = ref(false);

  const submitExpense = () => {
    if (amount.value && description.value && category.value && month.value && year.value) {
      loading.value = true;
      operationStore
        .addOperation({
          amount: amount.value,
          description: description.value,
          category: category.value,
          month: month.value,
          year: year.value,
          type: 'EXPENSE',
          day: day.value,
        })
        .finally(() => {
          console.log('Uscita salvata con successo!');
          loading.value = false;

          router.push({ name: 'AddOperation' });
        });
    } else {
      console.error('Compila tutti i campi obbligatori.');
    }
  };

  const getCategories = async () => {
    loading.value = true;

    await operationStore.getCategories().finally(() => {
      loading.value = false;
    });
  };

  onMounted(() => {
    getCategories();
    globalStore.setAppTitle(t('newExpense'));
  });
</script>

<style scoped>
  textarea {
    min-height: 100px;
  }
</style>
