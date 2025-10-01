import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Header';
import { WordCard } from '../components/WordCard';
import { Controls } from '../components/Controls';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { wordList } from '../data/words';
import { generateWordData } from '../services/geminiService';
import type { AppState, WordData } from '../types';
import { progressService } from '../services/progressService';

export function PracticeScreen() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalWords = wordList.length;

  const fetchNextWord = useCallback(async (index: number) => {
    setAppState('loading');
    setError(null);
    setWordData(null); 

    if (index >= totalWords) {
      setAppState('success'); 
      setWordData({
        article: 'das',
        germanWord: 'Ende',
        englishWord: 'The End',
        imageUrl: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
      });
      return;
    }

    try {
      const { german, english } = wordList[index];
      const data = await generateWordData(german, english);
      setWordData(data);
      setAppState('success');
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setAppState('error');
    }
  }, [totalWords]);

  useEffect(() => {
    fetchNextWord(currentWordIndex);
  }, [fetchNextWord, currentWordIndex]);

  const isFinished = currentWordIndex >= totalWords;

  const handleNext = () => {
    if (!isFinished) {
      // Record progress before moving to the next word
      progressService.recordWordLearned(currentWordIndex + 1);
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const isLoading = appState === 'loading' || appState === 'idle';
  
  return (
    <>
      <Header progress={Math.min(currentWordIndex, totalWords)} total={totalWords} />
      <main className="flex-1 flex flex-col items-center justify-center p-4 w-full">
        <div className="w-full relative">
          <WordCard data={wordData} isLoading={isLoading} />
          <ErrorDisplay message={error} />
        </div>
        <Controls onSkip={handleSkip} onNext={handleNext} isLoading={isLoading || isFinished} />
      </main>
    </>
  );
}
