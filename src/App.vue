<template>
  <div id="app">
    <!-- Navbar o altre componenti di layout comuni possono essere aggiunte qui -->
    <router-view />
    <!-- Router View renderizzerà le pagine basate sulle rotte definite -->
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
/* Stili generici per l'app */
body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
}
#app {
  text-align: center;
}
</style>
