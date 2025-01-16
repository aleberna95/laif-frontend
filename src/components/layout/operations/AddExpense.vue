<template>
  <div class="min-h-full flex items-center justify-center bg-color-primary">
    <div class="max-w-2xl w-full p-8 bg-white rounded-lg shadow-md">
      <div class=" text-center">
        <h1 class="text-4xl font-bold text-gray-800">{{ $t('newExpense') }}</h1>
        <p class="text-gray-600 mt-2">{{ $t('newExpenseDescription') }}</p>
      </div>

      <form @submit.prevent="submitExpense" class="space-y-6">
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
          <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
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
            <option v-for="cat in expenseCategories" :key="cat" :value="cat.value">
              {{ $t(cat.label) }}
            </option>
          </select>
        </div>

        <!-- Month and Year -->
        <div class="grid grid-cols-2 gap-4">
          <DateSelector label="month" :options="months" v-model="month" />
          <DateSelector label="year" :options="years" v-model="year" />
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
  import DateSelector from '@/components/DateSelector.vue';
  import router from '@/router';

  const globalStore = useGlobalStore();
  const operationStore = useOperationsStore();

  const expenseCategories = computed(() => operationStore.expenseCategories);

  const amount = ref(null);
  const description = ref('');
  const category = ref('');
  const month = ref(new Date().getMonth() + 1); // Default to current month
  const year = ref(new Date().getFullYear()); // Default to current year

  const months = globalStore.months;
  const years = globalStore.years;

  const submitExpense = () => {
    if (amount.value && description.value && category.value && month.value && year.value) {
      operationStore
        .addOperation({
          amount: amount.value,
          description: description.value,
          category: category.value,
          month: month.value,
          year: year.value,
          type: 'EXPENSE',
        })
        .finally(() => {
          console.log('Uscita salvata con successo!');
          router.push({ name: 'AddOperation' });
        });
    } else {
      console.error('Compila tutti i campi obbligatori.');
    }
  };

  const getExpenseCategories = async () => {
    await operationStore.getExpenseCategories();
  };

  onMounted(() => {
    getExpenseCategories();
  });
</script>

<style scoped>
  textarea {
    min-height: 100px;
  }
</style>
