import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Define an interface for the expected error structure
interface APIError extends Error {
    status?: number;
    headers?: Record<string, string>;
}

// Constants
const PROMPT = `You are a highly advanced code generation AI model. When I provide a title and description, your task is to analyze the input and generate the most efficient, accurate, and well-documented code solution. Please ensure the following criteria are met in your response:
1. **Clarity**: The code should be easy to read and understand.
2. **Efficiency**: Optimize the code for performance. Avoid unnecessary computations and use efficient algorithms where applicable.
3. **Best Practices**: Follow coding best practices for the specified programming language, including naming conventions, error handling, and modularization.

Input Format:
- title: [Insert title of the code or topic]
- description: [Insert description of the code or topic]
- language: [Specify the programming language]

Output Format:
- GeneratedCode: [Insert generated code here]

Respond only with the generated code without any additional explanations.`;

const MODEL_NAME = "gemini-2.0-flash";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

export async function POST(req: NextRequest) {
    try {
        const { title, description, language } = await req.json();

        // Validate input
        if (!title || !description || !language) {
            return NextResponse.json({
                error: "Missing required fields: title, description, or language",
                status: 400
            });
        }

        const prompt = `${PROMPT}\n\ntitle: ${title}\ndescription: ${description}\nLanguage: ${language}`;
        const result = await model.generateContent(prompt);

        const text = await result.response.text();
        console.log("Suggested Messages backend:", text);
        return NextResponse.json({ suggestedMessages: text });
    } catch (error: unknown) {
        console.error("An error occurred:", error);

        if (error instanceof Error) {
            const apiError = error as APIError;
            const { name, status, headers, message } = apiError;

            return NextResponse.json(
                { name, status, headers, message },
                { status: status || 500 }
            );
        }

        return NextResponse.json(
            { message: "An unknown error occurred" },
            { status: 500 }
        );
    }
}