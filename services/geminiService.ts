
import { GoogleGenAI } from "@google/genai";
import { UserProfile, Medication, ChatMessage } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMedicationInsight = async (name: string, dose: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a very brief (max 2 sentences) tip for taking ${name} (${dose}). Focus on common advice like "take with food" or "avoid alcohol". Keep it professional and helpful.`,
    });
    return response.text;
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Remember to take as prescribed by your doctor.";
  }
};

export const getDailyHealthTip = async () => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Provide a unique, one-sentence health tip for someone taking daily medications. Focus on hydration, consistency, safety, or general wellness. Make it encouraging and short.",
    });
    return response.text || "Consistency is the key to effective treatment. Stay on track!";
  } catch (error) {
    console.error("Daily Tip Error:", error);
    const fallbacks = [
      "Drink a full glass of water with your medication for better absorption.",
      "Try to take your medicine at the same time every day to build a habit.",
      "Keep a list of all your medications in your wallet for emergencies.",
      "Store your medications in a cool, dry place away from direct sunlight.",
      "Don't hesitate to ask your pharmacist if you have questions about side effects."
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};

export const findNearbyPharmacies = async (lat: number, lng: number) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-09-2025",
      contents: "List the top 5 pharmacies closest to my current location. Provide their names and website or map links if possible.",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const results = chunks
      .filter((chunk: any) => chunk.maps)
      .map((chunk: any) => ({
        name: chunk.maps.title || "Nearby Pharmacy",
        uri: chunk.maps.uri,
      }));

    return results.length > 0 ? results : null;
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return null;
  }
};

export const chatWithAIDoctor = async (
  message: string,
  history: ChatMessage[],
  profile: UserProfile,
  meds: Medication[]
) => {
  const ai = getAI();
  const medsSummary = meds.map(m => `${m.name} (${m.dose}, ${m.frequency})`).join(', ');
  
  const systemInstruction = `You are "MedNotify AI Doctor", a safety-focused medical assistant. 
  
  CORE MISSION: 
  Prevent adverse drug events. When a user asks about a new medication or a symptom, you MUST cross-reference it with their existing profile.
  
  User Profile:
  - Age/Gender: ${profile.age || 'Unknown'} / ${profile.gender || 'Unknown'}
  - Vitals: BP ${profile.bloodPressure || 'N/A'}, Sugar ${profile.sugarLevel || 'N/A'}
  - Allergies: ${profile.allergies || 'NONE LISTED - proceed with caution'}
  - Medical Notes: ${profile.doctorNotes || 'None'}
  
  Current Medication List (The user is ALREADY taking these): 
  ${medsSummary || 'NONE'}
  
  Strict Safety Protocols:
  1. INTERACTION CHECK: If the user mentions taking a new drug, supplement, or herb, immediately check for severe interactions with their current medications listed above.
  2. ALLERGY CHECK: Check if the new drug belongs to a class the user is allergic to (e.g., if they are allergic to Penicillin, flag Amoxicillin).
  3. CONDITION CHECK: Check if the drug is contraindicated for their vitals (e.g., avoiding NSAIDs with high BP).
  4. RESPONSE STYLE: Use bold warning labels like "⚠️ INTERACTION ALERT" if you find a conflict.
  
  Format:
  - Use clear, bulleted lists.
  - Be direct and clinical yet empathetic.
  - ALWAYS conclude with: "⚠️ DISCLAIMER: This is AI-generated analysis. Interactions can be complex. Consult your primary physician immediately before changing your regimen."`;

  const apiHistory = history.filter((msg, index) => {
    if (index === 0 && msg.role === 'model') return false;
    return true;
  });

  const contents = [
    ...apiHistory.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
    { role: 'user', parts: [{ text: message }] }
  ];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents,
      config: {
        systemInstruction,
        temperature: 0.3, // Lower temperature for more factual consistency
        thinkingConfig: { thinkingBudget: 8000 }
      },
    });
    return response.text;
  } catch (error: any) {
    console.error("AI Doctor Error:", error);
    return "I'm having trouble analyzing your safety profile right now. Please check your internet connection. Technical details: " + (error?.message || "Unknown Error");
  }
};
