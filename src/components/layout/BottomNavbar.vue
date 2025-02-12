<template>
  <!-- Contenitore fisso in basso e centrato -->
  <nav class="bg-white border-t-4 border-gray-200 shadow-lg flex justify-between items-center px-6 w-full lg:w-2/4">
    <!-- Link Home -->
    <router-link to="/" class="flex flex-col items-center" @click="setActiveIcon('home')">
      <div
        :class="[
          'relative px-4 py-3.5 transition-transform duration-300 ease-in-out',
          activeIcon === 'home' ? 'scale-110 text-blue-500' : '',
        ]">
        <img :src="homeImage" alt="Home" class="w-7 h-7" />
        <!-- Barretta blu se attivo -->
        <span v-if="activeIcon === 'home'" class="ml-0.5 absolute top-1 w-6 h-1 bg-blue-500 rounded-sm"></span>
      </div>
    </router-link>

    <!-- Link Operations -->
    <router-link to="/operations" class="flex flex-col items-center" @click="setActiveIcon('operations')">
      <div
        :class="[
          'relative px-4 py-3.5 transition-transform duration-300 ease-in-out',
          activeIcon === 'operations' ? 'scale-110 text-blue-500' : '',
        ]">
        <img :src="filesImage" alt="Operations" class="w-7 h-7" />
        <span v-if="activeIcon === 'operations'" class="ml-0.5 absolute top-1 w-6 h-1 bg-blue-500 rounded-sm"></span>
      </div>
    </router-link>

    <!-- Link Add -->
    <router-link to="/addOperation" class="flex flex-col items-center" @click="setActiveIcon('addOperation')">
      <div
        :class="[
          'relative px-4 py-3.5 transition-transform duration-300 ease-in-out',
          activeIcon === 'addOperation' ? 'scale-110 text-blue-500' : '',
        ]">
        <img :src="addImage" alt="Add" class="w-7 h-7" />
        <span v-if="activeIcon === 'addOperation'" class="ml-0.5 absolute top-1 w-6 h-1 bg-blue-500 rounded-sm"></span>
      </div>
    </router-link>

    <!-- Link Tips -->
    <router-link to="/tips" class="flex flex-col items-center" @click="setActiveIcon('tips')">
      <div
        :class="[
          'relative px-4 py-3.5 transition-transform duration-300 ease-in-out',
          activeIcon === 'tips' ? 'scale-110 text-blue-500' : '',
        ]">
        <img :src="piggyBankImage" alt="Tips" class="w-7 h-7" />
        <span v-if="activeIcon === 'tips'" class="ml-0.5 absolute top-1 w-6 h-1 bg-blue-500 rounded-sm"></span>
      </div>
    </router-link>

    <!-- Link Login se non autenticato -->
    <router-link
      v-show="!isAuthenticated"
      to="/login"
      class="flex flex-col items-center"
      @click="setActiveIcon('login')">
      <div
        :class="[
          'relative px-4 py-3.5 transition-transform duration-300 ease-in-out',
          activeIcon === 'user' ? 'scale-110 text-blue-500' : '',
        ]">
        <img :src="loginImage" alt="Login" class="w-7 h-7" />
        <span v-if="activeIcon === 'login'" class="ml-0.5 absolute top-1 w-6 h-1 bg-blue-500 rounded-sm"></span>
      </div>
    </router-link>

    <!-- Link User se autenticato -->
    <router-link v-show="isAuthenticated" to="/user" class="flex flex-col items-center" @click="setActiveIcon('user')">
      <div
        :class="[
          'relative px-4 py-3.5 transition-transform duration-300 ease-in-out',
          activeIcon === 'user' ? 'scale-110 text-blue-500' : '',
        ]">
        <img :src="userImage" alt="User" class="w-7 h-7" />
        <span v-if="activeIcon === 'user'" class="ml-0.5 absolute top-1 w-6 h-1 bg-blue-500 rounded-sm"></span>
      </div>
    </router-link>
  </nav>
</template>

<script>
  import { computed, onMounted, ref } from 'vue';
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
      // Store per l'autenticazione
      const authStore = useAuthStore();
      const isAuthenticated = computed(() => authStore.isAuthenticated);

      // Track dell'icona attiva
      const activeIcon = ref('');

      onMounted(() => {
        // prendo la prima parte della route per settare l'icona attiva
        const route = window.location.hash.split('/')[1];
        setActiveIcon(route);
      });

      const setActiveIcon = (icon) => {
        activeIcon.value = icon;
      };

      // Device store per sapere se siamo su iOS / Android / Desktop
      const deviceStore = useDeviceStore();
      const deviceType = computed(() => deviceStore.deviceType);

      // Distanza dal fondo dinamica
      const bottomClass = computed(() => {
        if (deviceType.value === 'ios-phone') {
          // Più spazio se iOS, es. bottom-10
          return 'bottom-10';
        }
        // Altrimenti, Android o desktop
        return 'bottom-2';
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
        bottomClass,
      };
    },
  };
</script>
