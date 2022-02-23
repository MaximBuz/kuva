// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZ7EKgkA7PQPFLcVSoF4nSOBMdWcj-ZVU",
  authDomain: "kuvats-2e148.firebaseapp.com",
  projectId: "kuvats-2e148",
  storageBucket: "kuvats-2e148.appspot.com",
  messagingSenderId: "149676819028",
  appId: "1:149676819028:web:2dbd81db2878cfaf0d63c1",
  measurementId: "G-4L925JZPPY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


// Exporting
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export default app;