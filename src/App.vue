<template>
  <div class="p-8">
    <p class="font-bold text-lg mb-8">Buongiorno Fefina</p>
    <router-view />
    <BottomNavbar />
  </div>
</template>

<script>
  import BottomNavbar from '@/components/layout/BottomNavbar.vue';

  export default {
    name: 'App',
    components: {
      BottomNavbar,
    },
  };
</script>

<style>
  body {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }
</style>
