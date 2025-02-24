<template>
  <div class="flex flex-col h-full">
    <!-- Header Fisso -->
    <header class="w-full z-10">
      <BaseBackButton />
    </header>
    <!-- Contenuto Scrollabile -->
    <main class="pt-4 flex-1 overflow-y-auto">
      <div class="container mx-auto p-4">
        <!--         <h1 class="text-2xl font-bold mb-4">{{ $t('userSettingsTitle') }}</h1>
 -->
        <!-- Info Utente -->
        <BaseLoader v-if="userLoader" />
        <div v-else class="bg-white p-4 rounded shadow mb-6">
          <h2 class="text-xl font-semibold mb-2">{{ $t('userInfo') }}</h2>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700" for="nome">{{ $t('name') }}</label>
            <input
              id="nome"
              type="text"
              v-model="userName"
              placeholder="Inserisci il tuo nome"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:border-blue-300" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700" for="email">{{ $t('email') }}</label>
            <input
              id="email"
              type="email"
              :value="userEmail"
              disabled
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100" />
          </div>
        </div>

        <!-- Settings -->
        <BaseLoader v-if="dataLoader" />
        <div v-else class="bg-white p-4 rounded shadow">
          <h2 class="text-xl font-semibold mb-2">{{ $t('settings') }}</h2>
          <div class="mb-4">
            <BaseSelector label="language" :options="languages" v-model="selectedLanguage" />
          </div>
          <div class="mb-4">
            <BaseSelector :translateLabel="false" label="currency" :options="currencies" v-model="selectedCurrency" />
          </div>
        </div>

        <!-- Bottone per salvare -->
        <button
          v-show="!dataLoader && !userLoader"
          @click="saveSettings"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none">
          {{ $t('save') }}
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed, onUpdated } from 'vue';
  import BaseSelector from '@/components/BaseSelector.vue';
  import { useUserStore } from '@/store/user';
  import { useI18n } from 'vue-i18n';
  import BaseLoader from '@/components/BaseLoader.vue';
  import BaseBackButton from '@/components/BaseBackButton.vue';
  import { useGlobalStore } from '@/store/global';

  const { t } = useI18n();
  const { locale } = useI18n();
  // Recupera dati utente dallo store
  const userStore = useUserStore();
  const globalStore = useGlobalStore();
  const userName = ref('');
  const userEmail = ref('');

  // Opzioni per la select della lingua (queste possono essere statiche oppure caricate dinamicamente)
  const languages = computed(() => userStore.languages);
  const selectedLanguage = ref();

  // Lista delle currency da recuperare dal backend
  const currencies = computed(() => userStore.currencies);
  const selectedCurrency = ref();

  const dataLoader = ref(true);
  const fetchSelectorData = async () => {
    dataLoader.value = true;
    try {
      return Promise.all([userStore.getLanguages(), userStore.getCurrencies()]).then(() => {
        dataLoader.value = false;
      });
    } catch {
      console.error('Errore nel recupero dei dati per i selettori');
    }
  };

  const userLoader = ref(true);
  const fetchUserData = async () => {
    try {
      userLoader.value = true;
      await userStore
        .getUser()
        .then((data) => {
          selectedLanguage.value = data.language;
          selectedCurrency.value = data.currency;
          userName.value = data.name;
          userEmail.value = data.email;
        })
        .then(() => {
          userLoader.value = false;
        });
    } catch (error) {
      console.error("Errore nel recupero dei dati' dell utente:", error);
    }
  };

  const changeLanguage = (newLang) => {
    locale.value = newLang;
    selectedLanguage.value = newLang;
    localStorage.setItem('userLanguage', newLang);
  };

  onMounted(() => {
    fetchUserData();
    fetchSelectorData();
    globalStore.setAppTitle(t('userSettingsTitle'));
  });
  onUpdated(() => {
    globalStore.setAppTitle(t('userSettingsTitle'));
  });
  // Funzione per salvare le modifiche
  const saveSettings = () => {
    dataLoader.value = true;
    userLoader.value = true;
    // Aggiorna lo store con i nuovi dati
    userStore
      .updateUser({
        name: userName.value,
        language: selectedLanguage.value,
        currency: selectedCurrency.value,
      })
      .then(() => {
        changeLanguage(selectedLanguage.value);
        dataLoader.value = false;
        userLoader.value = false;
      });
    // Puoi aggiungere qui eventuali notifiche di salvataggio o gestione degli errori
  };
</script>

<style scoped>
  /* Con Tailwind CSS, lo styling aggiuntivo potrebbe non essere necessario */
</style>
