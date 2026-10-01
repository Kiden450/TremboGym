// IMPORTANTE: El usuario deberá reemplazar esta configuración con la suya propia en Firebase Console
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, addDoc, query, where, Timestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDcX61c9tZLKsmsfUvp3AFu5VQqWeZTxlE",
  authDomain: "trembogym-fbaf7.firebaseapp.com",
  projectId: "trembogym-fbaf7",
  storageBucket: "trembogym-fbaf7.firebasestorage.app",
  messagingSenderId: "38989406108",
  appId: "1:38989406108:web:..."
};

// Si la apiKey no es válida, la app podría fallar, 
// pero dejamos esto preparado para que el usuario ponga la suya.
let app, auth, db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.warn("Firebase no está configurado. Añade tus credenciales en js/firebase-config.js", e);
}

export { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, collection, doc, setDoc, getDoc, getDocs, updateDoc, addDoc, query, where, Timestamp };
