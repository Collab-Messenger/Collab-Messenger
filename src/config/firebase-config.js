// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAUgdNAh-2Dtkn22kRZGaowaKv2qgZeL3A",
    authDomain: "next-discord-33a46.firebaseapp.com",
    databaseURL: "https://next-discord-33a46-default-rtdb.firebaseio.com",
    projectId: "next-discord-33a46",
    storageBucket: "next-discord-33a46.firebasestorage.app",
    messagingSenderId: "576739815121",
    appId: "1:576739815121:web:84d52f48eea0c736539ff0",
    measurementId: "G-490DQ261FZ"
  };
  
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// the Firebase authentication handler
export const auth = getAuth(app);
// the Realtime Database handler
export const db = getDatabase(app);
