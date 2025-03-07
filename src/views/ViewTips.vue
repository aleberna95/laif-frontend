<template>
  <div class="flex flex-col h-full min-h-full bg-gray-50">
    <main class="flex-1 overflow-y-auto">
      <div class="max-w-7xl mx-auto p-6 space-y-8">
        <!-- Loader -->
        <BaseLoader v-if="loading" />

        <!-- Griglia delle Card -->
        <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <!-- Card Svago (Leisure) -->
          <div
            class="bg-white/90 backdrop-blur-lg p-6 rounded-xl shadow-md border-l-4 border-yellow-500 hover:shadow-xl transition-shadow duration-300">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-xl font-bold text-yellow-600">{{ $t('leisure') }}</h2>
              <TooltipModal>
                <p class="text-sm">{{ $t('leisureTooltip') }}</p>
              </TooltipModal>
            </div>
            <div class="relative">
              <div class="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-yellow-400 to-yellow-600"
                  :style="{ width: (spentLeisurePercent > 100 ? 100 : spentLeisurePercent) + '%' }"></div>
              </div>
              <div class="absolute inset-0 flex justify-center items-center text-xs font-semibold text-white">
                <span>{{ spentLeisure || 0 }}</span>
                <span class="mx-1">/</span>
                <span>{{ leisureBudget || 0 }}</span>
                <span class="ml-1">{{ currency }}</span>
              </div>
            </div>
            <p class="mt-3 text-sm font-medium text-yellow-700">{{ $t(messageLeisure) }}</p>
          </div>

          <!-- Card Risparmi (Savings) -->
          <div
            class="bg-white/90 backdrop-blur-lg p-6 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-xl font-bold text-green-600">{{ $t('savings') }}</h2>
              <TooltipModal>
                <p class="text-sm">{{ $t('savingsTooltip') }}</p>
              </TooltipModal>
            </div>
            <div class="relative">
              <div class="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-green-400 to-green-600"
                  :style="{ width: (spentSavingsPercent > 100 ? 100 : spentSavingsPercent) + '%' }"></div>
              </div>
              <div class="absolute inset-0 flex justify-center items-center text-xs font-semibold text-white">
                <span>{{ spentSavings || 0 }}</span>
                <span class="mx-1">/</span>
                <span>{{ savingBudget || 0 }}</span>
                <span class="ml-1">{{ currency }}</span>
              </div>
            </div>
            <p class="mt-3 text-sm font-medium text-green-700">{{ $t(messageSavings) }}</p>
          </div>

          <!-- Card Investimenti (Investments) -->
          <div
            class="bg-white/90 backdrop-blur-lg p-6 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-xl font-bold text-blue-600">{{ $t('investments') }}</h2>
              <TooltipModal>
                <p class="text-sm">{{ $t('investmentTooltip') }}</p>
              </TooltipModal>
            </div>
            <div class="relative">
              <div class="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-blue-400 to-blue-600"
                  :style="{ width: (spentInvestmentsPercent > 100 ? 100 : spentInvestmentsPercent) + '%' }"></div>
              </div>
              <div class="absolute inset-0 flex justify-center items-center text-xs font-semibold text-white">
                <span>{{ spentInvestments || 0 }}</span>
                <span class="mx-1">/</span>
                <span>{{ investmentBudget || 0 }}</span>
                <span class="ml-1">{{ currency }}</span>
              </div>
            </div>
            <p class="mt-3 text-sm font-medium text-blue-700">{{ $t(messageInvestment) }}</p>
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
  import TooltipModal from '@/components/TooltipModal.vue';

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
        loading.value = false;
      });
    } catch (error) {
      console.error('Error fetching tips data', error);
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
