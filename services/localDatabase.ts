import type { WordData, ProgressData, User } from '../types';

const DB_NAME = 'GermanArticleLearnerDB';
const DB_VERSION = 1;

// Database schema interfaces
export interface DatabaseWord {
  id: string;
  german: string;
  english: string;
  article?: 'der' | 'die' | 'das';
  imageUrl?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  timesPracticed?: number;
  lastPracticed?: string; // ISO date string
  mastered?: boolean;
}

export interface DatabaseSettings {
  id: string;
  theme: 'light' | 'dark' | 'auto';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  practiceGoal: number; // words per day
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface DatabaseUser {
  id: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  createdAt: string; // ISO date string
  lastLogin: string; // ISO date string
}

class LocalDatabase {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open database'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create words store
        if (!db.objectStoreNames.contains('words')) {
          const wordsStore = db.createObjectStore('words', { keyPath: 'id' });
          wordsStore.createIndex('german', 'german', { unique: false });
          wordsStore.createIndex('difficulty', 'difficulty', { unique: false });
          wordsStore.createIndex('mastered', 'mastered', { unique: false });
        }

        // Create settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }

        // Create user store
        if (!db.objectStoreNames.contains('user')) {
          db.createObjectStore('user', { keyPath: 'id' });
        }

        // Create progress store
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'id' });
        }
      };
    });
  }

  private async getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    if (!this.db) {
      await this.init();
    }
    
    const transaction = this.db!.transaction([storeName], mode);
    return transaction.objectStore(storeName);
  }

  // Words operations
  async addWord(word: DatabaseWord): Promise<void> {
    const store = await this.getStore('words', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.add(word);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getWord(id: string): Promise<DatabaseWord | null> {
    const store = await this.getStore('words');
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllWords(): Promise<DatabaseWord[]> {
    const store = await this.getStore('words');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async updateWord(word: DatabaseWord): Promise<void> {
    const store = await this.getStore('words', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(word);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteWord(id: string): Promise<void> {
    const store = await this.getStore('words', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Settings operations
  async getSettings(): Promise<DatabaseSettings | null> {
    const store = await this.getStore('settings');
    return new Promise((resolve, reject) => {
      const request = store.get('default');
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async saveSettings(settings: DatabaseSettings): Promise<void> {
    const store = await this.getStore('settings', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(settings);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // User operations
  async getUser(): Promise<DatabaseUser | null> {
    const store = await this.getStore('user');
    return new Promise((resolve, reject) => {
      const request = store.get('current');
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async saveUser(user: DatabaseUser): Promise<void> {
    const store = await this.getStore('user', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(user);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Progress operations
  async getProgress(): Promise<ProgressData | null> {
    const store = await this.getStore('progress');
    return new Promise((resolve, reject) => {
      const request = store.get('current');
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async saveProgress(progress: ProgressData): Promise<void> {
    const store = await this.getStore('progress', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put({ id: 'current', ...progress });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Utility methods
  async clearAllData(): Promise<void> {
    const stores = ['words', 'settings', 'user', 'progress'];
    const promises = stores.map(async (storeName) => {
      const store = await this.getStore(storeName, 'readwrite');
      return new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
    
    await Promise.all(promises);
  }

  async initializeDefaultData(): Promise<void> {
    // Initialize default settings if none exist
    const existingSettings = await this.getSettings();
    if (!existingSettings) {
      const defaultSettings: DatabaseSettings = {
        id: 'default',
        theme: 'light',
        soundEnabled: true,
        notificationsEnabled: true,
        practiceGoal: 10,
        difficulty: 'medium'
      };
      await this.saveSettings(defaultSettings);
    }

    // Initialize default progress if none exists
    const existingProgress = await this.getProgress();
    if (!existingProgress) {
      const defaultProgress: ProgressData = {
        wordsLearned: 0,
        articlesMastered: 0,
        streak: 0,
        lastPracticed: null,
        streakDates: []
      };
      await this.saveProgress(defaultProgress);
    }
  }
}

// Export singleton instance
export const localDatabase = new LocalDatabase();
