// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzNcTMB2kdO6gJYNQfq-RrJJlf0h-Fvbk",
  authDomain: "meged-157c9.firebaseapp.com",
  projectId: "meged-157c9",
  storageBucket: "meged-157c9.appspot.com", // תיקון! היה כתוב בטעות .firebasestorage.app
  messagingSenderId: "613800740652",
  appId: "1:613800740652:web:7dfaa4a49336636141ce89",
  measurementId: "G-8RY8JCPSE1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // ⬅️ זה מה שחסר

export { app, analytics, db }; // ⬅️ חשוב מאוד לייצא גם את db
