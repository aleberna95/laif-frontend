<template>
  <div class="flex justify-center w-screen h-screen overflow-hidden">
    <div class="h-full w-full md:w-6/12 flex flex-col">
      <!-- Contenuto Scrollabile con barra nascosta, termina sopra la navbar -->
      <div
        class="flex-1 overflow-y-auto hide-scrollbar rounded-lg min-h-full bg-color-primary flex items-start justify-center">
        <router-view />
      </div>
    </div>
    <!-- Navbar Fissa in Basso -->
    <BottomNavbar class="fixed bottom-0 left-0" />
  </div>
</template>

<script>
  import BottomNavbar from '@/components/layout/BottomNavbar.vue';
  import { useDeviceStore } from '@/store/device';

  export default {
    name: 'App',
    components: {
      BottomNavbar,
    },

    created() {
      const deviceStore = useDeviceStore();
      deviceStore.detectDevice();
    },
  };
</script>

<style scoped>
  /* Classe per Nascondere la Barra di Scorrimento */
  .hide-scrollbar {
    -ms-overflow-style: none; /* Nasconde la barra di scorrimento su IE e Edge */
    scrollbar-width: none; /* Nasconde la barra di scorrimento su Firefox */
  }

  .hide-scrollbar::-webkit-scrollbar {
    display: none; /* Nasconde la barra di scorrimento su Chrome, Safari, Opera */
  }
</style>
