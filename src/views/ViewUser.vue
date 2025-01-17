<template>
  <div class="flex flex-col items-center justify-center h-full w-full">
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
