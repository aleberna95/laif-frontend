<template>
  <div class="flex items-end justify-center min-h-full">
    <div class="max-w-lg w-full p-6 bg-white rounded-lg shadow-md">
      <BaseBackButton />
      <h1 class="text-3xl font-bold text-gray-800 text-center mb-6">Tipo di Uscita</h1>
      <p class="text-gray-600 text-center mb-8">Scegli tra una spesa singola o una ricorrente.</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- Uscita Singola -->
        <router-link
          to="/addOperation/singleExpense"
          :class="['flex flex-col items-center p-6 border rounded-lg cursor-pointer transition-all duration-300']">
          <div class="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full mb-4">
            <svg
              class="w-8 h-8 text-blue-500"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
            </svg>
          </div>
          <span class="text-lg font-medium text-gray-800">Uscita Singola</span>
        </router-link>

        <!-- Uscita Ricorrente -->
        <router-link
          to="/addOperation/recurringExpense"
          :class="['flex flex-col items-center p-6 border rounded-lg cursor-pointer transition-all duration-300']">
          <div class="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mb-4">
            <svg
              class="w-8 h-8 text-purple-500"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4m16 0l-8 8m8-8l-8-8"></path>
            </svg>
          </div>
          <span class="text-lg font-medium text-gray-800">Uscita Ricorrente</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
  import BaseBackButton from '@/components/BaseBackButton.vue';
  // This script is placeholder for potential future logic.
</script>

<style scoped>
  /* Custom styles can be added here if needed */
</style>
