<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 space-y-8">
    <div class="w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-8">{{ $t('excelPageTitle') }}</h1>
      <!-- Loader per operazioni in corso -->
      <div v-if="loading" class="flex justify-center mb-8">
        <BaseLoader />
      </div>
      <!-- Bottoni grandi -->
      <div v-else class="flex flex-col space-y-4">
        <!-- Bottone per scaricare Excel  -->
        <button
          @click="downloadExcel()"
          class="w-full bg-blue-300 text-white py-6 rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300 ease-out">
          {{ $t('downloadOperationTemplate') }}
        </button>
        <!-- Bottone per importare Excel -->
        <button
          @click="triggerImport"
          class="w-full bg-green-300 text-white py-6 rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300 ease-out">
          {{ $t('importExcel') }}
        </button>
      </div>
      <!-- Input file nascosto per l'import -->
      <input ref="fileInput" type="file" accept=".xlsx" class="hidden" @change="handleFileImport" />
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import BaseLoader from '@/components/BaseLoader.vue';
  import { useGlobalStore } from '@/store/global';
  import { useExcelStore } from '@/store/excel';
  import { useOperationsStore } from '@/store/operations';

  const { t } = useI18n();
  const loading = ref(false);
  const fileInput = ref(null);

  const globalStore = useGlobalStore();
  const excelStore = useExcelStore();
  const operationStore = useOperationsStore();

  const categories = computed(() => operationStore.categories);
  onMounted(() => {
    operationStore.getCategories();
  });

  // Recupera i mesi dal globalStore
  const months = computed(() => globalStore.months);
  const years = computed(() => globalStore.years);
  const operationTypes = globalStore.operationTypes;

  // Funzione per il download. In base al tipo, seleziona le categorie e la tipologia tradotta
  async function downloadExcel() {
    try {
      loading.value = true;

      // Controlla se mesi e categorie sono validi prima di procedere
      const parsedMonths = months.value?.map((month) => t(month.label)) || [];
      const parsedCategories = categories.value?.map((category) => t(category.label)) || [];
      const parsedTypes = operationTypes?.map((opType) => t(opType)) || [];

      console.log('types', operationTypes);

      // Chiamata all'azione del Pinia store per il download dell'Excel
      const response = await excelStore.downloadExcel({
        categories: parsedCategories,
        months: parsedMonths,
        years: years.value,
        type: parsedTypes,
      });

      console.log('Risposta dal backend:', response);
      console.log('Tipo di dati ricevuto:', response.data instanceof Blob ? 'Blob valido' : 'Non è un Blob');
      console.log('Dimensione del file ricevuto:', response.data?.size);
      // Verifica se la risposta è valida e contiene dati
      if (!response || !response.data || response.data.size === 0) {
        console.error('Errore: file vuoto o non ricevuto');
        return;
      }

      // Creazione del Blob per il file Excel
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // Creazione e attivazione del link per il download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'file.xlsx');
      document.body.appendChild(link);
      link.click();

      // Pulizia del DOM e rilascio dell'URL Blob
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Errore durante il download dell’Excel:', error);
    } finally {
      loading.value = false;
    }
  }

  // Attiva l'input file per l'import
  function triggerImport() {
    fileInput.value && fileInput.value.click();
  }

  // Gestisce il caricamento del file Excel da importare
  // Nel componente:
  async function handleFileImport(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const formData = new FormData();
    // Usa una chiave consistente con quella che si aspetta il backend
    formData.append('excelFile', file);
    try {
      loading.value = true;
      await excelStore.importExcel(formData);
      // Eventuale feedback (es. toast di successo)
    } catch (error) {
      console.error('Error importing Excel:', error);
    } finally {
      loading.value = false;
      event.target.value = null;
    }
  }
</script>

<style scoped>
  /* Puoi aggiungere eventuali stili personalizzati o animazioni extra se lo desideri */
</style>
