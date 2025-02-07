import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAEfxO9C3lNjod2fG9Z1cQIUk6nNRDCic8",
  authDomain: "praticorte.firebaseapp.com",
  projectId: "praticorte",
  storageBucket: "praticorte.firebasestorage.app",
  messagingSenderId: "22431510274",
  appId: "1:22431510274:web:9c40859c6874cd9d1f1c1b",
  measurementId: "G-LEMCGQKV2X"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
