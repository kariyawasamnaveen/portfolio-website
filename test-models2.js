const { GoogleGenAI } = require('@google/genai');
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

async function testModels() {
    const modelsToTest = [
        'gemini-2.5-flash',
        'gemini-flash-latest',
        'gemini-flash-lite-latest',
        'gemini-2.0-flash-lite'
    ];

    console.log("Starting second model test...");
    for (const modelName of modelsToTest) {
        try {
            console.log(`\nTesting: ${modelName}`);
            const response = await ai.models.generateContent({
                model: modelName,
                contents: 'Hello',
                config: { temperature: 0.5 }
            });
            console.log(`✅ SUCCESS [${modelName}]:`, response.text);
        } catch (error) {
            console.error(`❌ FAILED [${modelName}]:`, error.message);
        }
    }
}
testModels();
