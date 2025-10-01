import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// --- IMPORTANT ---
// Replace this with your own Firebase project's configuration.
// You can find this in the Firebase Console:
// Project settings > General > Your apps > Web app > Firebase SDK snippet > Config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};


/**
 * Checks if the Firebase configuration has been filled out.
 * @returns {boolean} True if the config is not using placeholder values.
 */
export const isFirebaseConfigured = (): boolean => {
    // Check if all required environment variables are present and not empty
    const requiredEnvVars = [
        'VITE_FIREBASE_API_KEY',
        'VITE_FIREBASE_AUTH_DOMAIN',
        'VITE_FIREBASE_PROJECT_ID',
        'VITE_FIREBASE_STORAGE_BUCKET',
        'VITE_FIREBASE_MESSAGING_SENDER_ID',
        'VITE_FIREBASE_APP_ID'
    ];
    
    return requiredEnvVars.every(envVar => {
        const value = import.meta.env[envVar];
        return value !== undefined && value !== "" && value !== null;
    });
};


// We will export these as late-initialized variables
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

/**
 * Initializes the Firebase app and services.
 * Throws an error if configuration is missing or invalid.
 */
export const initializeFirebase = () => {
    if (app) {
        // Already initialized
        return;
    }

    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
    } catch (error) {
        console.error("Firebase initialization failed:", error);
        // Re-throw a more specific error to be caught in the UI
        throw new Error("Firebase initialization failed. Please check your firebaseConfig object in services/firebase.ts for correctness.");
    }
}

// Export the service instances. They will be null until initializeFirebase() is called.
export { auth, db };