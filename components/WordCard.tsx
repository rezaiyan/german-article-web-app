import React from 'react';
import type { WordData } from '../types';

interface WordCardProps {
  data: WordData | null;
  isLoading: boolean;
}

const SkeletonLoader: React.FC = () => (
    <div className="w-full flex flex-col items-center animate-pulse">
        <div className="text-center mb-8">
            <div className="h-10 w-24 bg-slate-300 dark:bg-slate-700 rounded-lg mb-4 mx-auto"></div>
            <div className="h-16 w-48 bg-slate-300 dark:bg-slate-700 rounded-lg mx-auto"></div>
        </div>
        <div className="w-full aspect-square bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
    </div>
);


export const WordCard: React.FC<WordCardProps> = ({ data, isLoading }) => {
  if (isLoading || !data) {
    return <SkeletonLoader />;
  }

  const { article, germanWord, englishWord, imageUrl } = data;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-5xl md:text-6xl font-bold text-slate-500 dark:text-slate-400">
          {article}
        </h2>
        <h1 className="text-6xl md:text-7xl font-bold text-slate-900 dark:text-white break-words">
          {germanWord}
        </h1>
      </div>
      <div className="w-full aspect-square rounded-3xl shadow-lg overflow-hidden bg-slate-200 dark:bg-slate-800">
        <img src={imageUrl} alt={englishWord} className="w-full h-full object-cover" />
      </div>
    </div>
  );
};