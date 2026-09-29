import { GoogleGenAI, Chat, Content, Part, Type } from "@google/genai";
import type { Message, DictionaryEntry, Model } from '../types';

let ai: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (ai) {
    return ai;
  }

  const apiKey = localStorage.getItem('geminiApiKey');
  if (!apiKey) {
    throw new Error("API Key not found in local storage. Please provide it on the startup screen.");
  }
  
  ai = new GoogleGenAI({ apiKey: apiKey });
  return ai;
}


export function createEduChatSession(model: Model, language: string, history?: Message[]): Chat {
  let langName: string;
  try {
    // Use Intl.DisplayNames to get the English name of the language from its code.
    // This allows the model to be instructed in any language.
    langName = new Intl.DisplayNames(['en'], { type: 'language' }).of(language) || 'English';
  } catch (e) {
    console.error(`Could not determine language name for code: ${language}`, e);
    // Fallback to English for invalid codes
    langName = 'English';
  }

  const systemInstruction = `You are Haile, a friendly and knowledgeable educational assistant. 
Your purpose is to help users understand complex topics by providing clear, concise, and accurate explanations. 
Break down difficult concepts into simple terms. Use analogies and examples where helpful. 
Always maintain a patient and encouraging tone. Format your answers with markdown for better readability, including headings, lists, and bold text where appropriate.
When you are asked a mathematical question, provide a step-by-step explanation. Use LaTeX for all mathematical formulas and expressions. For block-level formulas, wrap them in $$...$$. For inline formulas, wrap them in $...$.
Your response MUST be in ${langName}.`;

  const formattedHistory: Content[] | undefined = history?.map(message => {
    const parts: Part[] = [];

    if (message.attachment) {
      const match = message.attachment.dataUrl.match(/^data:(.+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const data = match[2];
        parts.push({ inlineData: { mimeType, data } });
      }
    }

    if(message.content) {
        parts.push({ text: message.content });
    }
    
    return {
      role: message.role,
      parts: parts
    };
  });

  const chat: Chat = getAiClient().chats.create({
    model,
    history: formattedHistory,
    config: {
      systemInstruction: systemInstruction,
    },
  });
  return chat;
}

export async function checkAnswer(model: Model, question: string, userAnswer: string, language: string): Promise<string> {
  let langName: string;
  try {
    langName = new Intl.DisplayNames(['en'], { type: 'language' }).of(language) || 'English';
  } catch (e) {
    console.error(`Could not determine language name for code: ${language}`, e);
    langName = 'English';
  }
  
  const prompt = `A student was asked the following question: "${question}".
  The student provided this answer: "${userAnswer}".
  
  Please evaluate the student's answer based on the following criteria:
  1.  Start with a clear, one-word evaluation: **Correct**, **Partially Correct**, or **Incorrect**.
  2.  Provide a concise, step-by-step explanation of the correct answer.
  3.  Give constructive feedback on the student's answer, explaining what they did right and where they can improve.
  
  Format your entire response using clear markdown headings (e.g., ### Evaluation, ### Correct Answer, ### Feedback).
  Your entire response MUST be in ${langName}.`;

  try {
    const response = await getAiClient().models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error in checkAnswer:", error);
    throw new Error("Failed to evaluate answer.");
  }
}

export async function getWordDefinition(model: Model, word: string): Promise<DictionaryEntry> {
  const schema = {
    type: Type.OBJECT,
    properties: {
      word: { type: Type.STRING },
      phonetic: { type: Type.STRING },
      meanings: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            partOfSpeech: { type: Type.STRING },
            definitions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  definition: { type: Type.STRING },
                  example: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    },
  };

  try {
    const response = await getAiClient().models.generateContent({
      model,
      contents: `Provide a dictionary entry for the English word: "${word}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are an expert lexicographer. Your task is to provide a detailed and accurate dictionary entry for any given English word. If the word is not found, return a JSON object with the word property set to the original word and an empty meanings array."
      }
    });
    
    const jsonString = response.text;
    const data = JSON.parse(jsonString);
    
    if (!data.meanings || data.meanings.length === 0) {
        throw new Error("Word not found");
    }

    return data as DictionaryEntry;
  } catch (error) {
    console.error("Error in getWordDefinition:", error);
    if ((error as Error).message === "Word not found") {
      throw new Error("Word not found");
    }
    throw new Error("Failed to fetch word definition.");
  }
}

export async function translateText(model: Model, text: string, sourceLang: string, targetLang: string): Promise<string> {
  let sourceLanguageName = 'the detected language';
  try {
    if (sourceLang !== 'auto') {
      sourceLanguageName = new Intl.DisplayNames(['en'], { type: 'language' }).of(sourceLang) || sourceLang;
    }
  } catch (e) {
    console.warn(`Could not find display name for source language: ${sourceLang}`);
    sourceLanguageName = sourceLang;
  }

  let targetLanguageName = targetLang;
  try {
    targetLanguageName = new Intl.DisplayNames(['en'], { type: 'language' }).of(targetLang) || targetLang;
  } catch (e) {
    console.warn(`Could not find display name for target language: ${targetLang}`);
  }

  const prompt = `You are an expert translator. Translate the following text from ${sourceLanguageName} to ${targetLanguageName}.
Only return the translated text, without any additional explanations or context.

Text to translate:
---
${text}
---`;

  try {
    const response = await getAiClient().models.generateContent({
      model,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error in translateText:", error);
    throw new Error("Failed to translate text.");
  }
}

// Fix: Add the missing `generateImageFromPrompt` function.
export async function generateImageFromPrompt(prompt: string): Promise<string> {
  try {
    const response = await getAiClient().models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return base64ImageBytes;
    } else {
      throw new Error("No image generated.");
    }
  } catch (error) {
    console.error("Error in generateImageFromPrompt:", error);
    throw new Error("Failed to generate image.");
  }
}