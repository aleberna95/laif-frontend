
<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-gray-300 shadow-lg flex justify-between items-center px-6 py-2">
    <!-- Link Home -->
    <router-link to="/" class="flex flex-col items-center text-gray-600 hover:text-blue-500">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7m-9 8v-6h4v6m5-6h2a2 2 0 002-2V9a2 2 0 00-.59-1.41L13 2.59a2 2 0 00-2.82 0L3.59 7.59A2 2 0 003 9v2a2 2 0 002 2h2z" />
      </svg>
      <span class="text-xs">Home</span>
    </router-link>

    <!-- Icona + al centro -->
    <div class="flex justify-center items-center bg-blue-500 text-white rounded-full h-12 w-12 p-2 border-8 border-t-8 border-gray-200 shadow-md transform translate-y-[-50%]">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </div>

    <!-- Link Login/Utente -->
    <router-link to="/login" class="flex flex-col items-center text-gray-600 hover:text-blue-500">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 18.364a4.5 4.5 0 01.879-6.364M15 12a4 4 0 100-8 4 4 0 000 8zm2 10a7 7 0 00-14 0h14z" />
      </svg>
      <span class="text-xs">Login</span>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: "BottomNavbar",
};
</script>

<style scoped>
/* Stili aggiuntivi per la navbar */
nav {
  border-radius: 15px;
}
</style>