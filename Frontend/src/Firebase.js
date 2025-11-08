// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOeTLqkvMWXPGRbB7tTNJFPadWZudlLKg",
  authDomain: "truthsync-588ea.firebaseapp.com",
  projectId: "truthsync-588ea",
  storageBucket: "truthsync-588ea.firebasestorage.app",
  messagingSenderId: "1020961155424",
  appId: "1:1020961155424:web:d58cf8ec0664e0b11b9605",
  measurementId: "G-G9DJQ57R8C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider()

export { auth, provider };
