"use server";

import { extractTextFromPdf } from "@/lib/langchain";
import { generateDocumentationFromGeminiAI } from "@/lib/gemini";

// Type definitions
interface UploadResponse {
  name: string;
  url: string;
}

interface DocumentationResult {
  success: boolean;
  message: string;
  data: {
    improvedDocumentation?: any;
  } | null;
}

/**
 * Sanitizes text to only include alphabetic characters
 * @param text - The text to sanitize
 * @returns Sanitized text with only alphabetic characters
 */
function sanitizeText(text: string): string {
  return text.replace(/[^a-zA-Z\s]/g, "").trim();
}

/**
 * Main function to generate developer documentation from a PDF file
 * @param uploadResponse - The upload response containing file information
 * @returns Result of the documentation generation process
 */
export async function generateDeveloperDocumentationFromPdf(
  uploadResponse: UploadResponse
): Promise<DocumentationResult> {
  // Input validation
  if (!uploadResponse?.url) {
    return {
      success: false,
      message: "Missing file URL in upload response",
      data: null,
    };
  }

  try {
    // Step 1: Extract text from PDF
    const extractedText = await extractTextFromPdf(uploadResponse.url);
    
    // Step 2: Process the extracted text - convert to array, sanitize, and filter
    const processedTextLines = extractedText
      .split('\n')
      .map(line => sanitizeText(line))
      .filter(line => line.length > 0); // Remove empty lines
    
    if (processedTextLines.length === 0) {
      return {
        success: false,
        message: "No valid text content found in the PDF",
        data: null,
      };
    }
    
    // Step 3: Convert array to a single paragraph string
    const extractedTextParagraph = processedTextLines.join(' ');
    console.log(extractedTextParagraph);
    
    // Step 4: Generate improved documentation using the paragraph text
    const improvedDocumentation = await generateDocumentationFromGeminiAI(extractedTextParagraph);
    
    if (!improvedDocumentation) {
      return {
        success: false,
        message: "Failed to generate documentation - no content returned",
        data: null,
      };
    }
    
    // Success! Return the generated documentation
    return {
      success: true,
      message: "Documentation generated successfully",
      data: {
        improvedDocumentation,
      },
    };
  } catch (error) {
    // Comprehensive error handling
    const errorMessage = error instanceof Error 
      ? error.message 
      : "An unexpected error occurred";
    
    console.error("Documentation generation failed:", errorMessage);
    
    return {
      success: false,
      message: `Documentation generation failed: ${errorMessage}`,
      data: null,
    };
  }
}