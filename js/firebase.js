import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAXSvF0PdgIDeucJLYFY9CP1h23VQK54jk",
    authDomain: "sir-legacy-version.firebaseapp.com",
    projectId: "sir-legacy-version",
    storageBucket: "sir-legacy-version.firebasestorage.app",
    messagingSenderId: "765977691786",
    appId: "1:765977691786:web:676ed74989a0ad5b5c0f73",
    measurementId: "G-TQK1L6PS7K"
};

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
