import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const analyzeTestResult = async (apiData, testResult) => {
    try {
        const prompt = `You are an expert API quality and security analyst.
        I ran a test against an API endpoint with the following details: 
        Url: ${apiData.url}
        method: ${apiData.method}
        Body Sent: ${JSON.stringify(apiData.body || {})}

        The API responded with: 
        Time: ${testResult.responseTime}ms
        Status Code: ${testResult.status}
        Response Data: ${JSON.stringify(testResult.responseData)}

        Please analyze this result.
        1. If it's a failure (status 400+), clearly explain why it likely failed based on the status code and response body.
        2. Point out any potential security issues, data leaks, or performance warnings.
        Keep the explanation short, helpful, and formatted as plain text (max 3 sentences).
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (err) {
        console.error("AI Analysis Failed:", err);
        return "AI Analysis Failed: " + err.message;
    }
}