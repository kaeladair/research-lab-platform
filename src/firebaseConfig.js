// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCGjmXBOXOoY4GvAgm4_QuY1i9IP-mnqlw",
    authDomain: "lab-portal-f239e.firebaseapp.com",
    projectId: "lab-portal-f239e",
    storageBucket: "lab-portal-f239e.appspot.com",
    messagingSenderId: "123062629381",
    appId: "1:123062629381:web:5a01ce6146519b8baf986c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
