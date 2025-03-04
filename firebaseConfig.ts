// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgPD4K3NE-P2OfjChsM6ChQIkxiGefbRA",
  authDomain: "food-app-a9b82.firebaseapp.com",
  projectId: "food-app-a9b82",
  storageBucket: "food-app-a9b82.firebasestorage.app",
  messagingSenderId: "1097933097319",
  appId: "1:1097933097319:web:68408989702388ce6b07c2",
  measurementId: "G-G0S5Z5FBRW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
