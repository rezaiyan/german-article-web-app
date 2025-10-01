// FIX: Implement a cache service to store API results and avoid repeated calls.
export const cacheService = {
  get<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting item from cache', error);
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting item in cache', error);
    }
  },
};
