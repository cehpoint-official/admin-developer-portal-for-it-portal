// src/stores/projectFormStore.ts
import { create } from "zustand";
import { z } from "zod";
import { useAuthStore } from "./userStore";

export interface ProjectFormData {
  projectName: string;
  projectOverview: string;
  developmentAreas: string[];
  seniorDevelopers: number;
  juniorDevelopers: number;
  uiUxDesigners: number;
  documentationFile: File | null;
  documentationFileContent: string | null;
  documentationFileText: string | null;
  generatedDocumentation: string | null | any;
  improvedDocumentation: string | null;
  quotationPdf: string | null;
  clientName: string;
  clientEmail: string;
  clientPhoneNumber: string;
  // Cloudinary URLs
  cloudinaryDocumentationUrl: string | null;
  cloudinaryQuotationUrl: string | null;
  projectBudget: number; // Add this new field
}

// Define validation schemas for each step
const projectDetailsSchema = z.object({
  projectName: z
    .string()
    .min(10, "Project name must be at least 10 characters"),
  projectOverview: z
    .string()
    .min(100, "Project overview must be at least 100 characters"),
  clientName: z.string().min(3, "Client name must be at least 3 characters"),
  clientEmail: z.string().email("Please enter a valid email address"),
  clientPhoneNumber: z.string().min(10, "Please enter a valid phone number"),
});

const developmentPreferencesSchema = z
  .object({
    developmentAreas: z
      .array(z.string())
      .min(1, "At least one development area is required"),
    seniorDevelopers: z.number(),
    juniorDevelopers: z.number(),
    uiUxDesigners: z.number(),
  })
  .refine(
    (data) =>
      data.seniorDevelopers + data.juniorDevelopers + data.uiUxDesigners > 0,
    {
      message: "At least one team member is required",
      path: ["teamMembers"],
    }
  );

const documentationSchema = z
  .object({
    documentationFile: z.any().optional(),
    documentationFileContent: z.string().nullable(),
    documentationFileText: z.string().nullable(),
    generatedDocumentation: z.string().optional(),
    improvedDocumentation: z.string().nullable(),
    cloudinaryDocumentationUrl: z.string().nullable().optional(),
  })
  .refine(
    (data) =>
      data.documentationFile !== null ||
      data.generatedDocumentation !== "" ||
      data.improvedDocumentation !== null ||
      data.cloudinaryDocumentationUrl !== null,
    {
      message: "Either upload a file or generate documentation",
      path: ["documentation"],
    }
  );

// Define the store type
interface ProjectFormStore {
  // State
  step: number;
  formData: ProjectFormData;
  validationErrors: Record<string, string>;

  // Actions
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<ProjectFormData>) => void;
  validateCurrentStep: () => Promise<boolean>;
  generateQuotation: () => void;
  resetForm: () => void;
  syncUserData: () => void; // New function to sync user data from auth store
}

// Default form data without user info
const defaultFormData: ProjectFormData = {
  projectName: "",
  projectOverview: "",
  developmentAreas: [],
  seniorDevelopers: 0,
  juniorDevelopers: 0,
  uiUxDesigners: 0,
  documentationFile: null,
  documentationFileContent: null,
  documentationFileText: null,
  generatedDocumentation: "",
  improvedDocumentation: null,
  quotationPdf: null,
  clientName: "",
  clientEmail: "",
  clientPhoneNumber: "",
  cloudinaryDocumentationUrl: null,
  cloudinaryQuotationUrl: null,
  projectBudget: 0, // Add this new field with default value
};

// Create the Zustand store
export const useProjectFormStore = create<ProjectFormStore>((set, get) => ({
  // Initial state
  step: 1,
  formData: { ...defaultFormData },
  validationErrors: {},

  // Actions
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 4) })),

  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),

  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  // Function to sync user data from auth store to form data

  syncUserData: () => {
    const authState = useAuthStore.getState();
    const profile = authState.profile;

    if (profile) {
      set((state) => ({
        formData: {
          ...state.formData,
          clientName: profile.name || "",
          clientEmail: profile.email || "",
          clientPhoneNumber: profile.phone || "",
        },
      }));
    }
  },

  validateCurrentStep: async () => {
    const { step, formData } = get();

    try {
      if (step === 1) {
        await projectDetailsSchema.parseAsync({
          projectName: formData.projectName,
          projectOverview: formData.projectOverview,
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          clientPhoneNumber: formData.clientPhoneNumber,
        });
      } else if (step === 2) {
        await developmentPreferencesSchema.parseAsync({
          developmentAreas: formData.developmentAreas,
          seniorDevelopers: formData.seniorDevelopers,
          juniorDevelopers: formData.juniorDevelopers,
          uiUxDesigners: formData.uiUxDesigners,
        });
      } else if (step === 3) {
        await documentationSchema.parseAsync({
          documentationFile: formData.documentationFile,
          documentationFileContent: formData.documentationFileContent,
          documentationFileText: formData.documentationFileText,
          generatedDocumentation: formData.generatedDocumentation,
          improvedDocumentation: formData.improvedDocumentation,
          cloudinaryDocumentationUrl: formData.cloudinaryDocumentationUrl,
        });
      }

      set({ validationErrors: {} });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path.join(".")] = err.message;
          }
        });
        set({ validationErrors: errors });
      }
      return false;
    }
  },

  generateQuotation: () => {
    const { formData } = get();

    // Calculate cost based on team composition
    const seniorDevCost = formData.seniorDevelopers * 75000;
    const juniorDevCost = formData.juniorDevelopers * 30000;
    const uiUxCost = formData.uiUxDesigners * 8000;
    const totalCost = seniorDevCost + juniorDevCost + uiUxCost + 50000;
    // Set the projectBudget value to totalCost
    get().updateFormData({ projectBudget: totalCost });
    // Generate HTML for the quotation
    const quotationHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    :root {
      --primary-color: #2563eb;
      --secondary-color: #1e40af;
      --text-color: #1f2937;
      --border-color: #e5e7eb;
      --background-light: #f3f4f6;
    }
    
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      color: var(--text-color);
      margin: 0;
      padding: 0;
      background-color: #ffffff;
    }

    .container {
      max-width: 1000px;
      margin: 2rem auto;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border-radius: 8px;
      background-color: white;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      padding-bottom: 2rem;
      border-bottom: 2px solid var(--border-color);
      margin-bottom: 2rem;
    }

    .company-info {
      flex: 1;
    }

    .company-name {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary-color);
      margin: 0;
      line-height: 1.2;
    }

    .company-details {
      margin-top: 1rem;
      font-size: 0.875rem;
      color: #4b5563;
    }

    .quotation-title {
      text-align: right;
      flex: 1;
    }

    .quotation-title h1 {
      font-size: 2.5rem;
      color: var(--secondary-color);
      margin: 0;
      font-weight: 800;
    }

    .quotation-date {
      color: #6b7280;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }

    .section {
      margin: 2rem 0;
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }

    .section-header {
      background-color: var(--background-light);
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border-color);
    }

    .section-header h3 {
      margin: 0;
      color: var(--primary-color);
      font-size: 1.25rem;
      font-weight: 600;
    }

    .section-content {
      padding: 1.5rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .info-item {
      margin-bottom: 0.5rem;
    }

    .info-label {
      font-weight: 600;
      color: #4b5563;
      margin-bottom: 0.25rem;
    }

    .info-value {
      color: var(--text-color);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      font-size: 0.875rem;
    }

    th {
      background-color: var(--background-light);
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: var(--primary-color);
      border-bottom: 2px solid var(--border-color);
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    .total-section {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 2px solid var(--border-color);
    }

    .total-row {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0.5rem 0;
      font-weight: 600;
    }

    .total-label {
      margin-right: 2rem;
      color: var(--primary-color);
    }

    .total-amount {
      font-size: 1.25rem;
      color: var(--secondary-color);
    }

    .footer {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border-color);
      text-align: center;
      font-size: 0.875rem;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="company-info">
        <h1 class="company-name">CEHPOINT</h1>
        <div class="company-details">
          <p>services.cehpoint.co.in</p>
          <p>Email: info@cehpoint.co.in</p>
          <p>Corporate number (IVR): +91 33 6902 9331</p>
        </div>
      </div>
      <div class="quotation-title">
        <h1>QUOTATION</h1>
        <div class="quotation-date">Date: ${new Date().toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <h3>Client Information</h3>
      </div>
      <div class="section-content">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Name</div>
            <div class="info-value">${formData.clientName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value">${formData.clientEmail}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Phone</div>
            <div class="info-value">${formData.clientPhoneNumber}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <h3>Project Details</h3>
      </div>
      <div class="section-content">
        <div class="info-item">
          <div class="info-label">Project Name</div>
          <div class="info-value">${formData.projectName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Development Areas</div>
          <div class="info-value">${formData.developmentAreas.join(", ")}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Project Overview</div>
          <div class="info-value">${formData.projectOverview}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <h3>Cost Breakdown</h3>
      </div>
      <div class="section-content">
        <table>
          <thead>
            <tr>
              <th>Resource</th>
              <th>Quantity</th>
              <th>Rate (₹)</th>
              <th>Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${
              formData.seniorDevelopers > 0
                ? `
            <tr>
              <td>Senior Developer</td>
              <td>${formData.seniorDevelopers}</td>
              <td>75,000</td>
              <td>${seniorDevCost.toLocaleString("en-IN")}</td>
            </tr>
            `
                : ""
            }
            ${
              formData.juniorDevelopers > 0
                ? `
            <tr>
              <td>Junior Developer</td>
              <td>${formData.juniorDevelopers}</td>
              <td>30,000</td>
              <td>${juniorDevCost.toLocaleString("en-IN")}</td>
            </tr>
            `
                : ""
            }
            ${
              formData.uiUxDesigners > 0
                ? `
            <tr>
              <td>UI/UX Designer</td>
              <td>${formData.uiUxDesigners}</td>
              <td>8,000</td>
              <td>${uiUxCost.toLocaleString("en-IN")}</td>
            </tr>
            `
                : ""
            }
            <tr>
              <td>Project Management & Infrastructure</td>
              <td>1</td>
              <td>50,000</td>
              <td>50,000</td>
            </tr>
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-row">
            <span class="total-label">Total Amount</span>
            <span class="total-amount">₹ ${totalCost.toLocaleString(
              "en-IN"
            )}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>Thank you for choosing CEHPOINT. We look forward to working with you!</p>
      <p>This quotation is valid for 30 days from the date of issue.</p>
    </div>
  </div>
</body>
</html>
    `;

    get().updateFormData({ quotationPdf: quotationHtml });
  },

  resetForm: () =>
    set({
      step: 1,
      formData: { ...defaultFormData },
      validationErrors: {},
    }),
}));
