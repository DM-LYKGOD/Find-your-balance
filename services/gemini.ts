import { GoogleGenAI } from "@google/genai";
import { AppData } from "../types";

const API_KEY = 'AIzaSyA2UKQ8iZJ442W3P5J6nQe_zdrFpmhxCY0';
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getDailyQuote = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Give me a short, unique, inspiring quote about balance, wellness, or mindfulness. Just the quote and author.",
    });
    return response.text?.trim() || "Balance is not something you find, it's something you create. — Jana Kingsford";
  } catch (error) {
    console.error("Gemini Quote Error", error);
    return "Happiness depends upon ourselves. — Aristotle";
  }
};

export const getWellnessInsight = async (data: AppData): Promise<string> => {
  try {
    // Prepare a lightweight summary for the AI
    const recentMoods = data.moods.slice(-7).map(m => `Date: ${m.date}, Mood: ${m.rating}/5`).join('\n');
    const recentHabits = data.habits.map(h => {
      const count = Object.keys(h.history).filter(d => {
        const date = new Date(d);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        return diff < 7 * 24 * 60 * 60 * 1000; // last 7 days
      }).length;
      return `${h.name}: ${count} times in last 7 days`;
    }).join('\n');

    const prompt = `
      Act as a gentle, supportive wellness coach.
      Here is my summary for the last week:
      
      Moods:
      ${recentMoods}
      
      Habits:
      ${recentHabits}
      
      Based on this, give me a brief, encouraging reflection (max 100 words) and 3 actionable, simple tips for next week to improve my balance.
      Format neatly with Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Keep going! You're doing great.";
  } catch (error) {
    console.error("Gemini Insight Error", error);
    return "Unable to generate insights at the moment. Please try again later.";
  }
};