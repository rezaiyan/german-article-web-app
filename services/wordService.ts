import { localDatabase, type DatabaseWord } from './localDatabase';
import { databaseInitializer } from './databaseInitializer';
import type { WordData } from '../types';

export const wordService = {
    /**
     * Initialize the word database with initial data
     */
    async initialize(): Promise<void> {
        await databaseInitializer.initialize();
    },

    /**
     * Get all words from the local database
     */
    async getAllWords(): Promise<DatabaseWord[]> {
        return await localDatabase.getAllWords();
    },

    /**
     * Get a specific word by ID
     */
    async getWord(id: string): Promise<DatabaseWord | null> {
        return await localDatabase.getWord(id);
    },

    /**
     * Get words by difficulty level
     */
    async getWordsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Promise<DatabaseWord[]> {
        const allWords = await localDatabase.getAllWords();
        return allWords.filter(word => word.difficulty === difficulty);
    },

    /**
     * Get mastered words
     */
    async getMasteredWords(): Promise<DatabaseWord[]> {
        const allWords = await localDatabase.getAllWords();
        return allWords.filter(word => word.mastered === true);
    },

    /**
     * Get words that need more practice
     */
    async getWordsNeedingPractice(): Promise<DatabaseWord[]> {
        const allWords = await localDatabase.getAllWords();
        return allWords.filter(word => 
            !word.mastered && 
            (word.timesPracticed || 0) < 3
        );
    },

    /**
     * Add a new word to the database
     */
    async addWord(german: string, english: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<void> {
        await databaseInitializer.addNewWord(german, english, difficulty);
    },

    /**
     * Record that a word was practiced
     */
    async recordWordPractice(wordId: string, correct: boolean): Promise<void> {
        await databaseInitializer.recordWordPractice(wordId, correct);
    },

    /**
     * Update word data (e.g., after getting article and image from Gemini)
     */
    async updateWordData(wordId: string, updates: Partial<DatabaseWord>): Promise<void> {
        const word = await localDatabase.getWord(wordId);
        if (!word) {
            throw new Error(`Word with ID "${wordId}" not found`);
        }

        const updatedWord: DatabaseWord = {
            ...word,
            ...updates
        };

        await localDatabase.updateWord(updatedWord);
    },

    /**
     * Convert DatabaseWord to WordData format for UI components
     */
    convertToWordData(dbWord: DatabaseWord): WordData {
        return {
            article: dbWord.article || 'der', // Default to 'der' if not set
            germanWord: dbWord.german,
            englishWord: dbWord.english,
            imageUrl: dbWord.imageUrl || ''
        };
    },

    /**
     * Get the next word for practice session
     * Prioritizes words that need more practice, then random selection
     */
    async getNextWordForPractice(): Promise<DatabaseWord | null> {
        const allWords = await localDatabase.getAllWords();
        
        if (allWords.length === 0) {
            return null;
        }

        // First, try to get words that need more practice (not mastered and practiced less than 3 times)
        const wordsNeedingPractice = allWords.filter(word => 
            !word.mastered && (word.timesPracticed || 0) < 3
        );

        if (wordsNeedingPractice.length > 0) {
            // Return a random word from those needing practice
            const randomIndex = Math.floor(Math.random() * wordsNeedingPractice.length);
            return wordsNeedingPractice[randomIndex];
        }

        // If all words are mastered or well-practiced, return a random word
        const randomIndex = Math.floor(Math.random() * allWords.length);
        return allWords[randomIndex];
    },

    /**
     * Get random words for practice session
     */
    async getRandomWords(count: number = 5): Promise<DatabaseWord[]> {
        const allWords = await localDatabase.getAllWords();
        
        if (allWords.length === 0) {
            return [];
        }

        // Shuffle array and take first 'count' items
        const shuffled = [...allWords].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, allWords.length));
    },

    /**
     * Get practice statistics
     */
    async getPracticeStats(): Promise<{
        totalWords: number;
        masteredWords: number;
        wordsInProgress: number;
        averagePracticeCount: number;
    }> {
        const allWords = await localDatabase.getAllWords();
        
        const masteredWords = allWords.filter(word => word.mastered).length;
        const wordsInProgress = allWords.filter(word => 
            !word.mastered && (word.timesPracticed || 0) > 0
        ).length;
        
        const totalPracticeCount = allWords.reduce((sum, word) => sum + (word.timesPracticed || 0), 0);
        const averagePracticeCount = allWords.length > 0 ? totalPracticeCount / allWords.length : 0;

        return {
            totalWords: allWords.length,
            masteredWords,
            wordsInProgress,
            averagePracticeCount: Math.round(averagePracticeCount * 100) / 100
        };
    },

    /**
     * Get practice statistics for the current session
     */
    async getSessionStats(): Promise<{
        totalWords: number;
        wordsNeedingPractice: number;
        masteredWords: number;
        nextWordSuggestion: string;
    }> {
        const allWords = await localDatabase.getAllWords();
        
        const wordsNeedingPractice = allWords.filter(word => 
            !word.mastered && (word.timesPracticed || 0) < 3
        ).length;
        
        const masteredWords = allWords.filter(word => word.mastered).length;
        
        let nextWordSuggestion = "All words mastered! Great job!";
        if (wordsNeedingPractice > 0) {
            nextWordSuggestion = `${wordsNeedingPractice} words need more practice`;
        } else if (allWords.length > 0) {
            nextWordSuggestion = "Keep practicing to maintain your skills!";
        }

        return {
            totalWords: allWords.length,
            wordsNeedingPractice,
            masteredWords,
            nextWordSuggestion
        };
    },

    /**
     * Reset all word progress
     */
    async resetProgress(): Promise<void> {
        await databaseInitializer.resetWordProgress();
    }
};
