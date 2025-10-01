import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Header';
import { WordCard } from '../components/WordCard';
import { Controls } from '../components/Controls';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { wordService } from '../services/wordService';
import { generateWordData } from '../services/geminiService';
import type { AppState, WordData } from '../types';
import { progressService } from '../services/progressService';
import type { DatabaseWord } from '../services/localDatabase';

export function PracticeScreen() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [currentWord, setCurrentWord] = useState<DatabaseWord | null>(null);
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionCount, setSessionCount] = useState(0); // Track words practiced in this session

  const fetchNextWord = useCallback(async () => {
    setAppState('loading');
    setError(null);
    setWordData(null);

    try {
      // Get the next word for practice from the database
      const nextWord = await wordService.getNextWordForPractice();
      
      if (!nextWord) {
        setError('No words available for practice. Please add some words first.');
        setAppState('error');
        return;
      }

      setCurrentWord(nextWord);

      // Generate word data using Gemini (if available) or use basic data
      try {
        const data = await generateWordData(nextWord.german, nextWord.english);
        setWordData(data);
      } catch (geminiError) {
        console.warn('Gemini service unavailable, using basic word data:', geminiError);
        // Fallback to basic word data if Gemini is not available
        setWordData({
          article: nextWord.article || 'der',
          germanWord: nextWord.german,
          englishWord: nextWord.english,
          imageUrl: nextWord.imageUrl || ''
        });
      }
      
      setAppState('success');
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setAppState('error');
    }
  }, []);

  useEffect(() => {
    fetchNextWord();
  }, [fetchNextWord]);

  const handleNext = async () => {
    if (currentWord) {
      // Record that the word was practiced (correct answer)
      await wordService.recordWordPractice(currentWord.id, true);
      
      // Update session count
      setSessionCount(prev => prev + 1);
      
      // Update progress
      await progressService.recordWordLearned(sessionCount + 1);
      
      // Fetch next word
      fetchNextWord();
    }
  };

  const handleSkip = async () => {
    if (currentWord) {
      // Record that the word was practiced (incorrect/skipped)
      await wordService.recordWordPractice(currentWord.id, false);
      
      // Update session count
      setSessionCount(prev => prev + 1);
      
      // Fetch next word
      fetchNextWord();
    }
  };

  const isLoading = appState === 'loading' || appState === 'idle';
  
  return (
    <>
      <Header progress={sessionCount} total={sessionCount + 1} />
      <main className="flex-1 flex flex-col items-center justify-center p-4 w-full">
        <div className="w-full relative">
          <WordCard data={wordData} isLoading={isLoading} />
          <ErrorDisplay message={error} />
        </div>
        <Controls onSkip={handleSkip} onNext={handleNext} isLoading={isLoading} />
        {sessionCount > 0 && (
          <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Words practiced this session: {sessionCount}
          </div>
        )}
      </main>
    </>
  );
}
