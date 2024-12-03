// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAs7WbMRBILq54LPpXOgcFYCBGfkByDejk",
    authDomain: "laif-de58c.firebaseapp.com",
    projectId: "laif-de58c",
    storageBucket: "laif-de58c.firebasestorage.app",
    messagingSenderId: "4405356043",
    appId: "1:4405356043:web:53c3aad2e6bb04324f490e",
    measurementId: "G-8T1HY8PY1N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export { auth, analytics };