// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqKZDuq0-Go4N6JsXmhWVMFFtGPqR-Zc0",
  authDomain: "gammafilms-dfc2c.firebaseapp.com",
  projectId: "gammafilms-dfc2c",
  storageBucket: "gammafilms-dfc2c.appspot.com",
  messagingSenderId: "52389525610",
  appId: "1:52389525610:web:0cddcb7c917c5f1153f213",
  measurementId: "G-VFYR2NR1RN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const firestore = getFirestore(app);

export { app, analytics, firestore };
