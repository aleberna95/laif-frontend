<template>
  <div class="fixed bottom-0 left-0 right-0 w-full flex justify-center">
    <nav
      class="bg-white border-t-4 border-gray-200 shadow-lg flex justify-between items-center px-6 lg:w-4/12 w-full pb-10 relative">
      <!-- Link Home -->
      <router-link to="/" class="flex flex-col items-center" @click="setActiveIcon('home')">
        <div :class="['icon-container', { 'active-icon': activeIcon === 'home' }]">
          <img :class="['icon', { 'text-blue-500': activeIcon === 'home' }]" :src="homeImage" alt="Home" />
          <span v-if="activeIcon === 'home'" class="active-bar"></span>
        </div>
      </router-link>

      <!-- Icona Lista Operazioni -->
      <router-link to="/operations" class="flex flex-col items-center" @click="setActiveIcon('operations')">
        <div :class="['icon-container', { 'active-icon': activeIcon === 'operations' }]">
          <img :class="['icon', { 'text-blue-500': activeIcon === 'operations' }]" :src="filesImage" alt="Operations" />
          <span v-if="activeIcon === 'operations'" class="active-bar"></span>
        </div>
      </router-link>

      <!-- Icona + al centro -->
      <router-link to="/addOperation" class="flex flex-col items-center" @click="setActiveIcon('add')">
        <div :class="['icon-container', { 'active-icon': activeIcon === 'add' }]">
          <img :class="['icon', { 'text-blue-500': activeIcon === 'add' }]" :src="addImage" alt="Add" />
          <span v-if="activeIcon === 'add'" class="active-bar"></span>
        </div>
      </router-link>

      <!-- Icona tips -->
      <router-link to="/tips" class="flex flex-col items-center" @click="setActiveIcon('tips')">
        <div :class="['icon-container', { 'active-icon': activeIcon === 'tips' }]">
          <span v-if="activeIcon === 'tips'" class="active-bar"></span>
          <img :class="['icon', { 'text-blue-500': activeIcon === 'tips' }]" :src="piggyBankImage" alt="Tips" />
        </div>
      </router-link>

      <!-- Link Login/Utente -->
      <router-link
        v-show="!isAuthenticated"
        to="/login"
        class="flex flex-col items-center"
        @click="setActiveIcon('login')">
        <div :class="['icon-container', { 'active-icon': activeIcon === 'login' }]">
          <img :class="['icon', { 'text-blue-500': activeIcon === 'login' }]" :src="loginImage" alt="Login" />
          <span v-if="activeIcon === 'login'" class="active-bar"></span>
        </div>
      </router-link>

      <router-link
        v-show="isAuthenticated"
        to="/user"
        class="flex flex-col items-center"
        @click="setActiveIcon('user')">
        <div :class="['icon-container', { 'active-icon': activeIcon === 'user' }]">
          <img :class="['icon', { 'text-blue-500': activeIcon === 'user' }]" :src="userImage" alt="User" />
          <span v-if="activeIcon === 'user'" class="active-bar"></span>
        </div>
      </router-link>
    </nav>
  </div>
</template>

<script>
  import { computed, ref } from 'vue';
  import userImage from '@/assets/navbar/user.png';
  import homeImage from '@/assets/navbar/home.png';
  import addImage from '@/assets/navbar/add.png';
  import piggyBankImage from '@/assets/navbar/piggyBank.png';
  import filesImage from '@/assets/navbar/files.png';
  import loginImage from '@/assets/navbar/login.png';
  import { useAuthStore } from '@/store/auth';

  export default {
    name: 'BottomNavbar',
    setup() {
      const authStore = useAuthStore();
      const isAuthenticated = computed(() => authStore.isAuthenticated);
      const activeIcon = ref(''); // Traccia l'icona attiva

      const setActiveIcon = (icon) => {
        activeIcon.value = icon;
      };

      return {
        isAuthenticated,
        activeIcon,
        setActiveIcon,
        userImage,
        homeImage,
        addImage,
        piggyBankImage,
        filesImage,
        loginImage,
      };
    },
  };
</script>

<style scoped>
  /* Stile per il contenitore dell'icona */
  .icon-container {
    position: relative;
    padding: 1rem;
  }

  .icon {
    width: 28px;
    height: 28px;
    transition: all 0.3s ease-in-out;
  }

  .icon-container.active-icon .icon {
    color: #3b82f6; /* Blu per l'icona attiva */
    transform: scale(1.1);
  }

  .active-bar {
    position: absolute;
    top: 1px; /* Si posiziona appena sopra la barra di navigazione */
    width: 24px;
    height: 4px;
    background-color: #3b82f6; /* Colore blu per la barretta */
    border-radius: 2px;
  }
</style>
