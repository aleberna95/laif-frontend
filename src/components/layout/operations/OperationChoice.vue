<template>
  <div class="flex items-center justify-center">
    <div class="max-w-lg w-full p-6 bg-white rounded-lg shadow-md">
      <h1 class="text-3xl font-bold text-gray-800 text-center mb-6">Cosa vuoi aggiungere?</h1>
      <p class="text-gray-600 text-center mb-8">Scegli tra un'entrata o un'uscita per continuare.</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- Entrata -->
        <router-link
          to="/addOperation/income"
          :class="['flex flex-col items-center p-6 border rounded-lg cursor-pointer transition-all duration-300']">
          <div class="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mb-4">
            <svg
              class="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
            </svg>
          </div>
          <span class="text-lg font-medium text-gray-800">Entrata</span>
        </router-link>

        <!-- Uscita -->
        <router-link
          to="/addOperation/expenseChoice"
          :class="['flex flex-col items-center p-6 border rounded-lg cursor-pointer transition-all duration-300']">
          <div class="w-16 h-16 flex items-center justify-center bg-red-100 rounded-full mb-4">
            <svg
              class="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4m16 0l-8 8m8-8l-8-8"></path>
            </svg>
          </div>
          <span class="text-lg font-medium text-gray-800">Uscita</span>
        </router-link>
      </div>
    </div>
  </div>
</template>
