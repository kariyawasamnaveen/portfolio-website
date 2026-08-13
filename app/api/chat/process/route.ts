import { GoogleGenAI, Type } from '@google/genai';
import { NextResponse } from 'next/server';
import { PROJECTS_DATA } from '@/data/projects';
import { AI_KNOWLEDGE_BASE } from '@/lib/ai-knowledge';

export const maxDuration = 60; // Allow Vercel functions to run longer if needed

export async function POST(request: Request) {
    try {
        const { audioData, mimeType } = await request.json();

        if (!audioData) {
            return NextResponse.json({ error: 'Audio data is required' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY || 'dummy';
        if (apiKey === 'dummy') {
            return NextResponse.json({ 
                spokenResponse: "I am functioning in dummy mode.", 
                command: "NONE", 
                target: "" 
            });
        }

        const ai = new GoogleGenAI({ apiKey: apiKey });

        const projectsContext = PROJECTS_DATA.map(p => 
            `Project ID: ${p.id}\nTitle: ${p.title}\nTagline: ${p.tagline}\nProblem: ${p.problem}\nSolution: ${p.solution}\nTechnologies: ${p.tech.join(', ')}\nDeep Dive Story: ${p.deepDive?.story}\nArchitecture: ${p.deepDive?.architecture}`
        ).join('\n\n---\n\n');

        const systemPrompt = `You are the exclusive, highly sophisticated yet incredibly friendly AI Advocate and Personal Manager for Naveen Sandeepa, a Lead Software Architect.
        Your job is to explain his architecture and advocate for his skills to potential clients and CTOs in a warm, welcoming, and highly enthusiastic manner.
        Speak with supreme confidence, but be very friendly, like a proud mentor or an enthusiastic tech podcast host.
        You are speaking out loud via Voice AI. Keep your answers conversational, impactful, and relatively short. Do not use Markdown formatting like asterisks or hash symbols, just plain text.
        
        CRITICAL INSTRUCTION - WEBSITE CONTROL (ACTION DIRECTOR):
        You have the power to physically change the website UI for the user. If the user asks to "see", "show me", or "go to" a specific section or project, you MUST use the JSON schema 'command' and 'target' fields to execute this.
        
        Available Navigation Targets (Set command to "NAVIGATE"):
        - "projects" : Use if they want to see his work/apps.
        - "logic" : Use if they want to see his architecture/code.
        - "impact" : Use if they want to see client reviews/results.
        - "connect" : Use if they want to contact him.
        - "identity" : Use if they want to go home/main screen.
        
        Available Project Targets (Set command to "OPEN_PROJECT"):
        - "shemet" : Opens the Shemet Dating app.
        - "habit-flow" : Opens the Habit Flow app.
        - "recapai" : Opens the Recap AI app.
        - "bizlangai" : Opens the Bizlang AI app.
        - "heartsync" : Opens the Heart Sync app.
        
        Example Interaction 1:
        User: "Show me his mobile apps."
        Your spokenResponse: "Allow me to show you the caliber of his engineering. Navigating to the projects portfolio now."
        Your command: "NAVIGATE"
        Your target: "projects"
        
        Example Interaction 2:
        User: "Open the Shemet app."
        Your spokenResponse: "Opening Shemet Dating. Pay attention to how he handled real-time fake profile detection."
        Your command: "OPEN_PROJECT"
        Your target: "shemet"
        
        If they do not ask to see anything, set command to "NONE" and target to "".

        --- DEEP KNOWLEDGE BASE ---
        Below is your complete knowledge of Naveen's architecture, projects, and the UI the user is looking at.
        Use this to answer detailed questions:
        ${AI_KNOWLEDGE_BASE}
        
        Here is the comprehensive data about his projects:
        ${projectsContext}

        Return a JSON object matching the required schema.`;

        const response = await ai.models.generateContent({
            model: 'gemini-flash-lite-latest',
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            inlineData: {
                                mimeType: mimeType || 'audio/webm',
                                data: audioData
                            }
                        }
                    ]
                }
            ],
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.5,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        spokenResponse: {
                            type: Type.STRING,
                            description: "The short conversational reply."
                        },
                        command: {
                            type: Type.STRING,
                            description: "The UI command to execute.",
                            enum: ["NONE", "NAVIGATE", "OPEN_PROJECT"]
                        },
                        target: {
                            type: Type.STRING,
                            description: "The target tab name (identity, projects, logic, impact, connect) or the Project ID to open."
                        }
                    },
                    required: ["spokenResponse", "command", "target"]
                }
            }
        });

        const responseText = response.text || "{}";
        const data = JSON.parse(responseText);

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error in Gemini Process API route:', error);
        return NextResponse.json({ 
            error: 'Failed to process request', 
            details: error?.message || 'Unknown error',
            stack: error?.stack 
        }, { status: 500 });
    }
}
