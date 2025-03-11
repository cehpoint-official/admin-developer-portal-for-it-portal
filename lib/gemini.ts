import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Type definitions
interface APIError extends Error {
  status?: number;
  headers?: Record<string, string>;
}

// Constants
const MODEL_NAME = "gemini-2.0-flash";
const API_KEY = process.env.GOOGLE_API_KEY;
const DEFAULT_ERROR_MESSAGE = "An unexpected error occurred";

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(API_KEY || "");
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

/**
 * Generates structured project documentation using Google's Generative AI.
 * @param textContent - Raw project details provided by the client.
 * @returns Generated developer-friendly documentation.
 */
export async function generateDocumentationFromGeminiAI(textContent: string): Promise<any> {
  if (!API_KEY) {
    throw new Error("Google API key is not configured");
  }

  try {
    const PROMPT = `
🔹 **You are an expert Project Architect & Senior Developer.**  
Your task is to **analyze, improve, and structure** the client's developer document into a **clear, comprehensive, and developer-friendly format.**  

---

## 📌 **Client-Provided Developer Document**  
🔹 **Input Document:**  
\`\`\`
${textContent}
\`\`\`

---

## **📝 Step 1: Document Improvement**
✅ **Ensure the following improvements:**  
- Clarify any ambiguous points.  
- Add missing but **necessary** details.  
- Remove redundant or unclear statements.  
- Ensure **complete** project understanding for developers.  

---

## 📌 **Step 2: Structured Project Breakdown**  
### 🔷 **1. Project Overview**  
📌 **Project Name:** \`[Dynamically generate]\`  
📌 **Main Objective:** \`[Summarize core purpose]\`  
📌 **Key Features:**  
- ✅ \`[Dynamically generate key feature]\`  
- ✅ \`[Dynamically generate key feature]\`  
- ✅ \`[Dynamically generate key feature]\`  
📌 **Target Users:** \`[Specify end-users]\`  
📌 **Tech Stack:** \`[Dynamically define based on project]\`  

---

### 🔷 **2. Project Structure**  
📌 **Overall System Breakdown:**  
- 🏢 **Frontend**: \`[Dynamically generate frontend structure]\`  
- ⚙️ **Backend**: \`[Dynamically generate backend structure]\`  
- 📦 **Database**: \`[Dynamically define database choice]\`  
- 🔗 **API Layer**: \`[Dynamically describe API interactions]\`  
- 🔔 **Real-Time Features (if applicable)**: \`[Mention if real-time updates are needed]\`  

📌 **Role-Based Access (if applicable)**  
- 👤 **Admin Panel**: \`[If required, dynamically generate its structure]\`  
- 👨‍💻 **Developer Dashboard**: \`[If required, dynamically generate its structure]\`  
- 👥 **Client/User Panel**: \`[If applicable, generate its details]\`  

---

### 🔷 **3. Pages & Components Breakdown**  

🔹 **📌 A. [Dynamically generate page/component name]**  
📍 **Purpose:** \`[Briefly explain the purpose]\`  

📍 **Features & Functionalities:**  
✔ \`[Dynamically generate feature]\`  
✔ \`[Dynamically generate feature]\`  
✔ \`[Dynamically generate feature]\`  

📍 **Data Requirements:**  
- 🗂️ **Data Type:** \`[Specify if applicable]\`  
- 🛠️ **Source:** \`[Define API, DB, or external source]\`  

📍 **Component Breakdown (if applicable):**  
- 🧩 **[Dynamically generate component]** → \`[Describe function]\`  
- 🧩 **[Dynamically generate component]** → \`[Describe function]\`  

📍 **Implementation Notes:**  
📌 \`[List important technical notes]\`  

📍 **Table Schema (if applicable):**  
| Column Name | Data Type | Constraints |  
|------------|----------|-------------|  
| \`[Column 1]\` | \`[Type]\` | \`[Constraints]\` |  
| \`[Column 2]\` | \`[Type]\` | \`[Constraints]\` |  

📍 **API Endpoints (if applicable):**  
| Endpoint | Method | Description |  
|----------|--------|-------------|  
| \`[Dynamically generate]\` | \`GET/POST\` | \`[Describe functionality]\` |  
| \`[Dynamically generate]\` | \`PUT/DELETE\` | \`[Describe functionality]\` |  

🔹 **📌 B. [Repeat for other pages/components]**  

---

### 🔷 **4. Workflow Summary**  
📌 **Step-by-Step Breakdown**  
1️⃣ **Step 1:** \`[Describe first step]\`  
2️⃣ **Step 2:** \`[Describe second step]\`  
3️⃣ **Step 3:** \`[Describe third step]\`  
🔹 \`[Continue until complete process is explained]\`  

---

### 🔷 **5. Tech Stack & Implementation**  
📌 **Recommended Technologies:**  
✔ **Frontend:** \`[Dynamically choose]\`  
✔ **Backend:** \`[Dynamically choose]\`  
✔ **Database:** \`[Dynamically choose]\`  
✔ **Authentication:** \`[If required, specify method]\`  
✔ **Real-Time Features:** \`[If applicable, list technologies]\`  

📌 **Development Best Practices:**  
✅ **Code Structure Guidelines** \`[Dynamically suggest]\`  
✅ **Security Considerations** \`[List key security measures]\`  
✅ **Performance Optimization** \`[Provide improvement strategies]\`  

📌 **Setup Instructions:**  
\`\`\`bash
# Install dependencies
[Dynamically generate installation commands]

# Start the server
[Dynamically generate commands]
\`\`\`

📌 **Additional Recommendations:**  
📢 \`[List useful tools, frameworks, or methodologies]\`  

---

### **📌 Final Output Format**  
📄 **Ensure the document is formatted for PDF export**:  
- ✅ **Clear headings & sections**  
- ✅ **Bullet points for easy readability**  
- ✅ **Tables for structured data**  
- ✅ **Code snippets where needed**  

📌 **Developer-Ready Output** → AI must generate content in a way that developers can directly **start implementing the project without confusion.**  

---

🔹 **Generate a fully structured and developer-friendly project breakdown based entirely on the provided input document.**  

`;

    const result = await model.generateContent(PROMPT);
    const response = await result.response.text();

    // Remove any unnecessary AI-generated intro
    const cleanedResponse = response.replace(/^.*?\n\n##/, '##');
    
    return cleanedResponse;
    
  } catch (error) {
    console.error("Documentation generation error:", error);

    if (error instanceof Error) {
      const apiError = error as APIError;
      return NextResponse.json(
        {
          name: apiError.name,
          status: apiError.status,
          headers: apiError.headers,
          message: apiError.message,
        },
        { status: apiError.status || 500 }
      );
    }

    return NextResponse.json(
      { message: DEFAULT_ERROR_MESSAGE },
      { status: 500 }
    );
  }
}
