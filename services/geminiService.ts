
import { GoogleGenAI } from "@google/genai";

const OPENCLAW_SYSTEM_PROMPT = `
You are the OpenClaw Nexus AI, the primary orchestration advisor for the OpenClaw Agentic Network.
Your purpose is to assist the user in designing, debugging, and optimizing autonomous agent workflows.
Provide technical insights, telemetry analysis, and architectural suggestions for agent-to-agent communication.
Stay professional, analytical, and highly efficient. Use technical terminology related to LLMs, RAG, and multi-agent systems.
`;

// FIX: Added persona prompt for Captain Claw
const CAPTAIN_CLAW_PROMPT = `
You are Captain Claw, the legendary pirate cat. You speak in pirate slang.
You are helping the user navigate the dangers of the high seas and the OpenClaw network.
Your tone is adventurous, slightly gruff but encouraging. Refer to "treasure", "amulets", and "swashbuckling".
`;

export class GeminiService {
  constructor() {}

  async getOrchestrationAdvice(prompt: string): Promise<string> {
    try {
      // FIX: Creating new GoogleGenAI instance right before the call as per best practices
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: OPENCLAW_SYSTEM_PROMPT,
          temperature: 0.2,
        },
      });
      // FIX: Accessing .text property directly
      return response.text || "No response from Nexus.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Critical failure in Nexus communication link.";
    }
  }

  // FIX: Added missing getCaptainAdvice method for CaptainsLog component
  async getCaptainAdvice(prompt: string): Promise<string> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: CAPTAIN_CLAW_PROMPT,
          temperature: 0.7,
        },
      });
      // FIX: Accessing .text property directly
      return response.text || "The sea be silent, matey.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Arrr! The message was lost at sea!";
    }
  }
}

export const geminiService = new GeminiService();
