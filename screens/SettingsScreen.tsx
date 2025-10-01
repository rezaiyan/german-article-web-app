import React from 'react';

interface SettingsScreenProps {
  onLogout: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onLogout }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-950">
       <div className="w-full max-w-sm text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Settings</h1>
            <button
                onClick={onLogout}
                className="w-full bg-red-500 text-white font-bold text-lg py-3 px-6 rounded-xl hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-slate-950 transition-colors duration-200"
            >
                Sign Out
            </button>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                This will end your current session.
            </p>
        </div>
    </div>
  );
};