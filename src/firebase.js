// Import the functions you need from the SDKs you need

import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCI6h6VNKZflR01HfpH6Af4K5wcTpXe5yc",
  authDomain: "boutique-3279b.firebaseapp.com",
  projectId: "boutique-3279b",
  storageBucket: "boutique-3279b.firebasestorage.app",
  messagingSenderId: "464332347592",
  appId: "1:464332347592:web:3b3978c69803fb8f462dfd",
  measurementId: "G-CL3TXL8LX3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
