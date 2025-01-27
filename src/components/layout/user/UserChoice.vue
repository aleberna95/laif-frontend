<template>
  <div class="flex flex-col items-center justify-end min-h-full w-full py-6">
    <!-- Lista centrale di bottoni -->
    <div class="flex flex-col items-center gap-4 w-80">
      <!-- Bottone Gestisci Account -->
      <router-link
        to="/user/userSetting"
        class="flex items-center gap-2 justify-start bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 w-full rounded shadow focus:outline-none focus:ring">
        <span class="material-icons-outlined">settings</span>
        {{ $t('manageAccount') }}
      </router-link>

      <!-- Bottone Gestione Consigli e Spese Ricorrenti -->
      <router-link
        to="/user/recurrenceAndSettings"
        class="flex items-center gap-2 justify-start bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 w-full rounded shadow focus:outline-none focus:ring">
        <span class="material-icons-outlined">euro</span>
        {{ $t('manageRecurring') }}
      </router-link>

      <!-- Bottone di Logout -->
      <button
        @click="logout"
        class="flex items-center gap-2 justify-start bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 w-full rounded focus:outline-none focus:shadow-outline">
        <span class="material-icons-outlined">logout</span>
        {{ $t('logout') }}
      </button>
    </div>
  </div>
</template>

<script>
  import { signOut } from 'firebase/auth';
  import { auth } from '@/services/firebase';
  import { useAuthStore } from '@/store/auth';

  export default {
    name: 'ViewUser',
    methods: {
      async logout() {
        try {
          // Esegui il logout tramite Firebase
          await signOut(auth);
          console.log('Logout riuscito');

          const store = useAuthStore();
          // Reindirizza alla pagina di login
          store.logout();
          this.$router.push('/login');
        } catch (error) {
          console.error('Errore durante il logout:', error);
        }
      },
    },
  };
</script>

<style scoped>
  /* Stile semplice per la pagina utente */
</style>
