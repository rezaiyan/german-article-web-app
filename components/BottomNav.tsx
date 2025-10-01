import React from 'react';
import type { AppView } from '../types';

const PracticeIcon: React.FC<{ isActive?: boolean }> = ({ isActive }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill={isActive ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mb-1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
    </svg>
);

const ProgressIcon: React.FC<{ isActive?: boolean }> = ({ isActive }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill={isActive ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={isActive ? 0: 2} stroke="currentColor" className="w-7 h-7 mb-1">
       {isActive 
        ? <path d="M4.125 12a1.125 1.125 0 1 0 0 2.25h2.25a1.125 1.125 0 1 0 0-2.25H4.125ZM10.875 7.5a1.125 1.125 0 1 0 0 2.25h2.25a1.125 1.125 0 1 0 0-2.25h-2.25ZM17.625 3a1.125 1.125 0 1 0 0 2.25h2.25a1.125 1.125 0 1 0 0-2.25h-2.25Z M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625Zm6.75-5.25c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v16.5c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V3.375Z" />
        : <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625Zm6.75-5.25c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v16.5c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V3.375Z" />
       }
    </svg>
);

const SettingsIcon: React.FC<{ isActive?: boolean }> = ({ isActive }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mb-1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.003 1.11-1.226.554-.223 1.196-.223 1.75 0 .554.223 1.02.684 1.11 1.226M13.5 21v-2.667c0-.414.336-.75.75-.75h2.5a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 0-.75.75v2.667M13.5 21h-3v-2.667c0-.414-.336-.75-.75-.75h-2.5a.75.75 0 0 1-.75-.75V13.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v2.667M13.5 21v-2.667h3M3.375 6.375c.09-.542.56-1.003 1.11-1.226.554-.223 1.196-.223 1.75 0 .554.223 1.02.684 1.11 1.226M3.375 6.375V9h2.559c.358 0 .615.345.56.697-.055.352-.34.603-.697.603h-2.559v2.559c0 .358-.345.615-.697.56-.352-.055-.603-.34-.603-.697V9.697H1.125c-.358 0-.615-.345-.56-.697.055-.352.34.603.697.603h2.559V6.375Z" />
    </svg>
);

interface BottomNavProps {
    activeView: AppView;
    setActiveView: (view: AppView) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
    
    const NavItem: React.FC<{ view: AppView; label: string; children: React.ReactNode; }> = ({ view, label, children }) => {
        const isActive = activeView === view;
        const activeColor = "text-blue-600 dark:text-blue-500";
        const inactiveColor = "text-slate-500 dark:text-slate-400";
        
        return (
             <button
                onClick={() => setActiveView(view)}
                className={`flex flex-col items-center justify-center transition-colors duration-200 ${isActive ? activeColor : inactiveColor}`}
                aria-current={isActive ? 'page' : undefined}
            >
                {children}
                <span className={`text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
            </button>
        )
    }
    
    return (
        <footer className="sticky bottom-0 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 z-20">
            <nav className="flex justify-around items-center h-20">
                <NavItem view="practice" label="Practice">
                    <PracticeIcon isActive={activeView === 'practice'} />
                </NavItem>
                
                <div className="relative">
                     <button
                        onClick={() => setActiveView('progress')}
                        className={`flex flex-col items-center justify-center transition-colors duration-200 h-16 w-16 rounded-full -translate-y-6 ${activeView === 'progress' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}
                        aria-current={activeView === 'progress' ? 'page' : undefined}
                    >
                         <ProgressIcon isActive={activeView === 'progress'} />
                    </button>
                    <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs transition-colors duration-200 ${activeView === 'progress' ? 'font-bold text-blue-600 dark:text-blue-500' : 'font-medium text-slate-500 dark:text-slate-400'}`}>
                        Progress
                    </span>
                </div>

                <NavItem view="settings" label="Settings">
                    <SettingsIcon isActive={activeView === 'settings'} />
                </NavItem>
            </nav>
        </footer>
    );
};
