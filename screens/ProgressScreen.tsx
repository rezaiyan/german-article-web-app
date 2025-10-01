import React, { useState, useEffect } from 'react';
import type { User, ProgressData } from '../types';
import { progressService } from '../services/progressService';
import { StreakCalendar } from '../components/StreakCalendar';

interface ProgressScreenProps {
    user: User;
}

const BackArrowIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

const MedalIcon: React.FC<{ level: number }> = ({ level }) => (
    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-0.5">
        <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#FBBF24"/>
            <text x="16" y="22" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#A16207">{level}</text>
        </svg>
    </div>
);


const StatCard: React.FC<{ value: number | string; label: string }> = ({ value, label }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm flex-1 text-center">
        <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
);

const SkeletonStatCard: React.FC = () => (
     <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm flex-1 text-center animate-pulse">
        <div className="h-9 w-16 bg-slate-200 dark:bg-slate-700 rounded-md mx-auto mb-2"></div>
        <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded-md mx-auto"></div>
    </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 flex items-center justify-center bg-red-100 dark:bg-red-800 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        </div>
        <h3 className="text-xl font-semibold text-red-800 dark:text-red-200">Failed to Load Progress</h3>
        <p className="text-red-600 dark:text-red-300 mt-2">{message}</p>
    </div>
);

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ user }) => {
    const [progress, setProgress] = useState<ProgressData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchProgress = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await progressService.getProgressData();
                setProgress(data);
            } catch (err) {
                console.error("Failed to fetch progress:", err);
                setError("Could not load your progress. This might be a network issue or a problem with your Firestore security rules.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProgress();
    }, [user.uid]);
    
    if (error) {
        return <ErrorState message={error} />
    }
    
    const userLevel = progress ? Math.floor(progress.wordsLearned / 10) + 1 : 1;

    return (
        <div className="flex-1 flex flex-col p-4 bg-gray-50 dark:bg-black overflow-y-auto">
             <header className="flex items-center justify-between mb-6">
                <button className="text-slate-800 dark:text-slate-200" aria-label="Go back">
                    <BackArrowIcon />
                </button>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    Progress
                </h1>
                <div className="w-6"></div>
            </header>
            
            <section className="flex flex-col items-center text-center mb-8">
                <div className="relative w-32 h-32 mb-4">
                     <img 
                        src={user.photoURL} 
                        alt={user.displayName} 
                        className="w-full h-full rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg"
                     />
                    <MedalIcon level={userLevel} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.displayName}</h2>
                <p className="text-slate-500 dark:text-slate-400">Level {userLevel}</p>
            </section>
            
            <section className="flex gap-4 mb-8">
                {isLoading || !progress ? (
                    <>
                        <SkeletonStatCard />
                        <SkeletonStatCard />
                        <SkeletonStatCard />
                    </>
                ) : (
                    <>
                        <StatCard value={progress.wordsLearned} label="Words Learned" />
                        <StatCard value={progress.articlesMastered} label="Articles Mastered" />
                        <StatCard value={progress.streak} label="Days Streak" />
                    </>
                )}
            </section>
            
            <section>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Streak Calendar</h3>
                 {isLoading || !progress ? (
                     <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm w-full animate-pulse h-72"></div>
                 ) : (
                    <StreakCalendar streakDates={progress.streakDates} />
                 )}
            </section>
        </div>
    );
};