<template>
  <div class="flex flex-col h-screen">
    <!-- Contenuto scrollabile -->
    <main class="pt-8 flex-1 overflow-y-auto">
      <div class="container mx-auto p-4">
        <!-- Indicatori di performance -->
        <section class="mb-6">
          <!-- Loader -->
          <div v-if="dashboardLoading" class="flex justify-center items-center p-4">
            <BaseLoader />
          </div>
          <div v-else class="grid grid-cols-2 gap-4">
            <!-- Totale Entrate -->
            <div class="bg-green-100 p-4 rounded-xl shadow">
              <span>
                <p class="text-sm text-gray-600">{{ $t('totalMonthIncome') }}</p>
                <p class="text-xs text-gray-500">{{ currency }}</p>
              </span>
              <span>
                <p class="text-xl font-semibold">{{ totalIncome || 0 }}</p>
                <p class="text-gray-400 text-xs mt-2">Mese precedente</p>
                <p
                  class="text-sm rounded-lg px-2 flex items-center"
                  :class="{
                    'text-green-600': incomeChange >= 0,
                    'text-red-600': incomeChange < 0,
                  }">
                  <span v-if="incomeChange > 0" class="material-icons-outlined">trending_up</span>
                  <span v-else-if="incomeChange < 0" class="material-icons-outlined">trending_down</span>
                  <span v-else class="material-icons-outlined">trending_flat</span>
                  {{ incomeChange > 0 ? '+' : ' ' }}{{ incomeChange }}%
                </p>
              </span>
            </div>
            <!-- Totale Spese -->
            <div class="bg-red-100 p-4 rounded-xl shadow">
              <span>
                <p class="text-sm text-gray-600">{{ $t('totalMonthExpense') }}</p>
                <p class="text-xs text-gray-500">{{ currency }}</p>
              </span>
              <span>
                <p class="text-xl font-semibold">{{ totalExpense || 0 }}</p>
                <p class="text-gray-400 text-xs mt-2">Mese precedente</p>
                <p
                  class="text-sm rounded-lg px-2 flex items-center"
                  :class="{
                    'text-red-600': expenseChange >= 0,
                    'text-green-600': expenseChange < 0,
                  }">
                  <span v-if="expenseChange > 0" class="material-icons-outlined">trending_up</span>
                  <span v-if="expenseChange < 0" class="material-icons-outlined">trending_down</span>
                  <span v-else class="material-icons-outlined">trending_flat</span>
                  {{ expenseChange > 0 ? '+' : ' ' }}{{ expenseChange }}%
                </p>
              </span>
            </div>
            <!-- Card: Rimanente Totale -->
            <BaseCard title="remainingEstimated">
              <p class="text-sm text-gray-500">{{ currency }}</p>
              <div class="py-6">
                <div class="text-3xl font-bold text-gray-800">
                  {{ remainingTotal.toFixed(2) }}
                </div>
                <div class="mt-4">
                  <div class="h-2 bg-gray-300 rounded-full overflow-hidden">
                    <div
                      class="h-full transition-all duration-500"
                      :style="{
                        width: remainingPercentage + '%',
                        background: dynamicColorTotal,
                      }"></div>
                  </div>
                  <p class="mt-2 text-sm text-gray-600 text-right">{{ remainingPercentage }}%</p>
                </div>
              </div>
            </BaseCard>
            <!-- Card: Rimanente Stimato -->
            <BaseCard>
              <!-- Header con titolo e tooltip in alto a destra -->
              <div class="flex justify-between items-center">
                <h2 class="text-sm text-gray-500">{{ $t('remainingStimedEstimated') }}</h2>
              </div>

              <!-- Corpo della card -->
              <span class="flex justify-between items-center">
                <p class="text-sm text-gray-500">{{ currency }}</p>
                <TooltipModal>
                  <p class="text-lg">
                    {{ $t('stimedTooltips') }}
                  </p>
                </TooltipModal>
              </span>
              <div class="py-6">
                <div class="text-3xl font-bold text-gray-800">
                  {{ remainingStimedTotal }}
                </div>
                <div class="mt-4">
                  <div class="h-2 bg-gray-300 rounded-full overflow-hidden">
                    <div
                      class="h-full transition-all duration-500"
                      :style="{
                        width: remainingStimedPercentage + '%',
                        background: dynamicColorStimed,
                      }"></div>
                  </div>
                  <p class="mt-2 text-sm text-gray-600 text-right">{{ remainingStimedPercentage }}%</p>
                </div>
              </div>
            </BaseCard>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useDashboardStore } from '@/store/dashboard';
  import { useGlobalStore } from '@/store/global';
  import { useUserStore } from '@/store/user';
  import BaseLoader from '@/components/BaseLoader.vue';
  import BaseCard from '@/components/BaseCard.vue';
  import TooltipModal from '@/components/TooltipModal.vue';

  // --- Pinia Stores ---
  const dashboardStore = useDashboardStore();
  const globalStore = useGlobalStore();
  const userStore = useUserStore();

  // --- Filtri ---
  const selectedMonth = ref(globalStore.currentMonth || new Date().getMonth() + 1);
  const selectedYear = ref(globalStore.currentYear || new Date().getFullYear());

  // --- Dati di Dashboard ---
  const currency = computed(() => userStore.user?.currency);
  const totalIncome = computed(() => dashboardStore.totalIncome);
  const totalExpense = computed(() => dashboardStore.totalExpense);
  const incomeChange = computed(() => dashboardStore.incomeChange);
  const expenseChange = computed(() => dashboardStore.expenseChange);

  // Rimanente Totale: differenza tra entrate e spese
  const remainingTotal = computed(() => totalIncome.value - totalExpense.value);
  const remainingPercentage = computed(() =>
    totalIncome.value ? Math.round((remainingTotal.value / totalIncome.value) * 100) : 0,
  );

  // Rimanente Stimato: logica che può essere modificata a piacimento
  const remainingStimedTotal = computed(() => dashboardStore.estimatedRemainingTotal);
  const remainingStimedPercentage = computed(() => dashboardStore.estimatedReminingPercentage);

  // Funzione per calcolare il colore dinamico da rosso a verde in base alla percentuale
  function getDynamicColor(percentage) {
    const fraction = Math.min(Math.max(percentage, 0), 100) / 100;
    // Colore rosso: rgb(255, 59, 48), Colore verde: rgb(52, 199, 89)
    const r = Math.round(255 * (1 - fraction) + 52 * fraction);
    const g = Math.round(59 * (1 - fraction) + 199 * fraction);
    const b = Math.round(48 * (1 - fraction) + 89 * fraction);
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Computed properties per il colore dinamico per entrambe le card
  const dynamicColorTotal = computed(() => getDynamicColor(remainingPercentage.value));
  const dynamicColorStimed = computed(() => getDynamicColor(remainingStimedPercentage.value));

  const dashboardLoading = ref(false);

  // --- Funzioni di API ---
  const fetchDashboardData = async () => {
    dashboardLoading.value = true;
    const filters = {
      month: selectedMonth.value,
      year: selectedYear.value,
    };

    await dashboardStore.fetchDashboardData(filters);
    await dashboardStore.fetchEstimatedRemainingTotal(filters);

    dashboardLoading.value = false;
  };

  onMounted(() => {
    fetchDashboardData();
  });
</script>

<style scoped>
  /* Eventuali stili personalizzati */
</style>
