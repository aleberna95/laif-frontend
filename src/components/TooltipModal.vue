<template>
  <div class="relative inline-block">
    <!-- Icona info -->
    <button @click="toggleModal" class="focus:outline-none">
      <span class="text-blue-500 hover:text-blue-700 material-icons-outlined">info</span>
    </button>

    <!-- Modal Overlay Teleportato -->
    <teleport to="body">
      <transition name="fade">
        <div
          v-if="isOpen"
          class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          @click.self="closeModal">
          <div class="bg-white rounded-lg shadow-lg p-6 relative max-w-md">
            <!-- Pulsante di chiusura -->
            <button @click="closeModal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl">
              &times;
            </button>
            <!-- Contenuto del modal -->
            <div class="text-center">
              <slot />
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

const toggleModal = () => {
  isOpen.value = !isOpen.value
}

const closeModal = () => {
  isOpen.value = false
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
