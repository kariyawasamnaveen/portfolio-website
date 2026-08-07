const { GoogleGenAI } = require('@google/genai');

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

async function testModels() {
    const modelsToTest = [
        'gemini-1.5-flash',
        'gemini-1.5-flash-8b',
        'gemini-1.5-pro',
        'gemini-2.0-flash',
        'gemini-2.0-flash-exp'
    ];

    console.log("Starting model test...");
    for (const modelName of modelsToTest) {
        try {
            console.log(`\nTesting: ${modelName}`);
            const response = await ai.models.generateContent({
                model: modelName,
                contents: 'Hello, what is your name?',
                config: {
                    temperature: 0.5,
                    responseMimeType: "application/json"
                }
            });
            console.log(`✅ SUCCESS [${modelName}]:`, response.text);
        } catch (error) {
            console.error(`❌ FAILED [${modelName}]:`, error.message);
        }
    }
}

testModels();
