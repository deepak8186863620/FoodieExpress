import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration (v7.20.0 and later)
const firebaseConfig = {
  apiKey: "AIzaSyDINWhsAFc6lpJeOf-FA-yqFgE8pEAcxoA",
  authDomain: "gen-lang-client-0261437563.firebaseapp.com",
  projectId: "gen-lang-client-0261437563",
  storageBucket: "gen-lang-client-0261437563.firebasestorage.app",
  messagingSenderId: "686989145452",
  appId: "1:686989145452:web:78f9ba4dff3991f3a32f49",
  measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
