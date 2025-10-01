// FIX: Implement the Gemini service to fetch word data.
import { GoogleGenAI, Type } from "@google/genai";
import type { WordData } from '../types';
import { cacheService } from './cacheService';

/**
 * Checks if the Gemini API key has been provided.
 * @returns {boolean} True if the API key is configured.
 */
export const isGeminiConfigured = (): boolean => {
  return process.env.API_KEY !== undefined && process.env.API_KEY !== "";
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Gets the correct German grammatical article for a noun.
 * @param germanWord The German noun.
 * @returns A promise that resolves to 'der', 'die', or 'das'.
 */
const getArticle = async (germanWord: string): Promise<'der' | 'die' | 'das'> => {
  const model = 'gemini-2.5-flash';
  
  const response = await ai.models.generateContent({
    model: model,
    contents: `What is the correct German article ('der', 'die', or 'das') for the noun "${germanWord}"?`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          article: {
            type: Type.STRING,
            description: "The German article, which must be one of 'der', 'die', or 'das'.",
          },
        },
        required: ['article'],
      },
    },
  });

  const jsonString = response.text.trim();
  const result = JSON.parse(jsonString);
  const article = result.article?.toLowerCase();

  if (['der', 'die', 'das'].includes(article)) {
    return article as 'der' | 'die' | 'das';
  } else {
    // Fallback for unexpected response structure
    console.error(`Unexpected article response for ${germanWord}:`, jsonString);
    throw new Error(`Invalid article received for ${germanWord}: ${result.article}`);
  }
};

/**
 * Generates an image for a given word.
 * @param englishWord The word to generate an image for.
 * @returns A promise that resolves to a base64 data URL of the image.
 */
const generateImage = async (englishWord: string): Promise<string> => {
    const model = 'imagen-4.0-generate-001';
    
    const response = await ai.models.generateImages({
        model: model,
        prompt: `A high-quality, photorealistic image of a single "${englishWord}" on a plain, clean, white background. The object should be the main focus. Simple, clear, and centered.`,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image?.imageBytes) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
        console.error(`Image generation failed for ${englishWord}:`, response);
        throw new Error(`Could not generate image for ${englishWord}`);
    }
};

/**
 * Generates comprehensive data for a word, including its German article and a relevant image.
 * Caches results in sessionStorage to avoid repeated API calls.
 * @param germanWord The German word.
 * @param englishWord The English translation of the word.
 * @returns A promise that resolves to a WordData object.
 */
export const generateWordData = async (germanWord: string, englishWord: string): Promise<WordData> => {
  const cacheKey = `word_${germanWord.toLowerCase()}`;
  const cachedData = cacheService.get<WordData>(cacheKey);

  if (cachedData) {
    return cachedData;
  }
  
  try {
    // Fetch article and image in parallel for efficiency
    const [article, imageUrl] = await Promise.all([
      getArticle(germanWord),
      generateImage(englishWord),
    ]);

    const wordData: WordData = {
      article,
      germanWord,
      englishWord,
      imageUrl,
    };
    
    cacheService.set(cacheKey, wordData);

    return wordData;
  } catch(error) {
    console.error(`Failed to generate word data for "${germanWord}"`, error);
    // Rethrow a more user-friendly error message to be displayed in the UI
    if (error instanceof Error) {
        throw new Error(`There was a problem generating data for "${germanWord}". Please try again.`);
    }
    throw new Error(`An unknown error occurred while generating data for "${germanWord}".`);
  }
};