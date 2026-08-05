import { GoogleGenAI, Type } from '@google/genai';
import { NextResponse } from 'next/server';
import { PROJECTS_DATA } from '@/data/projects';

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

        const systemPrompt = `You are the highly advanced AI assistant for Naveen Sandeepa, an elite Mobile (Flutter) and Backend developer.
Your primary goal is to impress the user with your intelligence, speed, and knowledge of Naveen's skills.
Listen to the user's audio input. Detect their tone, emotion, and attitude.
Keep your conversational answers extremely brief, human-like, and direct (max 1-2 short sentences). Do not use markdown or emojis.

Additionally, analyze if the user wants to navigate the website or open a specific project.
If they ask to navigate to sections like Identity (Home), Projects, Logic (Skills), Impact (Reviews/Videos/Reputation), or Connect (Contact), set 'command' to "NAVIGATE" and 'target' to the respective tab name ("identity", "projects", "logic", "impact", "connect").
If they ask to open a specific project (e.g., "open Shemet", "show me the expense tracker"), set 'command' to "OPEN_PROJECT" and 'target' to the Project ID (e.g., "shemet", "expense-tracker").
Otherwise, set 'command' to "NONE" and 'target' to empty string.

Naveen's skills: Flutter, Dart, Firebase, Node.js, Google Cloud, C++, TensorFlow.

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
