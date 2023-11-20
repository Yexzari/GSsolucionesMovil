// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCP6eUU6UueorEfCX8RauWoR1_Tz7yd_P0",
  authDomain: "puestags.firebaseapp.com",
  projectId: "puestags",
  storageBucket: "puestags.appspot.com",
  messagingSenderId: "52670231863",
  appId: "1:52670231863:web:2af993f1d75a5a7de916b2"
};

// Initialize Firebase
console.log('Inicializando Firebase...');
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

console.log('Firebase inicializado correctamente.');