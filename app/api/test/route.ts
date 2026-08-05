import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return NextResponse.json({ error: "No API key" }, { status: 500 });
        
        const ai = new GoogleGenAI({ apiKey: apiKey });
        const response = await ai.models.list();
        
        const models = [];
        for await (const model of response) {
            models.push(model.name);
        }
        
        return NextResponse.json({ models });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
