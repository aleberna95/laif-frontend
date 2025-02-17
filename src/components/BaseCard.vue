<template>
  <div class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300">
    <h3 class="text-sm text-gray-500">{{ $t(title) }}</h3>
    <slot></slot>
  </div>
</template>

<script setup>
  import { defineProps } from 'vue';

  defineProps({
    title: String,
  });
</script>
