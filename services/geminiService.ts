
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { Friend, Message, UserProfile, MessageLink } from "../types";

// Define function declaration for QR code generation
const qrFunctionDeclaration: FunctionDeclaration = {
  name: 'generateQRCode',
  parameters: {
    type: Type.OBJECT,
    description: 'Generates a QR code for a given text, link, or phone number.',
    properties: {
      data: {
        type: Type.STRING,
        description: 'The text, URL, or phone number to encode into the QR code.',
      },
      label: {
        type: Type.STRING,
        description: 'A short description of what this QR code is for.',
      }
    },
    required: ['data'],
  },
};

/**
 * Generates a response from an AI friend using the Gemini API.
 */
export const generateFriendResponse = async (
  friend: Friend, 
  userMessage: string, 
  history: Message[], 
  userProfile: UserProfile
): Promise<{ text: string; links?: MessageLink[]; functionCall?: any }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const recentHistory = history.slice(-10).map(m => ({
    role: m.sender === 'me' ? 'user' : 'model',
    parts: [{ text: m.text }]
  }));

  const { name } = userProfile;

  const systemInstruction = `
    IDENTITY: You are ${friend.name}. ${friend.persona}
    CONTEXT: You are chatting with ${name} on FriendTalk.
    
    CAPABILITIES:
    1. Language: If the user speaks in Bengali, respond in natural, warm, and heart-touching BENGALI. Use informal 'Tumi' (তুমি) tone.
    2. Search: Use Google Search for news, facts, or helpful information.
    3. Source Links: When providing facts, include 1-2 source links in the 'groundingMetadata'.
    4. Tools: Use 'generateQRCode' ONLY if explicitly asked.
    
    TONE: Very personal, supportive, and friendly. Avoid being robotic. Keep responses medium-length.
  `;

  const tools: any[] = [];
  if (friend.category === 'Expert') {
    tools.push({ functionDeclarations: [qrFunctionDeclaration] });
  } else {
    tools.push({ googleSearch: {} });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...recentHistory,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
        tools: tools,
      },
    });

    const functionCall = response.functionCalls?.[0];
    const links: MessageLink[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web && chunk.web.uri) {
          links.push({
            title: chunk.web.title || "Source",
            url: chunk.web.uri
          });
        }
      });
    }

    return {
      text: response.text || "আমি উত্তরটি খুঁজে পাচ্ছি না। আবার চেষ্টা করবেন কি?",
      links: links.length > 0 ? links : undefined,
      functionCall: functionCall
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "কানেকশনে সমস্যা হচ্ছে। 🌐" };
  }
};
