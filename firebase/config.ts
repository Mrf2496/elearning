// Import the functions you need from the SDKs you need
// FIX: Separated value and type imports to resolve module resolution errors with Firebase v9.
import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Your web app's Firebase configuration
// Use environment variables for security and flexibility.
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};


export const isFirebaseConfigured = (): boolean => {
    // Check if the essential Firebase config value is provided.
    return !!firebaseConfig.apiKey;
};

interface FirebaseServices {
    app: FirebaseApp;
    auth: Auth;
    db: Firestore;
    storage: FirebaseStorage;
}

let services: FirebaseServices | null = null;

export const getFirebaseServices = (): FirebaseServices | null => {
    if (services) {
        return services;
    }

    if (isFirebaseConfigured()) {
        try {
            const app = initializeApp(firebaseConfig);
            services = {
                app,
                auth: getAuth(app),
                db: getFirestore(app),
                storage: getStorage(app),
            };
            return services;
        } catch (e) {
            console.error("Error al inicializar Firebase:", e);
            return null;
        }
    }
    
    // Firebase is not configured
    return null;
};
