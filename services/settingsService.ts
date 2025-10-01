import { localDatabase, type DatabaseSettings } from './localDatabase';

export const settingsService = {
    /**
     * Get current settings from local database
     */
    async getSettings(): Promise<DatabaseSettings> {
        const settings = await localDatabase.getSettings();
        
        // Return default settings if none exist
        if (!settings) {
            const defaultSettings: DatabaseSettings = {
                id: 'default',
                theme: 'light',
                soundEnabled: true,
                notificationsEnabled: true,
                practiceGoal: 10,
                difficulty: 'medium'
            };
            
            await localDatabase.saveSettings(defaultSettings);
            return defaultSettings;
        }
        
        return settings;
    },

    /**
     * Update settings in local database
     */
    async updateSettings(updates: Partial<DatabaseSettings>): Promise<void> {
        const currentSettings = await this.getSettings();
        
        const updatedSettings: DatabaseSettings = {
            ...currentSettings,
            ...updates
        };
        
        await localDatabase.saveSettings(updatedSettings);
    },

    /**
     * Update theme setting
     */
    async setTheme(theme: 'light' | 'dark' | 'auto'): Promise<void> {
        await this.updateSettings({ theme });
    },

    /**
     * Toggle sound setting
     */
    async toggleSound(): Promise<void> {
        const settings = await this.getSettings();
        await this.updateSettings({ soundEnabled: !settings.soundEnabled });
    },

    /**
     * Toggle notifications setting
     */
    async toggleNotifications(): Promise<void> {
        const settings = await this.getSettings();
        await this.updateSettings({ notificationsEnabled: !settings.notificationsEnabled });
    },

    /**
     * Update practice goal
     */
    async setPracticeGoal(goal: number): Promise<void> {
        if (goal < 1 || goal > 100) {
            throw new Error('Practice goal must be between 1 and 100');
        }
        
        await this.updateSettings({ practiceGoal: goal });
    },

    /**
     * Update difficulty setting
     */
    async setDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Promise<void> {
        await this.updateSettings({ difficulty });
    },

    /**
     * Reset settings to defaults
     */
    async resetToDefaults(): Promise<void> {
        const defaultSettings: DatabaseSettings = {
            id: 'default',
            theme: 'light',
            soundEnabled: true,
            notificationsEnabled: true,
            practiceGoal: 10,
            difficulty: 'medium'
        };
        
        await localDatabase.saveSettings(defaultSettings);
    }
};
