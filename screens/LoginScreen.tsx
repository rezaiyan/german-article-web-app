import React from 'react';

interface LoginScreenProps {
  onLogin: () => void;
  error: string | null;
}

const GoogleIcon: React.FC = () => (
    <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.657-3.307-11.284-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
        <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-0.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.417 44 30.836 44 24c0-1.341-0.138-2.65-0.389-3.917z"></path>
    </svg>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
    <div className="bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 mb-6 text-left" role="alert">
        <p className="font-bold">Login Failed</p>
        <p>{message}</p>
    </div>
);


export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, error }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-slate-950 p-6 text-center">
        <div className="w-full max-w-sm">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">German Article Learner</h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                Master 'der, die, das' with AI-powered flashcards.
            </p>
            
            <div className="mt-12">
                {error && <ErrorMessage message={error} />}
                <button
                    onClick={onLogin}
                    className="w-full flex items-center justify-center bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-950 transition-all duration-200"
                >
                    <GoogleIcon />
                    Sign in with Google
                </button>
            </div>
        </div>
    </div>
  );
};
