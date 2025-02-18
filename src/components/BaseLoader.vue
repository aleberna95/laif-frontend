<template>
  <div class="min-w-full flex flex-col items-center justify-center h-60">
    <div class="flex space-x-2">
      <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounceDot"></div>
      <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounceDot delay-200"></div>
      <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounceDot delay-400"></div>
    </div>
    <p class="text-gray-500 text-lg mt-4">{{ $t('loading') }}...</p>
  </div>
</template>

<style scoped>
@keyframes bounceDot {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.animate-bounceDot {
  animation: bounceDot 1.4s infinite ease-in-out both;
}

.delay-200 {
  animation-delay: 0.2s;
}

.delay-400 {
  animation-delay: 0.4s;
}
</style>
