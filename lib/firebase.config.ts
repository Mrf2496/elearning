
import { initializeApp, getApps, getApp } from 'firebase/app';
// Import the functions to get the services
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// It's good practice to also import the service modules for their side effects,
// especially in environments that might have race conditions with module loading.
import 'firebase/auth';
import 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyB76q9wrm9Be-7mYSXedY42xC2_ArO-BKU",
  authDomain: "capacitacion-sarlaft-536aa.firebaseapp.com",
  projectId: "capacitacion-sarlaft-536aa",
  storageBucket: "capacitacion-sarlaft-536aa.firebasestorage.app",
  messagingSenderId: "106293326056",
  appId: "1:106293326056:web:bbd273c93316cdafb7995d",
  measurementId: "G-39QLFE58P9"
};

// A robust way to initialize: check if apps are already initialized.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Get the services, now guaranteed to be registered.
export const auth = getAuth(app);
export const db = getFirestore(app);
