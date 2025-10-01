import React, { useState } from 'react';

interface StreakCalendarProps {
    streakDates: string[]; // YYYY-MM-DD format
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({ streakDates }) => {
    const [date, setDate] = useState(new Date());

    const changeMonth = (offset: number) => {
        setDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(prevDate.getMonth() + offset);
            return newDate;
        });
    };
    
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const monthName = date.toLocaleString('default', { month: 'long' });
    
    // Day of the week for the 1st of the month (0=Sun, 1=Mon, etc.)
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
    
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const todayDate = today.getDate();

    const dateSet = new Set(streakDates);

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm w-full">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} aria-label="Previous month" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h3 className="font-bold text-slate-800 dark:text-white">{monthName} {year}</h3>
                <button onClick={() => changeMonth(1)} aria-label="Next month" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
            <div className="grid grid-cols-7 gap-y-2 text-center text-sm">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} className="font-medium text-slate-400 dark:text-slate-500">{day}</div>
                ))}
                {blanks.map(blank => <div key={`blank-${blank}`}></div>)}
                {days.map(day => {
                    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isStreakDay = dateSet.has(dateString);
                    const isToday = isCurrentMonth && day === todayDate;
                    
                    let dayClass = "w-9 h-9 flex items-center justify-center rounded-full mx-auto";
                    if(isStreakDay) {
                        dayClass += " bg-blue-600 text-white font-bold";
                    } else if (isToday) {
                        dayClass += " bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold";
                    } else {
                        dayClass += " text-slate-700 dark:text-slate-300";
                    }

                    return <div key={day} className="h-9 flex items-center justify-center"><div className={dayClass}>{day}</div></div>;
                })}
            </div>
        </div>
    );
};