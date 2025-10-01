<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# German Article Learner

A React-based web application for learning German articles (der, die, das) with AI-powered flashcards.

## Features

- **Local Database**: Uses IndexedDB for storing words, user progress, and settings
- **Continuous Practice**: Never-ending practice sessions that prioritize words needing more practice
- **AI Integration**: Uses Google Gemini API for generating article hints and images
- **Progress Tracking**: Tracks learning streaks, mastered words, and practice statistics
- **Responsive Design**: Mobile-first design with dark/light theme support

## Local Database

The app now uses a local IndexedDB database instead of relying solely on Firebase. This provides:

- **Offline functionality**: Works without internet connection
- **Fast data access**: Local storage is much faster than network requests
- **Privacy**: All data stays on the user's device
- **Initial data**: 10 German words are automatically added when the app first loads

### Database Schema

- **Words**: German words with English translations, difficulty levels, and practice statistics
- **Settings**: User preferences for theme, sound, notifications, and practice goals
- **Progress**: Learning statistics including streaks and mastered words
- **User**: Basic user information (when authenticated)

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Edit .env.local and add your API keys:
   # - GEMINI_API_KEY: Get from https://makersuite.google.com/app/apikey
   # - Firebase config: Get from Firebase Console > Project Settings > General > Your apps > Web app
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

## Environment Variables

The app uses environment variables for sensitive configuration:

- **GEMINI_API_KEY**: Google Gemini API key for AI features (optional)
- **VITE_FIREBASE_***: Firebase configuration for authentication and cloud features (optional)

All sensitive data is now stored in `.env.local` and is not committed to version control.

## Testing the Database

You can test the local database functionality by opening the browser console and running:
```javascript
testLocalDatabase()
```

This will verify that:
- Database initializes correctly
- Initial words are loaded
- Settings and progress data work
- New words can be added
- Practice statistics are calculated correctly
