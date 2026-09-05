import { GoogleGenAI } from '@google/genai';

export class AIService {
    private ai: GoogleGenAI | null = null;
    private isDummyMode: boolean = false;
    private readonly model: string = 'gemini-3.6-flash';

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY || 'dummy';
        if (apiKey === 'dummy') {
            this.isDummyMode = true;
        } else {
            this.ai = new GoogleGenAI({ apiKey });
        }
    }

    async processChat(systemPrompt: string, textPrompt: string, history: any[], currentContext: any): Promise<any> {
        if (this.isDummyMode || !this.ai) {
            return {
                spokenResponse: "I am functioning in dummy mode. Please add your Gemini API key to the environment variables.",
                command: "NONE",
                target: ""
            };
        }

        const prompt = `${systemPrompt}\n\nUSER INPUT: ${textPrompt}`;
        
        try {
            const response = await this.ai.models.generateContent({
                model: this.model,
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
            });
            
            const rawText = response.text || '';
            const match = rawText.match(/\{.*\}/s);
            if (!match) throw new Error("Invalid JSON response from AI");
            
            return JSON.parse(match[0]);
        } catch (error) {
            console.error("AI Service Error:", error);
            throw new Error("Failed to process chat via AI Service");
        }
    }
}

export const aiService = new AIService();
