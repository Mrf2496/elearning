// Import the functions you need from the SDKs you need
// FIX: Separated value and type imports to resolve module resolution errors with Firebase v9.
import { initializeApp, getApps, getApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import type { Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firestore";
import { getStorage } from "firebase/storage";
import type { FirebaseStorage } from "firebase/storage";
import { firebaseConfig as firebaseConfigFromEnv } from './env';

// Your web app's Firebase configuration is now imported from env.ts
const firebaseConfig = firebaseConfigFromEnv;

export const isFirebaseConfigured = (): boolean => {
    // Check if the essential Firebase config value is provided and not a placeholder.
    return !!firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('TU_');
};

interface FirebaseServices {
    app: FirebaseApp;
    auth: Auth;
    db: Firestore;
    storage: FirebaseStorage;
}

const initializeFirebase = (): FirebaseServices | null => {
    if (isFirebaseConfigured()) {
        try {
            const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
            return {
                app,
                auth: getAuth(app),
                db: getFirestore(app),
                storage: getStorage(app),
            };
        } catch (e) {
            console.error("Error al inicializar Firebase:", e);
            return null;
        }
    }
    console.warn("Configuración de Firebase incompleta. Revisa el archivo firebase/env.ts");
    return null;
};

// Eagerly initialize Firebase services when the module is loaded.
// This prevents race conditions from multiple components trying to initialize at the same time.
const services: FirebaseServices | null = initializeFirebase();

export const getFirebaseServices = (): FirebaseServices | null => {
    return services;
};