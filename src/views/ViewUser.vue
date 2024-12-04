<template>
  <div class="flex flex-col items-center justify-center h-full w-full bg-color-primary">
    <div class="text-xl font-semibold text-gray-800 mb-6">User Page</div>
    <!-- Bottone di Logout -->
    <button
      @click="logout"
      class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
      Logout
    </button>
  </div>
</template>

<script>
  import { signOut } from 'firebase/auth';
  import { auth } from '@/services/firebase';
  import store from '@/store';

  export default {
    name: 'ViewUser',
    methods: {
      async logout() {
        try {
          // Esegui il logout tramite Firebase
          await signOut(auth);

          // Rimuovi le informazioni dal localStorage
          localStorage.removeItem('userToken');
          localStorage.removeItem('userEmail');

          console.log('Logout riuscito');

          // Reindirizza alla pagina di login
          store.dispatch('logout');

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
