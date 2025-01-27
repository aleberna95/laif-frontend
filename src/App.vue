<template>
  <!-- Container a piena altezza -->
  <!-- grid-rows-[auto_minmax(0,1fr)_auto] = 3 righe: header | main flexibile | footer -->
  <div class="grid grid-rows-[auto_minmax(0,1fr)_auto] h-screen w-full bg-gray-50">
    <!-- Header in alto -->
    <header class="bg-gray-200 p-4 max-h-24">
      <div class="grid grid-cols-3 gap-2">
        <div class="mt-4 flex justify-start">
          <div>
            <h1 class="font-bold">Icona</h1>
            <p class="text-xs">Nome App</p>
          </div>
        </div>
        <div class="mt-8 flex justify-center">Spendi troppo</div>
        <div class="mt-4 flex justify-end">
          <h1 class="font-bold">Icona</h1>
        </div>
      </div>
    </header>

    <!-- Main scorrevole -->
    <!-- minmax(0,1fr) fa sì che questa riga riempia lo spazio disponibile -->
    <!-- overflow-y-auto permette di scorrere il contenuto qui dentro -->
    <main class="overflow-y-auto p-4">
      <!-- Le tue pagine (router-view) -->
      <router-view />
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
  import { useDeviceStore } from '@/store/device';

  export default {
    name: 'App',
    components: {
      BottomNavbar,
    },
    setup() {
      // Rileva il dispositivo e salva il risultato
      const deviceStore = useDeviceStore();
      deviceStore.detectDevice();

      const isMobileiOS = deviceStore.isMobileiOS;

      return {
        isMobileiOS,
      };
    },
  };
</script>
