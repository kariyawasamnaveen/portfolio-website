const { GoogleGenAI } = require('@google/genai');
const apiKey = "AQ.Ab8RN6LSNVmOasPw_MSPeV7f6O8gS-6FcMsYiWgd73KiKGKZJw";
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
