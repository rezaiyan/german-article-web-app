
export interface WordData {
  article: 'der' | 'die' | 'das';
  germanWord: string;
  englishWord: string;
  imageUrl: string;
}

export type AppState = 'idle' | 'loading' | 'success' | 'error';

export type AppView = 'practice' | 'progress' | 'settings';

export interface User {
    uid: string;
    displayName: string;
    photoURL: string;
}

export interface ProgressData {
    wordsLearned: number;
    articlesMastered: number;
    streak: number;
    lastPracticed: string | null; // ISO date string
    streakDates: string[]; // Array of ISO date strings
}
