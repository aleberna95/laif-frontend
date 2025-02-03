<template>
  <div class="flex flex-col h-full min-h-full bg-gray-50">
    <!-- Header Fisso (se presente in un wrapper globale, altrimenti aggiungi qui il BaseBackButton) -->
    <!-- Contenuto scrollabile -->
    <main class="flex-1 overflow-y-auto">
      <div class="max-w-7xl mx-auto p-6 space-y-8">
        <!-- Loader -->
        <BaseLoader v-if="loading" />

        <!-- Contenuto Tips -->
        <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <!-- Card Svago -->
          <div
            class="bg-white p-3 rounded-lg shadow-xl border-l-8 border-yellow-500 hover:shadow-2xl transition-shadow">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-yellow-600">{{ $t('leisure') }}</h2>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-6 overflow-hidden relative">
              <div
                class="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-yellow-400 to-yellow-600"
                :style="{ width: (spentLeisurePercent > 100 ? 100 : spentLeisurePercent) + '%' }"></div>
              <div class="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                <span>{{ spentLeisure || 0 }}</span>
                <span class="mx-1">/</span>
                <span>{{ leisureBudget || 0 }}</span>
                <span class="ml-1">{{ currency }}</span>
              </div>
            </div>
            <p class="mt-4 text-sm font-medium text-yellow-700">{{ $t(messageLeisure) }}</p>
          </div>

          <!-- Card Risparmi -->
          <div class="bg-white p-6 rounded-lg shadow-xl border-l-8 border-green-500 hover:shadow-2xl transition-shadow">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-green-600">{{ $t('savings') }}</h2>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-6 overflow-hidden relative">
              <div
                class="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-green-400 to-green-600"
                :style="{ width: (spentSavingsPercent > 100 ? 100 : spentSavingsPercent) + '%' }"></div>
              <div class="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                <span>{{ spentSavings || 0 }}</span>
                <span class="mx-1">/</span>
                <span>{{ savingBudget || 0 }}</span>
                <span class="ml-1">{{ currency }}</span>
              </div>
            </div>
            <p class="mt-4 text-sm font-medium text-green-700">{{ $t(messageSavings) }}</p>
          </div>

          <!-- Card Investimenti -->
          <div class="bg-white p-6 rounded-lg shadow-xl border-l-8 border-blue-500 hover:shadow-2xl transition-shadow">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-blue-600">{{ $t('investments') }}</h2>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-6 overflow-hidden relative">
              <div
                class="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-blue-400 to-blue-600"
                :style="{ width: (spentInvestmentsPercent > 100 ? 100 : spentInvestmentsPercent) + '%' }"></div>
              <div class="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                <span>{{ spentInvestments || 0 }}</span>
                <span class="mx-1">/</span>
                <span>{{ investmentBudget || 0 }}</span>
                <span class="ml-1">{{ currency }}</span>
              </div>
            </div>
            <p class="mt-4 text-sm font-medium text-blue-700">{{ $t(messageInvestment) }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import BaseLoader from '@/components/BaseLoader.vue';
  import { useOperationsStore } from '@/store/operations';
  import { useUserStore } from '@/store/user';
  import { useGlobalStore } from '@/store/global';
  import { useI18n } from 'vue-i18n';

  const globalStore = useGlobalStore();
  const operationsStore = useOperationsStore();
  const userStore = useUserStore();

  const { t } = useI18n();

  const currency = computed(() => userStore.user?.currency);

  const loading = ref(true);
  const tipsData = ref({
    savingBudget: 0,
    spentSavings: 0,
    missingSavings: 0,
    messageSavings: '',

    investmentBudget: 0,
    spentInvestments: 0,
    missingInvestments: 0,
    messageInvestment: '',

    leisureBudget: 0,
    spentLeisure: 0,
    missingLeisure: 0,
    messageLeisure: '',
  });

  // Recupera i dati tramite un endpoint unico al montaggio della pagina
  const fetchTipsData = async () => {
    loading.value = true;
    try {
      operationsStore.fetchTips().then((data) => {
        tipsData.value = data;
      });
    } catch (error) {
      console.error('Error fetching tips data', error);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    globalStore.setAppTitle(t('tipsTitle'));
    fetchTipsData();
  });

  // Calcolo delle percentuali spese
  const spentSavingsPercent = computed(() => {
    if (tipsData.value?.savingBudget > 0) {
      return Math.round((tipsData.value?.spentSavings / tipsData.value?.savingBudget) * 100);
    }
    return 0;
  });

  const spentInvestmentsPercent = computed(() => {
    if (tipsData.value?.investmentBudget > 0) {
      return Math.round((tipsData.value?.spentInvestments / tipsData.value?.investmentBudget) * 100);
    }
    return 0;
  });

  const spentLeisurePercent = computed(() => {
    if (tipsData.value?.leisureBudget > 0) {
      return Math.round((tipsData.value?.spentLeisure / tipsData.value?.leisureBudget) * 100);
    }
    return 0;
  });

  // Alias per i dati, in modo da rendere il template più leggibile
  const savingBudget = computed(() => tipsData.value?.savingBudget);
  const spentSavings = computed(() => tipsData.value?.spentSavings);
  const messageSavings = computed(() => tipsData.value?.messageSavings);

  const investmentBudget = computed(() => tipsData.value?.investmentBudget);
  const spentInvestments = computed(() => tipsData.value?.spentInvestments);
  const messageInvestment = computed(() => tipsData.value?.messageInvestment);

  const leisureBudget = computed(() => tipsData.value?.leisureBudget);
  const spentLeisure = computed(() => tipsData.value?.spentLeisure);
  const messageLeisure = computed(() => tipsData.value?.messageLeisure);
</script>

<style scoped>
  /* Aggiungi qui eventuali personalizzazioni extra, ad esempio per migliorare la leggibilità su mobile */
</style>
