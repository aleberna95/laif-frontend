<template>
  <div class="w-full bg-color-primary p-4 h-full">
    <h1>Welcome to the Home Page</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <p>{{ data }}</p>
      <p>{{ data }}</p>
      <p>{{ data }}</p>
      <p>{{ data }}</p>
      <p>{{ data }}</p>
      <p>{{ data }}</p>
      <p>{{ data }}</p>
      <p>{{ data }}</p>
      <p>{{ data }}</p>
      <p>{{ data }}</p>
    </div>
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
