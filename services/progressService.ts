import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { ProgressData } from '../types';

const getTodaysDateString = (): string => {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

const isYesterday = (dateString: string): boolean => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return dateString === yesterday.toISOString().split('T')[0];
}

export const progressService = {
    /**
     * Fetches the progress data for the currently logged-in user from Firestore.
     * If no data exists (i.e., for a new user), it returns a default structure.
     */
    getProgressData: async (): Promise<ProgressData | null> => {
        const user = auth?.currentUser;
        if (!user || !db) return null;

        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as ProgressData;
        } else {
            // Return default data for a new user, which will be saved on first practice.
            return {
                wordsLearned: 0,
                articlesMastered: 0,
                streak: 0,
                lastPracticed: null,
                streakDates: [],
            };
        }
    },

    /**
     * Records that the user has learned a new word and updates their streak in Firestore.
     * @param totalWordsLearned - The new total count of words learned after the current session.
     */
    recordWordLearned: async (totalWordsLearned: number): Promise<void> => {
        const user = auth?.currentUser;
        if (!user || !db) return;

        const docRef = doc(db, 'users', user.uid);
        const currentProgress = await progressService.getProgressData();
        if (!currentProgress) return;

        const today = getTodaysDateString();
        let newStreak = currentProgress.streak;

        // Only update streak if they haven't practiced today
        if (currentProgress.lastPracticed !== today) {
             if (currentProgress.lastPracticed && isYesterday(currentProgress.lastPracticed)) {
                newStreak += 1; // Continue the streak
            } else {
                newStreak = 1; // Start a new streak
            }

            // Atomically add the new date to the streakDates array
            await updateDoc(docRef, {
                streakDates: arrayUnion(today)
            }).catch(async (e) => {
                 // If document doesn't exist, set it first.
                 await setDoc(docRef, { streakDates: [today] }, { merge: true });
            });
        }
        
        const updatedData: Partial<ProgressData> = {
            wordsLearned: totalWordsLearned,
            articlesMastered: Math.floor(totalWordsLearned / 3), // Example logic: master 1 article per 3 words
            streak: newStreak,
            lastPracticed: today,
        };

        // Use setDoc with merge to create or update the document
        await setDoc(docRef, updatedData, { merge: true });
    }
};