import React from 'react';

interface ControlsProps {
  onSkip: () => void;
  onNext: () => void;
  isLoading: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ onSkip, onNext, isLoading }) => {
  return (
    <div className="mt-8 flex items-center gap-4">
      <button
        onClick={onSkip}
        disabled={isLoading}
        className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-lg py-4 px-6 rounded-2xl hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 dark:focus:ring-offset-slate-950 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Skip
      </button>

      <button
        onClick={onNext}
        disabled={isLoading}
        className="flex-1 flex items-center justify-center bg-blue-600 text-white font-bold text-lg py-4 px-6 rounded-2xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-950 transition-colors duration-200 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>...</span>
          </>
        ) : (
          'Next'
        )}
      </button>
    </div>
  );
};