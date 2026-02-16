/**
 * Firebase service initialization and configuration
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyCoaq_rBqCY7jGOQO_XaG5q_bCXd-G7cnE",

  authDomain: "ceethaluxe.firebaseapp.com",

  projectId: "ceethaluxe",

  storageBucket: "ceethaluxe.firebasestorage.app",

  messagingSenderId: "259712566708",

  appId: "1:259712566708:web:dd5b1b0ac0b1891bd41ee1",

  measurementId: "G-VHKQXFCZEW"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;
