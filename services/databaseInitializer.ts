import { localDatabase, type DatabaseWord } from './localDatabase';

// Initial German words with their English translations
const initialWords: Omit<DatabaseWord, 'id'>[] = [
  {
    german: 'Apfel',
    english: 'Apple',
    difficulty: 'easy',
    timesPracticed: 0,
    mastered: false
  },
  {
    german: 'Banane',
    english: 'Banana',
    difficulty: 'easy',
    timesPracticed: 0,
    mastered: false
  },
  {
    german: 'Haus',
    english: 'House',
    difficulty: 'easy',
    timesPracticed: 0,
    mastered: false
  },
  {
    german: 'Auto',
    english: 'Car',
    difficulty: 'easy',
    timesPracticed: 0,
    mastered: false
  },
  {
    german: 'Buch',
    english: 'Book',
    difficulty: 'easy',
    timesPracticed: 0,
    mastered: false
  },
  {
    german: 'Stuhl',
    english: 'Chair',
    difficulty: 'easy',
    timesPracticed: 0,
    mastered: false
  },
  {
    german: 'Tisch',
    english: 'Table',
    difficulty: 'easy',
    timesPracticed: 0,
    mastered: false
  },
  {
    german: 'Fenster',
    english: 'Window',
    difficulty: 'medium',
    timesPracticed: 0,
    mastered: false
  },
  {
    german: 'Blume',
    english: 'Flower',
    difficulty: 'medium',
    timesPracticed: 0,
    mastered: false
  },
  {
    german: 'Wasser',
    english: 'Water',
    difficulty: 'medium',
    timesPracticed: 0,
    mastered: false
  }
];

export const databaseInitializer = {
  /**
   * Initialize the database with default data including initial words
   */
  async initialize(): Promise<void> {
    try {
      // Initialize the database
      await localDatabase.init();
      
      // Initialize default settings and progress
      await localDatabase.initializeDefaultData();
      
      // Check if words already exist
      const existingWords = await localDatabase.getAllWords();
      
      // Only add initial words if none exist
      if (existingWords.length === 0) {
        console.log('Adding initial words to database...');
        
        for (const word of initialWords) {
          const wordWithId: DatabaseWord = {
            ...word,
            id: this.generateWordId(word.german)
          };
          
          await localDatabase.addWord(wordWithId);
        }
        
        console.log(`Added ${initialWords.length} initial words to database`);
      } else {
        console.log(`Database already contains ${existingWords.length} words`);
      }
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  },

  /**
   * Generate a unique ID for a word based on its German text
   */
  generateWordId(germanWord: string): string {
    return `word_${germanWord.toLowerCase().replace(/\s+/g, '_')}`;
  },

  /**
   * Add a new word to the database
   */
  async addNewWord(german: string, english: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<void> {
    const wordId = this.generateWordId(german);
    
    // Check if word already exists
    const existingWord = await localDatabase.getWord(wordId);
    if (existingWord) {
      throw new Error(`Word "${german}" already exists in database`);
    }
    
    const newWord: DatabaseWord = {
      id: wordId,
      german,
      english,
      difficulty,
      timesPracticed: 0,
      mastered: false
    };
    
    await localDatabase.addWord(newWord);
  },

  /**
   * Get all words from the database
   */
  async getAllWords(): Promise<DatabaseWord[]> {
    return await localDatabase.getAllWords();
  },

  /**
   * Update word practice statistics
   */
  async recordWordPractice(wordId: string, correct: boolean): Promise<void> {
    const word = await localDatabase.getWord(wordId);
    if (!word) {
      throw new Error(`Word with ID "${wordId}" not found`);
    }
    
    const updatedWord: DatabaseWord = {
      ...word,
      timesPracticed: (word.timesPracticed || 0) + 1,
      lastPracticed: new Date().toISOString(),
      mastered: correct && (word.timesPracticed || 0) >= 3 // Mark as mastered after 3 correct practices
    };
    
    await localDatabase.updateWord(updatedWord);
  },

  /**
   * Reset all word progress (useful for testing or user reset)
   */
  async resetWordProgress(): Promise<void> {
    const words = await localDatabase.getAllWords();
    
    for (const word of words) {
      const resetWord: DatabaseWord = {
        ...word,
        timesPracticed: 0,
        lastPracticed: undefined,
        mastered: false
      };
      
      await localDatabase.updateWord(resetWord);
    }
  }
};
