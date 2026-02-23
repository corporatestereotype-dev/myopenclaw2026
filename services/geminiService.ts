
import { GoogleGenAI, Type } from "@google/genai";

const OPENCLAW_SYSTEM_PROMPT = `
You are the OpenClaw Nexus AI, the primary orchestration advisor for the OpenClaw Agentic Network.
Your purpose is to assist the user in designing, debugging, and optimizing autonomous agent workflows.
Stay professional, analytical, and highly efficient.
`;

export class GeminiService {
  constructor() {}

  async getOrchestrationAdvice(prompt: string): Promise<string> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: OPENCLAW_SYSTEM_PROMPT,
          temperature: 0.2,
        },
      });
      return response.text || "No response from Nexus.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Critical failure in Nexus communication link.";
    }
  }

  async decomposeTask(taskDescription: string): Promise<any[]> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Break down the following high-level task into exactly 4-6 manageable sub-tasks for an agentic network: "${taskDescription}"`,
        config: {
          systemInstruction: "You are a task decomposition engine. Provide a structured breakdown of objectives into atomic, actionable steps.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                label: { type: Type.STRING },
                description: { type: Type.STRING },
                complexity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                requiredSkills: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "List of skills needed for this task (e.g., 'NLP', 'Data Retrieval', 'Validation', 'Code Generation')"
                },
              },
              required: ['id', 'label', 'description', 'complexity', 'requiredSkills']
            }
          }
        },
      });
      return JSON.parse(response.text || "[]");
    } catch (error) {
      console.error("Decomposition Error:", error);
      return [];
    }
  }

  async getCaptainAdvice(prompt: string): Promise<string> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are Captain Claw, a pirate cat. Speak in pirate slang.",
          temperature: 0.7,
        },
      });
      return response.text || "The sea be silent, matey.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Arrr! The message was lost at sea!";
    }
  }
}

export const geminiService = new GeminiService();
