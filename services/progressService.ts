import { localDatabase } from './localDatabase';
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
     * Fetches the progress data from local database.
     * If no data exists (i.e., for a new user), it returns a default structure.
     */
    getProgressData: async (): Promise<ProgressData | null> => {
        try {
            const progressData = await localDatabase.getProgress();
            return progressData;
        } catch (error) {
            console.error('Failed to get progress data:', error);
            return null;
        }
    },

    /**
     * Records that the user has learned a new word and updates their streak in local database.
     * @param totalWordsLearned - The new total count of words learned after the current session.
     */
    recordWordLearned: async (totalWordsLearned: number): Promise<void> => {
        try {
            const currentProgress = await progressService.getProgressData();
            if (!currentProgress) {
                throw new Error('No progress data found');
            }

            const today = getTodaysDateString();
            let newStreak = currentProgress.streak;

            // Only update streak if they haven't practiced today
            if (currentProgress.lastPracticed !== today) {
                if (currentProgress.lastPracticed && isYesterday(currentProgress.lastPracticed)) {
                    newStreak += 1; // Continue the streak
                } else {
                    newStreak = 1; // Start a new streak
                }

                // Add the new date to the streakDates array
                const updatedStreakDates = [...currentProgress.streakDates];
                if (!updatedStreakDates.includes(today)) {
                    updatedStreakDates.push(today);
                }

                const updatedData: ProgressData = {
                    ...currentProgress,
                    wordsLearned: totalWordsLearned,
                    articlesMastered: Math.floor(totalWordsLearned / 3), // Example logic: master 1 article per 3 words
                    streak: newStreak,
                    lastPracticed: today,
                    streakDates: updatedStreakDates,
                };

                await localDatabase.saveProgress(updatedData);
            } else {
                // Just update the word count if they already practiced today
                const updatedData: ProgressData = {
                    ...currentProgress,
                    wordsLearned: totalWordsLearned,
                    articlesMastered: Math.floor(totalWordsLearned / 3),
                };

                await localDatabase.saveProgress(updatedData);
            }
        } catch (error) {
            console.error('Failed to record word learned:', error);
            throw error;
        }
    }
};