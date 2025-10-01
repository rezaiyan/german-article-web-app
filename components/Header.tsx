import React from 'react';

interface HeaderProps {
    progress: number;
    total: number;
}

const BackArrowIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

export const Header: React.FC<HeaderProps> = ({ progress, total }) => {
    const progressPercentage = (progress / total) * 100;

    return (
        <header className="p-4 w-full max-w-md mx-auto bg-white dark:bg-slate-950">
            <div className="flex items-center justify-between">
                <button className="text-slate-800 dark:text-slate-200" aria-label="Go back">
                    <BackArrowIcon />
                </button>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    Practice
                </h1>
                <div className="w-6"></div>
            </div>
            <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{progress}/{total}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>
        </header>
    );
};