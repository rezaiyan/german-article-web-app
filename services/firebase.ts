import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// --- IMPORTANT ---
// Replace this with your own Firebase project's configuration.
// You can find this in the Firebase Console:
// Project settings > General > Your apps > Web app > Firebase SDK snippet > Config
const firebaseConfig = {
  apiKey: "AIzaSyBgnLBRRkfEJhhb4-NsFuwOUykoWxM3vdQ",
  authDomain: "lga-app-189c9.firebaseapp.com",
  projectId: "lga-app-189c9",
  storageBucket: "lga-app-189c9.firebasestorage.app",
  messagingSenderId: "69524750862",
  appId: "1:69524750862:web:157ab571631b5174f5325f",
  measurementId: "G-1FF5WVLL99"
};


/**
 * Checks if the Firebase configuration has been filled out.
 * @returns {boolean} True if the config is not using placeholder values.
 */
export const isFirebaseConfigured = (): boolean => {
    // A more robust check to ensure none of the placeholder values are present
    const placeholderValues = [
        "YOUR_API_KEY",
        "YOUR_AUTH_DOMAIN",
        "YOUR_PROJECT_ID",
        "YOUR_STORAGE_BUCKET",
        "YOUR_MESSAGING_SENDER_ID",
        "YOUR_APP_ID",
        "YOUR_MEASUREMENT_ID"
    ];
    return !Object.values(firebaseConfig).some(value => placeholderValues.includes(value) || value === "");
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