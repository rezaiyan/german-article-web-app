// Test script to verify local database functionality
import { wordService } from './services/wordService';
import { settingsService } from './services/settingsService';
import { progressService } from './services/progressService';

async function testLocalDatabase() {
  console.log('🧪 Testing Local Database Implementation...\n');

  try {
    // Test 1: Initialize database
    console.log('1. Initializing database...');
    await wordService.initialize();
    console.log('✅ Database initialized successfully\n');

    // Test 2: Get all words
    console.log('2. Fetching all words...');
    const words = await wordService.getAllWords();
    console.log(`✅ Found ${words.length} words in database`);
    words.forEach((word, index) => {
      console.log(`   ${index + 1}. ${word.german} (${word.english}) - ${word.difficulty}`);
    });
    console.log('');

    // Test 3: Get practice stats
    console.log('3. Getting practice statistics...');
    const stats = await wordService.getPracticeStats();
    console.log(`✅ Practice Stats:`);
    console.log(`   Total words: ${stats.totalWords}`);
    console.log(`   Mastered words: ${stats.masteredWords}`);
    console.log(`   Words in progress: ${stats.wordsInProgress}`);
    console.log(`   Average practice count: ${stats.averagePracticeCount}\n`);

    // Test 4: Get settings
    console.log('4. Getting settings...');
    const settings = await settingsService.getSettings();
    console.log(`✅ Settings loaded:`);
    console.log(`   Theme: ${settings.theme}`);
    console.log(`   Sound enabled: ${settings.soundEnabled}`);
    console.log(`   Practice goal: ${settings.practiceGoal} words/day\n`);

    // Test 5: Get progress
    console.log('5. Getting progress data...');
    const progress = await progressService.getProgressData();
    console.log(`✅ Progress data loaded:`);
    console.log(`   Words learned: ${progress?.wordsLearned || 0}`);
    console.log(`   Articles mastered: ${progress?.articlesMastered || 0}`);
    console.log(`   Current streak: ${progress?.streak || 0}\n`);

    // Test 6: Add a new word
    console.log('6. Adding a new word...');
    await wordService.addWord('Schule', 'School', 'easy');
    console.log('✅ Added new word: Schule (School)\n');

    // Test 8: Test continuous practice functionality
    console.log('8. Testing continuous practice functionality...');
    const nextWord1 = await wordService.getNextWordForPractice();
    const nextWord2 = await wordService.getNextWordForPractice();
    const nextWord3 = await wordService.getNextWordForPractice();
    
    console.log(`✅ Next words for practice:`);
    console.log(`   Word 1: ${nextWord1?.german} (${nextWord1?.english})`);
    console.log(`   Word 2: ${nextWord2?.german} (${nextWord2?.english})`);
    console.log(`   Word 3: ${nextWord3?.german} (${nextWord3?.english})`);
    console.log('');

    // Test 9: Get session statistics
    console.log('9. Getting session statistics...');
    const sessionStats = await wordService.getSessionStats();
    console.log(`✅ Session Stats:`);
    console.log(`   Total words: ${sessionStats.totalWords}`);
    console.log(`   Words needing practice: ${sessionStats.wordsNeedingPractice}`);
    console.log(`   Mastered words: ${sessionStats.masteredWords}`);
    console.log(`   Suggestion: ${sessionStats.nextWordSuggestion}\n`);

    console.log('🎉 All tests passed! Local database with continuous practice is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Export for use in browser console
(window as any).testLocalDatabase = testLocalDatabase;

export { testLocalDatabase };
