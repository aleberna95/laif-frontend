<template>
  <div class="w-full h-full text-center p-4">
    <!-- 
      <div class="my-6 p-4 bg-red-200 rounded-full border border-red-800">
        Ciao Feferina, come stai? Spero bene. Ti dedico questa pagina web/app. Ti voglio bene {{ '<3' }}
      </div> -->
    <h1 class="font-bold text-lg">{{ $t('welcomeHome') }}</h1>
    <span class="p-4">
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else class="flex justify-center">
        <span>
          <span class="flex">
            <p>{{ $t('hello') }},</p>
            <p class="font-bold ml-2">{{ user.name }}</p>
            <p>.</p>
          </span>
          <p>Sei correttamente loggato!!</p>
        </span>
      </div>
    </span>
  </div>
</template>

<script>
  import { ref, onMounted, computed } from 'vue';
  import { useUserStore } from '@/store/user';

  export default {
    name: 'ViewHome',
    setup() {
      const data = ref(null);
      const loading = ref(true);
      const error = ref(null);
      const userStore = useUserStore();
      const user = computed(() => userStore.user);

      const fetchData = async () => {
        loading.value = true;
        try {
          await userStore.getUser();
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
        user,
        loading,
        error,
      };
    },
  };
</script>
