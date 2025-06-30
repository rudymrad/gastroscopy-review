// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC5SLLabXtCuse1J9QCXnWphBFvT1jiJwg",
  authDomain: "gastroscopy-review.firebaseapp.com",
  projectId: "gastroscopy-review",
  storageBucket: "gastroscopy-review.appspot.com",
  messagingSenderId: "908529828085",
  appId: "1:908529828085:web:d301728b7c612c90f245bc",
  measurementId: "G-70MF359LG"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);