<template>
  <!-- Container a piena altezza -->
  <!-- grid-rows-[auto_minmax(0,1fr)_auto] = 3 righe: header | main flexibile | footer -->
  <div class="grid grid-rows-[auto_minmax(0,1fr)_auto] h-screen w-full bg-gray-50">
    <!-- Header in alto -->
    <header class="px-4 pb-2 max-h-18 rounded-b-lg bg-white">
      <div class="grid grid-cols-6 gap-2">
        <div class="flex justify-start col-span-1">
          <!-- 
          <div>
            <h1 class="font-bold">Icona</h1>
            <p class="text-xs">Nome App</p>
          </div> -->
        </div>
        <div class="flex justify-center col-span-4">
          <p class="font-bold">{{ appTitle }}</p>
        </div>
        <div class="flex justify-end col-span-1">
          <!-- icona notifiche di materialicons-->
<!--           <span class="material-icons-outlined">notifications</span>
 -->        </div>
      </div>
    </header>

    <!-- Main scorrevole -->
    <!-- minmax(0,1fr) fa sì che questa riga riempia lo spazio disponibile -->
    <!-- overflow-y-auto permette di scorrere il contenuto qui dentro -->
    <main class="flex justify-center overflow-y-auto p-4">
      <div class="md:w-3/4">
        <!-- Le tue pagine (router-view) -->
        <router-view />
      </div>
    </main>

    <!-- Footer in basso, barra di navigazione -->
    <!-- NOTA: niente position: fixed. Sarà un normale blocco in flow -->
    <footer class="flex justify-center">
      <BottomNavbar :class="{ 'pb-10': isMobileiOS, 'pb-2': !isMobileiOS }" />
    </footer>
  </div>
</template>

<script>
  import BottomNavbar from '@/components/layout/BottomNavbar.vue';
  import { computed } from 'vue';
  import { useDeviceStore } from '@/store/device';
  import { useUserStore } from './store/user';
  import { useGlobalStore } from './store/global';

  export default {
    name: 'App',
    components: {
      BottomNavbar,
    },
    setup() {
      const globalStore = useGlobalStore();
      const appTitle = computed(() => {
        return globalStore.currentPage;
      });
      const userStore = useUserStore();
      userStore.getUser();
      // Rileva il dispositivo e salva il risultato
      const deviceStore = useDeviceStore();
      deviceStore.detectDevice();

      const isMobileiOS = deviceStore.isMobileiOS;

      return {
        isMobileiOS,
        appTitle,
      };
    },
  };
</script>
