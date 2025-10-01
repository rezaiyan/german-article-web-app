import {
    onAuthStateChanged as onFirebaseAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut as firebaseSignOut,
    User as FirebaseUser
} from 'firebase/auth';
import type { User } from '../types';
import { auth } from './firebase';

const provider = new GoogleAuthProvider();

// Maps a Firebase User object to our app's User type for consistency
const mapFirebaseUser = (firebaseUser: FirebaseUser): User => {
    return {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || 'Anonymous',
        photoURL: firebaseUser.photoURL || '',
    };
};

const authService = {
    /**
     * Initiates the Google Sign-In process using a popup window.
     * @returns A promise that resolves with the app's User object.
     */
    signIn: async (): Promise<User> => {
        if (!auth) throw new Error("Firebase is not configured.");
        const result = await signInWithPopup(auth, provider);
        return mapFirebaseUser(result.user);
    },

    /**
     * Signs the current user out.
     * @returns A promise that resolves when sign-out is complete.
     */
    signOut: (): Promise<void> => {
        if (!auth) return Promise.resolve();
        return firebaseSignOut(auth);
    },

    /**
     * Listens for changes in the authentication state (sign-in/sign-out).
     * @param callback - The function to call when the auth state changes.
     * @returns An unsubscribe function to clean up the listener.
     */
    onAuthStateChanged: (callback: (user: User | null) => void): (() => void) => {
        if (!auth) {
            callback(null);
            return () => {}; // Return a no-op unsubscribe function
        }
        return onFirebaseAuthStateChanged(auth, (firebaseUser) => {
            const user = firebaseUser ? mapFirebaseUser(firebaseUser) : null;
            callback(user);
        });
    },
};

export { authService };