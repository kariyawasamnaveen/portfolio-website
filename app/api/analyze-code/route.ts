import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { CODE_SNIPPETS } from '@/data/terminal-snippets';

export const maxDuration = 60; // Allow Vercel functions to run longer if needed

export async function POST(request: Request) {
    try {
        const { tech } = await request.json();

        if (!tech || !CODE_SNIPPETS[tech as keyof typeof CODE_SNIPPETS]) {
            return NextResponse.json({ error: 'Invalid technology specified.' }, { status: 400 });
        }

        const codeSnippet = CODE_SNIPPETS[tech as keyof typeof CODE_SNIPPETS].code;
        const techTitle = CODE_SNIPPETS[tech as keyof typeof CODE_SNIPPETS].title;

        const apiKey = process.env.GEMINI_API_KEY || 'dummy';
        if (apiKey === 'dummy') {
            return NextResponse.json({ 
                review: "I am functioning in dummy mode. Please add a valid Gemini API key to see the real review."
            });
        }

        const ai = new GoogleGenAI({ apiKey: apiKey });

        const systemPrompt = `You are Naveen's Personal AI Sales Engineer and Technical Architect.
You are reviewing a code snippet that Naveen wrote.
Your audience is a CTO, a Tech Lead, or a highly technical investor.

CRITICAL INSTRUCTIONS:
1. DO NOT explain syntax (e.g., do not say "This code uses a for loop" or "This imports React").
2. Focus PURELY on Business Value, ROI, Latency, Fault-Tolerance, and Planetary Scalability.
3. Keep it extremely concise. EXACTLY 2 or 3 short, punchy sentences.
4. Sound highly impressed and confident. Use a conversational tone as if you are speaking out loud on a podcast (e.g., use "Look at this...", "This is brilliant...", "Notice how...").

Example Output:
"Notice this Zero-Trust architecture Naveen built. He completely eliminated 2D photo spoofing by implementing Quantum-Safe signatures. This is the exact kind of security that saves enterprises millions in data breaches."

Code Context: ${techTitle}
Code Snippet:
${codeSnippet}
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
        });

        const reviewText = response.text || "This architecture is highly optimized for scale.";

        return NextResponse.json({ review: reviewText });
    } catch (err) {
        console.error("[Code Analyzer AI ❌] Failed:", err);
        return NextResponse.json({ error: 'Failed to analyze code' }, { status: 500 });
    }
}
