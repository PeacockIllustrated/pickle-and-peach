// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyH4oRxSpnCoeopZqWdcxNyOKpZIarWE8",
  authDomain: "pickle-peach.firebaseapp.com",
  projectId: "pickle-peach",
  storageBucket: "pickle-peach.appspot.com", // Corrected domain
  messagingSenderId: "1080004639045",
  appId: "1:1080004639045:web:c55eaf1ae907a196f3a62c",
  measurementId: "G-CE8NLVDWY0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);