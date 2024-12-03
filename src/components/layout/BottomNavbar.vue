<template>
  <span class="fixed bottom-0 left-0 right-0 w-full flex justify-center">
    <nav class="bg-white border-t-4 border-gray-300 shadow-lg flex justify-between items-center px-6 py-2 lg:w-4/12 w-full">
      <!-- Link Home -->
      <router-link to="/" class="flex flex-col items-center text-gray-600">
        <div class="hover:shadow-xl p-1 rounded">
          <img class="inline-block size-12 h-8 w-8" :src="homeImage" alt="" />
        </div>
        <span class="text-xs">Home</span>
      </router-link>

      <!-- Icona Lista Operazioni -->
      <router-link to="/operations" class="flex flex-col items-center text-gray-600">
        <div class="hover:shadow-xl p-1 rounded">
          <img class="inline-block size-12 h-8 w-8" :src="filesImage" alt="" />
        </div>
        <span class="text-xs">Operazioni</span>
      </router-link>

      <!-- Icona + al centro -->
      <router-link to="/addOperation" class="flex flex-col items-center text-gray-600">
        <div class="hover:shadow-xl p-1 rounded">
          <img class="inline-block size-12 h-12 w-12" :src="addImage" alt="" />
        </div>
        <span class="text-xs">Aggiungi</span>
      </router-link>

      <!-- Icona tips -->
      <router-link to="/tips" class="flex flex-col items-center text-gray-600">
        <div class="hover:shadow-xl p-1 rounded">
          <img class="inline-block size-12 h-8 w-8" :src="piggyBankImage" alt="" />
        </div>
        <span class="text-xs">Consigli</span>
      </router-link>

      <!-- Link Login/Utente -->
      <router-link v-if="!isAuthenticated" to="/login" class="flex flex-col items-center text-gray-600">
        <div class="hover:shadow-xl p-1 rounded">
          <img class="inline-block size-12 rounded-full h-8 w-8" :src="loginImage" alt="" />
        </div>
        <span class="text-xs">Login</span>
      </router-link>
      <router-link v-else to="/user" class="flex flex-col items-center text-gray-600">
        <div class="hover:shadow-xl p-1 rounded">
          <img class="inline-block size-12 rounded-full h-8 w-8" :src="userImage" alt="" />
        </div>
        <span class="text-xs">Utente</span>
      </router-link>
    </nav>
  </span>
</template>

<script>
  import userImage from '@/assets/navbar/user.png';
  import homeImage from '@/assets/navbar/home.png';
  import addImage from '@/assets/navbar/add.png';
  import piggyBankImage from '@/assets/navbar/piggyBank.png';
  import filesImage from '@/assets/navbar/files.png';
  import loginImage from '@/assets/navbar/login.png';

  const isAuthenticated = !!localStorage.getItem('userToken'); // Controllo presenza del token di autenticazione

  export default {
    name: 'BottomNavbar',
    data() {
      return {
        userImage: userImage,
        homeImage: homeImage,
        addImage: addImage,
        piggyBankImage: piggyBankImage,
        filesImage: filesImage,
        loginImage: loginImage,
        isAuthenticated: isAuthenticated,
      };
    },
  };
</script>

<style scoped>
  /* Stili aggiuntivi per la navbar */
  nav {
    border-radius: 15px;
  }
</style>
