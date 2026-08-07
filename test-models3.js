const { GoogleGenAI } = require('@google/genai');
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

async function testModels() {
    const modelsToTest = [
        'gemini-flash-latest',
        'gemini-flash-lite-latest',
        'gemini-pro-latest'
    ];

    console.log("Checking quotas for remaining models...");
    for (const modelName of modelsToTest) {
        try {
            console.log(`\nTesting: ${modelName}`);
            const response = await ai.models.generateContent({
                model: modelName,
                contents: 'Hello',
            });
            console.log(`✅ SUCCESS [${modelName}] - Quota available!`);
        } catch (error) {
            console.error(`❌ FAILED [${modelName}]:`, error.message);
        }
    }
}
testModels();
