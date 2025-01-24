<template>
  <div class="flex flex-col items-center justify-center h-full p-4">
    <div class="w-full max-w-sm bg-white shadow-xl rounded-lg overflow-hidden p-8">
      <h2 class="text-center text-2xl font-semibold text-gray-800 mb-6">
        {{ isRegistering ? 'Crea il tuo Account' : 'Accedi al tuo Account' }}
      </h2>
      <!-- Login/Registrazione con Email e Password -->
      <form @submit.prevent="isRegistering ? registerWithEmailPassword : loginWithEmailPassword" class="space-y-6">
        <div class="relative">
          <label class="block text-gray-700 text-sm font-bold mb-1" for="email">Email</label>
          <input
            v-model="email"
            id="email"
            type="email"
            placeholder="Inserisci la tua email"
            class="shadow-lg appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required />
          <span class="absolute inset-y-0 right-3 flex items-center text-gray-400">
            <i class="fas fa-envelope"></i>
            <!-- Icona email -->
          </span>
        </div>

        <div class="relative">
          <label class="block text-gray-700 text-sm font-bold mb-1" for="password">Password</label>
          <input
            v-model="password"
            id="password"
            type="password"
            placeholder="Inserisci la tua password"
            class="shadow-lg appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required />
          <span class="absolute inset-y-0 right-3 flex items-center text-gray-400">
            <i class="fas fa-lock"></i>
            <!-- Icona password -->
          </span>
        </div>

        <div class="flex justify-center mt-4">
          <button
            v-if="isRegistering"
            class="w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-3 rounded-md shadow-md hover:shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            type="submit"
            @click="registerWithEmailPassword">
            Registrati
          </button>
          <button
            v-else
            class="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold py-3 rounded-md shadow-md hover:shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="submit"
            @click="loginWithEmailPassword">
            Accedi
          </button>
        </div>
      </form>

      <!-- Link per il reset della password -->
      <div class="text-center mt-4">
        <button @click="sendPasswordResetEmail" class="text-blue-500 hover:underline focus:outline-none">
          Password dimenticata?
        </button>
      </div>

      <!-- Toggle Login/Registrazione -->
      <div class="text-center mt-6">
        <button @click="toggleAuthMode" class="text-blue-500 hover:underline focus:outline-none">
          {{ isRegistering ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati' }}
        </button>
      </div>

      <!-- Login con Google -->
      <div class="mt-6 text-center">
        <button
          @click="loginWithGoogle"
          class="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-600 font-semibold py-3 rounded-md shadow-md hover:bg-gray-100 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <img src="https://img.icons8.com/color/24/000000/google-logo.png" class="mr-2" alt="Google logo" />
          <!-- Icona Google -->
          Accedi con Google
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import { auth } from '@/services/firebase';
  import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
  } from 'firebase/auth';
  import { useAuthStore } from '@/store/auth';

  export default {
    name: 'ViewLogin',
    data() {
      return {
        email: '',
        password: '',
        isRegistering: false,
      };
    },
    created() {
      const authStore = useAuthStore();
      authStore.initializeAuth();
      if (authStore.isAuthenticated) {
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
          const refreshToken = user.refreshToken;

          console.log('Login riuscito:', user);
          console.log('Token ottenuto:', token);
          console.log('Refresh token:', refreshToken);

          this.handleUserLogin(user, token, refreshToken);
        } catch (error) {
          console.error('Errore durante il login con Google:', error);
        }
      },
      async loginWithEmailPassword() {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
          const user = userCredential.user;
          const token = await user.getIdToken();
          const refreshToken = user.refreshToken;

          console.log('Login con email e password riuscito:', user);
          console.log('Token ottenuto:', token);
          console.log('Refresh token:', refreshToken);

          this.handleUserLogin(user, token, refreshToken);
        } catch (error) {
          console.error('Errore durante il login con email e password:', error);
        }
      },
      async registerWithEmailPassword() {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
          const user = userCredential.user;
          const token = await user.getIdToken();
          const refreshToken = user.refreshToken;

          console.log('Registrazione con email e password riuscita:', user);
          console.log('Token ottenuto:', token);
          console.log('Refresh token:', refreshToken);

          this.handleUserLogin(user, token, refreshToken);
        } catch (error) {
          console.error('Errore durante la registrazione con email e password:', error);
        }
      },
      async sendPasswordResetEmail() {
        if (!this.email) {
          alert('Inserisci la tua email per ricevere il link di reset della password.');
          return;
        }
        try {
          await sendPasswordResetEmail(auth, this.email);
          alert('Email di reset della password inviata. Controlla la tua casella di posta.');
        } catch (error) {
          console.error("Errore durante l'invio dell'email di reset della password:", error);
          alert("Si è verificato un errore durante l'invio della email. Riprova più tardi.");
        }
      },
      toggleAuthMode() {
        this.isRegistering = !this.isRegistering;
      },
      async handleUserLogin(user, token, refreshToken) {
        const authStore = useAuthStore();
        authStore.login(user, token, refreshToken);
        this.$router.push('/');
      },
    },
  };
</script>

<style scoped>
  /* Stili per il componente di login */
</style>
