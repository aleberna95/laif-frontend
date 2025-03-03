<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useDashboardStore } from '@/store/dashboard';
  import { useGlobalStore } from '@/store/global';
  import { useUserStore } from '@/store/user';
  import BaseLoader from '@/components/BaseLoader.vue';
  import BaseCard from '@/components/BaseCard.vue';
  import TooltipModal from '@/components/TooltipModal.vue';
  import BaseMonthSlider from '@/components/BaseMonthSlider.vue';

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

  const remainingTotal = computed(() => totalIncome.value - totalExpense.value);
  const remainingPercentage = computed(() =>
    totalIncome.value ? Math.round((remainingTotal.value / totalIncome.value) * 100) : 0,
  );

  const remainingStimedTotal = computed(() => dashboardStore.estimatedRemainingTotal);
  const remainingStimedPercentage = computed(() => dashboardStore.estimatedReminingPercentage);

  function getDynamicColor(percentage) {
    const fraction = Math.min(Math.max(percentage, 0), 100) / 100;
    const r = Math.round(255 * (1 - fraction) + 52 * fraction);
    const g = Math.round(59 * (1 - fraction) + 199 * fraction);
    const b = Math.round(48 * (1 - fraction) + 89 * fraction);
    return `rgb(${r}, ${g}, ${b})`;
  }

  const dynamicColorTotal = computed(() => getDynamicColor(remainingPercentage.value));
  const dynamicColorStimed = computed(() => getDynamicColor(remainingStimedPercentage.value));

  const dashboardLoading = ref(false);

  const fetchDashboardData = async () => {
    dashboardLoading.value = true;
    const filters = {
      month: selectedMonth.value,
      year: selectedYear.value,
    };
    console.log('Filters:', filters);

    await dashboardStore.fetchDashboardData(filters);
    await dashboardStore.fetchEstimatedRemainingTotal(filters);
    dashboardLoading.value = false;
  };

  onMounted(() => {
    fetchDashboardData();
  });

  // Funzione che genera l'array dei mesi
  function generateMonthsArray(selectedMonth, selectedYear) {
    const today = new Date();
    const currentRealMonth = today.getMonth() + 1;
    const currentRealYear = today.getFullYear();

    const monthNames = [
      'JANUARY',
      'FEBRUARY',
      'MARCH',
      'APRIL',
      'MAY',
      'JUNE',
      'JULY',
      'AUGUST',
      'SEPTEMBER',
      'OCTOBER',
      'NOVEMBER',
      'DECEMBER',
    ];

    // Oggetto del mese corrente (quello selezionato dal filtro)
    const currentObj = {
      label: monthNames[selectedMonth - 1],
      value: selectedMonth,
      year: selectedYear,
    };

    // Calcola il mese precedente (con cambio anno se necessario)
    let prevMonth, prevYear;
    if (selectedMonth === 1) {
      prevMonth = 12;
      prevYear = selectedYear - 1;
    } else {
      prevMonth = selectedMonth - 1;
      prevYear = selectedYear;
    }
    const prevObj = {
      label: monthNames[prevMonth - 1],
      value: prevMonth,
      year: prevYear,
    };

    // Calcola il mese successivo (con cambio anno se necessario)
    let nextMonth, nextYear;
    if (selectedMonth === 12) {
      nextMonth = 1;
      nextYear = selectedYear + 1;
    } else {
      nextMonth = selectedMonth + 1;
      nextYear = selectedYear;
    }
    const nextObj = {
      label: monthNames[nextMonth - 1],
      value: nextMonth,
      year: nextYear,
    };

    // Se il filtro corrente (selectedMonth/selectedYear) è il mese reale,
    // non permettiamo di andare avanti nel futuro: l'array conterrà solo prev e current.
    // Altrimenti includiamo anche il mese successivo.
    let arr = [];
    // Ordinamento per il BaseMonthSlider: [mese precedente, mese corrente, (eventuale) mese successivo]
    arr.push(prevObj, currentObj);
    if (!(selectedMonth === currentRealMonth && selectedYear === currentRealYear)) {
      arr.push(nextObj);
    }
    return arr;
  }

  // L'array dei mesi si aggiorna dinamicamente
  const monthsArray = computed(() => generateMonthsArray(selectedMonth.value, selectedYear.value));

  // Gestione degli eventi emessi dal BaseMonthSlider
  function handleGoPrev() {
    // "go-prev" significa andare al mese precedente, che è l'elemento in posizione 0
    const prev = monthsArray.value[0];
    if (prev) {
      selectedMonth.value = prev.value;
      selectedYear.value = prev.year;
      fetchDashboardData();
    }
  }

  function handleGoNext() {
    // "go-next" significa andare al mese successivo, che è l'elemento in posizione 2 (se esiste)
    if (monthsArray.value.length === 3) {
      const next = monthsArray.value[2];
      selectedMonth.value = next.value;
      selectedYear.value = next.year;
      fetchDashboardData();
    }
  }
</script>

<template>
  <div class="flex flex-col h-screen min-w-full">
    <!-- Contenuto scrollabile -->
    <main class="pt-6 flex-1 overflow-y-auto">
      <div class="container mx-auto p-4">
        <!-- Indicatori di performance -->
        <section class="mb-6">
          <BaseMonthSlider
            :items="monthsArray"
            v-model="selectedMonth"
            @go-prev="handleGoPrev"
            @go-next="handleGoNext" />
          <!-- Loader -->
          <div v-if="dashboardLoading" class="flex justify-center items-center p-4 min-w-full">
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
                        width: remainingPercentage < 0 ? 0 : remainingPercentage + '%',
                        background: dynamicColorTotal,
                      }"></div>
                  </div>
                  <p class="mt-2 text-sm text-gray-600 text-right">
                    {{ remainingPercentage < 0 ? 0 : remainingPercentage }}%
                  </p>
                </div>
              </div>
            </BaseCard>
            <!-- Card: Rimanente Stimato -->
            <BaseCard>
              <div class="flex justify-between items-center">
                <h2 class="text-sm text-gray-500">{{ $t('remainingStimedEstimated') }}</h2>
              </div>
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

<style scoped>
  /* Eventuali stili personalizzati */
</style>
