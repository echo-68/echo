import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAB3WVWK64E3EXc8M0jsuW4tXfqjL96Fl0",
  authDomain: "echo-68.firebaseapp.com",
  projectId: "echo-68",
  storageBucket: "echo-68.firebasestorage.app",
  messagingSenderId: "859967375795",
  appId: "1:859967375795:web:4dd16fbd36a58ac9e463c6",
  measurementId: "G-QNVD0RS0NS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);
export { auth, provider };
