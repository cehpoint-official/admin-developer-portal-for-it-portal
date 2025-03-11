"use server";

import { extractTextFromPdf } from "@/lib/langchain";

export async function generateDeveloperDocumentationFromPdf(uploadResponse: {
  name: string;
  url: string;
}) {
  if (!uploadResponse) {
    return {
      success: false,
      message: "No upload response provided",
      data: null,
    };
    }
    
    try {
        const extractedText = await extractTextFromPdf(uploadResponse.url);
        const extractedTextLines = extractedText.split("\n");
        console.log(extractedTextLines);
        
    } catch (error) {
        
    }
}
