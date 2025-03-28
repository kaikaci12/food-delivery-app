// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCgPD4K3NE-P2OfjChsM6ChQIkxiGefbRA",
  authDomain: "food-app-a9b82.firebaseapp.com",
  projectId: "food-app-a9b82",
  storageBucket: "food-app-a9b82.firebasestorage.app",
  messagingSenderId: "1097933097319",
  appId: "1:1097933097319:web:68408989702388ce6b07c2",
  measurementId: "G-G0S5Z5FBRW",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
