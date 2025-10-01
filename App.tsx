import React, { useState, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import type { AppView, User } from './types';
import { authService } from './services/authService';
import { initializeFirebase, isFirebaseConfigured } from './services/firebase';
import { isGeminiConfigured } from './services/geminiService';
import { wordService } from './services/wordService';
import { LoginScreen } from './screens/LoginScreen';
import { PracticeScreen } from './screens/PracticeScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { SettingsScreen } from './screens/SettingsScreen';

const FirebaseConfigError: React.FC<{ message?: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-200 p-6 text-center">
        <div className="w-16 h-16 flex items-center justify-center bg-red-100 dark:bg-red-800 rounded-full mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
        </div>
        <h1 className="text-2xl font-bold">Configuration Error</h1>
        <p className="mt-4 max-w-md">
            {message || "The application is not configured correctly. The Firebase API key is missing or invalid."}
        </p>
        <p className="mt-2 text-sm bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">
          Please update the <code>firebaseConfig</code> object in <strong>services/firebase.ts</strong> with your project's credentials from the Firebase Console.
        </p>
    </div>
);

const GeminiConfigError: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-200 p-6 text-center">
        <div className="w-16 h-16 flex items-center justify-center bg-yellow-100 dark:bg-yellow-800 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500 dark:text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7h2a2 2 0 012 2v10a2 2 0 01-2 2h-2m-6 0a2 2 0 00-2-2H7a2 2 0 00-2 2m12-14a2 2 0 00-2-2h-2a2 2 0 00-2 2m-6 0a2 2 0 00-2 2v10a2 2 0 002 2h2m6 0a2 2 0 012-2h2a2 2 0 012 2m-6-14v0a2 2 0 00-2 2v0a2 2 0 002 2v0a2 2 0 002-2v0a2 2 0 00-2-2z" />
            </svg>
        </div>
        <h1 className="text-2xl font-bold">Configuration Error</h1>
        <p className="mt-4 max-w-md">
            The Gemini API Key is missing. This is required to generate the flashcard content.
        </p>
        <p className="mt-2 text-sm bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-lg">
          Please configure the <strong>API_KEY</strong> environment variable for this application.
        </p>
    </div>
);


function App() {
  const [appStatus, setAppStatus] = useState<'initializing' | 'ready' | 'config-error'>('initializing');
  const [configErrorDetails, setConfigErrorDetails] = useState<{ type: 'firebase' | 'gemini', message?: string } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState<'loading' | 'authed' | 'unauthed'>('loading');
  const [activeView, setActiveView] = useState<AppView>('practice');
  const [loginError, setLoginError] = useState<string | null>(null);
  
  useEffect(() => {
    // One-time initialization logic
    const initializeApp = async () => {
      try {
        // Initialize local database first
        await wordService.initialize();
        console.log('Local database initialized successfully');
        
        // Check Firebase configuration (optional for local database)
        if (!isFirebaseConfigured()) {
          console.warn('Firebase not configured - using local database only');
        } else {
          initializeFirebase(); // Attempt to initialize Firebase services
        }
        
        // Check Gemini configuration (optional for local database)
        if (!isGeminiConfigured()) {
          console.warn('Gemini not configured - some features may be limited');
        }
        
        setAppStatus('ready');
      } catch (error) {
        console.error("App initialization failed:", error);
        setConfigErrorDetails({ 
          type: 'firebase', 
          message: error instanceof Error ? error.message : "Failed to initialize local database." 
        });
        setAppStatus('config-error');
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    // This effect subscribes to auth state changes only when the app is 'ready'
    if (appStatus !== 'ready') return;

    const unsubscribe = authService.onAuthStateChanged(currentUser => {
      setUser(currentUser);
      setAuthStatus(currentUser ? 'authed' : 'unauthed');
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [appStatus]);

  const handleLogin = async () => {
    setLoginError(null);
    try {
      await authService.signIn();
      // The onAuthStateChanged listener will handle setting the user
    } catch (error: any) {
      console.error("Login failed:", error);
      let message = "An unexpected error occurred. Please try again.";
      if (error.code) {
        switch (error.code) {
          case 'auth/popup-closed-by-user':
          case 'auth/cancelled-popup-request':
            message = "The sign-in process was cancelled. Please try again.";
            break;
          case 'auth/popup-blocked':
            message = "Your browser blocked the login pop-up. Please enable pop-ups for this site and try again.";
            break;
          case 'auth/configuration-not-found':
            message = "Authentication is not configured correctly in your Firebase project. Please go to the Firebase Console, navigate to Authentication > Sign-in method, and ensure the Google provider is enabled.";
            break;
          case 'auth/unauthorized-domain':
            message = `This domain is not authorized for sign-in. Go to the Firebase Console > Authentication > Settings > Authorized domains and add: ${window.location.hostname}`;
            break;
        }
      }
      setLoginError(message);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setActiveView('practice'); // Reset to default view on logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderLoading = () => (
     <div className="flex items-center justify-center h-screen bg-white dark:bg-slate-950">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
  )

  if (appStatus === 'initializing') {
    return renderLoading();
  }

  if (appStatus === 'config-error' && configErrorDetails) {
    if (configErrorDetails.type === 'firebase') {
      return <FirebaseConfigError message={configErrorDetails.message} />;
    }
    if (configErrorDetails.type === 'gemini') {
      return <GeminiConfigError />;
    }
  }

  if (authStatus === 'loading') {
    return renderLoading();
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} error={loginError} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'practice':
        return <PracticeScreen />;
      case 'progress':
        return <ProgressScreen user={user} />;
      case 'settings':
        return <SettingsScreen onLogout={handleLogout} />;
      default:
        return <PracticeScreen />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white max-w-md mx-auto">
      {renderContent()}
      <BottomNav activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
}

export default App;