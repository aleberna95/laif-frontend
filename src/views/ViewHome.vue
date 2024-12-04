<template>
  <div class="w-full h-full text-center p-6 bg-color-primary">
    <div class="p-4 bg-red-200 rounded-full border border-red-800">Ciao Feferina, come stai? Spero bene. Ti dedico questa pagina web/app. Ti voglio bene {{ '<3' }}</div>
    <h1 class="font-bold text-lg">Welcome to the Home Page</h1>
    <span class="p-8">
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else>
        <span v-for="el in data.data" :key="el">
          <span class="p-6">
            <p>{{ el.email }}</p>
            <p>{{ el.createdAt }}</p>
          </span>
        </span>
      </div>
    </span>
  </div>
</template>

<script>
  import { ref, onMounted } from 'vue';
  import apiService from '@/utils/apiService';

  export default {
    name: 'ViewHome',
    setup() {
      const data = ref(null);
      const loading = ref(true);
      const error = ref(null);

      const fetchData = async () => {
        try {
          const response = await apiService.getData('/api/users');
          data.value = response.data;
        } catch (err) {
          error.value = 'Errore durante il caricamento dei dati';
        } finally {
          loading.value = false;
        }
      };

      onMounted(() => {
        fetchData();
      });

      return {
        data,
        loading,
        error,
      };
    },
  };
</script>
