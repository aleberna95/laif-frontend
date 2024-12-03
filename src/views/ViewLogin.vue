<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <div class="w-full max-w-xs">
      <h2 class="text-center text-xl mb-4">{{ isRegistering ? 'Registrazione' : 'Login' }}</h2>

      <!-- Login/Registrazione con Email e Password -->
      <form
        @submit.prevent="isRegistering ? registerWithEmailPassword : loginWithEmailPassword"
        class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
          <input
            v-model="email"
            id="email"
            type="email"
            placeholder="Inserisci la tua email"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
          <input
            v-model="password"
            id="password"
            type="password"
            placeholder="Inserisci la tua password"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            required />
        </div>
        <div class="flex items-center justify-between">
          <button
            v-show="isRegistering"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            @click="registerWithEmailPassword">
            Registrati
          </button>
          <button
            v-show="!isRegistering"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            @click="loginWithEmailPassword">
            Accedi
          </button>
        </div>
      </form>

      <!-- Toggle Login/Registrazione -->
      <button @click="toggleAuthMode" class="text-blue-500 hover:underline mt-2">
        {{ isRegistering ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati' }}
      </button>

      <!-- Login con Google -->
      <button
        @click="loginWithGoogle"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
        type="button">
        Accedi con Google
      </button>
    </div>
  </div>
</template>

<script>
import { auth } from "@/services/firebase";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export default {
  name: "ViewLogin",
  data() {
    return {
      email: "",
      password: "",
      isRegistering: false,
    };
  },
  created() {
    // Controlla se l'utente è già autenticato
    const token = localStorage.getItem('userToken');
    if (token) {
      // Se l'utente è già autenticato, reindirizza alla home
      this.$router.push('/');
    }
  },
  methods: {
    async loginWithGoogle() {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const token = await user.getIdToken();
        console.log("Login riuscito:", user);
        console.log("Token ottenuto:", token);
        this.handleUserLogin(user, token); // Salva stato e redirigi l'utente
      } catch (error) {
        console.error("Errore durante il login con Google:", error);
      }
    },
    async loginWithEmailPassword() {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        const token = await user.getIdToken();
        console.log("Login con email e password riuscito:", user);
        console.log("Token ottenuto:", token);
        this.handleUserLogin(user, token); // Salva stato e redirigi l'utente
      } catch (error) {
        console.error("Errore durante il login con email e password:", error);
      }
    },
    async registerWithEmailPassword() {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        const token = await user.getIdToken();
        console.log("Registrazione con email e password riuscita:", user);
        console.log("Token ottenuto:", token);
        this.handleUserLogin(user, token); // Salva stato e redirigi l'utente
      } catch (error) {
        console.error("Errore durante la registrazione con email e password:", error);
      }
    },
    toggleAuthMode() {
      this.isRegistering = !this.isRegistering;
    },
    handleUserLogin(user, token) {
      // Salva i dettagli dell'utente e il token nel tuo stato globale o in localStorage/sessionStorage
      localStorage.setItem('userToken', token);
      localStorage.setItem('userEmail', user.email);
      // A questo punto, puoi reindirizzare l'utente alla home o alla pagina che desideri
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
/* Stili per il componente di login */
</style>
