<template>
  <div class="fixed bottom-0 left-0 right-0 w-full flex justify-center">
    <nav
      :class="{
        'pb-2': deviceType === 'android' || isLargeScreen,
        'pb-10': deviceType === 'ios-phone',
      }"
      class="bg-white border-t-4 border-gray-200 shadow-lg flex justify-between items-center px-6 lg:w-4/12 w-full relative">
      <!-- Link Home -->
      <router-link to="/" class="flex flex-col items-center" @click="setActiveIcon('home')">
        <div :class="['icon-container', { 'active-icon': activeIcon === 'home' }]">
          <img :src="homeImage" alt="Home" />
          <span v-if="activeIcon === 'home'" class="active-bar"></span>
        </div>
      </router-link>

      <!-- Icona Lista Operazioni -->
      <router-link to="/operations" class="flex flex-col items-center" @click="setActiveIcon('operations')">
        <div :class="['icon-container', { 'active-icon': activeIcon === 'operations' }]">
          <img :src="filesImage" alt="Operations" />
          <span v-if="activeIcon === 'operations'" class="active-bar"></span>
        </div>
      </router-link>

      <!-- Icona + al centro -->
      <router-link to="/addOperation" class="flex flex-col items-center" @click="setActiveIcon('add')">
        <div :class="['icon-container', { 'active-icon': activeIcon === 'add' }]">
          <img :src="addImage" alt="Add" />
          <span v-if="activeIcon === 'add'" class="active-bar"></span>
        </div>
      </router-link>

      <!-- Icona Tips -->
      <router-link to="/tips" class="flex flex-col items-center" @click="setActiveIcon('tips')">
        <div :class="['icon-container', { 'active-icon': activeIcon === 'tips' }]">
          <img :src="piggyBankImage" alt="Tips" />
          <span v-if="activeIcon === 'tips'" class="active-bar"></span>
        </div>
      </router-link>

      <!-- Link Login/Utente -->
      <router-link
        v-show="!isAuthenticated"
        to="/login"
        class="flex flex-col items-center"
        @click="setActiveIcon('login')">
        <div :class="['icon-container', { 'active-icon': activeIcon === 'login' }]">
          <img :src="loginImage" alt="Login" />
          <span v-if="activeIcon === 'login'" class="active-bar"></span>
        </div>
      </router-link>

      <router-link
        v-show="isAuthenticated"
        to="/user"
        class="flex flex-col items-center"
        @click="setActiveIcon('user')">
        <div :class="['icon-container', { 'active-icon': activeIcon === 'user' }]">
          <img :src="userImage" alt="User" />
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
  import { useDeviceStore } from '@/store/device';

  export default {
    name: 'BottomNavbar',
    setup() {
      const authStore = useAuthStore();
      const isAuthenticated = computed(() => authStore.isAuthenticated);
      const activeIcon = ref(''); // Traccia l'icona attiva

      const setActiveIcon = (icon) => {
        activeIcon.value = icon;
      };

      const deviceStore = useDeviceStore();
      const deviceType = computed(() => deviceStore.deviceType);
      const isLargeScreen = computed(() => {
        return window.innerWidth > 1024; // Schermi grandi
      });

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
        deviceType,
        isLargeScreen
      };
    },
  };
</script>

<style scoped>
  .icon-container {
    position: relative;
    padding: 0.9375rem 1rem; /* 0.9375rem = 15px, ridotto di 2px rispetto a 1rem */
    transition: transform 0.3s ease-in-out;
  }
  .icon-container img {
    width: 28px;
    height: 28px;
  }
  .icon-container.active-icon {
    transform: scale(1.1);
    color: #3b82f6; /* Blu per l'icona attiva */
  }
  .active-bar {
    position: absolute;
    top: 1px;
    width: 24px;
    height: 4px;
    background-color: #3b82f6; /* Colore blu per la barretta */
    border-radius: 2px;
  }
</style>
