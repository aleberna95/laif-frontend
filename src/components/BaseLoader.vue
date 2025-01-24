<template>
  <!-- Loading state -->
  <div class="flex flex-col items-center justify-center h-60">
    <svg
      class="animate-spin h-12 w-12 text-gray-400 mb-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 008 8V4a8 8 0 00-8 8z"></path>
    </svg>
    <p class="text-gray-500 text-lg">{{ $t('loading') }}...</p>
  </div>
</template>
