import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();
    const { component, message, data } = body;

    // Print to server terminal
    console.log(`\x1b[36m[${component}]\x1b[0m ${message}`, data ? data : '');

    return NextResponse.json({ success: true });
}
