import React from 'react';

interface ErrorDisplayProps {
  message: string | null;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm z-10 rounded-3xl flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 flex items-center justify-center bg-red-100 dark:bg-red-800 rounded-full mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
        </div>
        <h3 className="text-xl font-semibold text-red-800 dark:text-red-200">Oops! Something went wrong.</h3>
      <p className="text-red-600 dark:text-red-300 mt-2">{message}</p>
    </div>
  );
};