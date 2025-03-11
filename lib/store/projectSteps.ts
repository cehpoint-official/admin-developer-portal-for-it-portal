// src/stores/projectFormStore.ts
import { create } from "zustand";
import { z } from "zod";
import { useAuthStore } from "./userStore";

export interface ProjectFormData {
  projectName: string
  projectOverview: string
  developmentAreas: string[]
  seniorDevelopers: number
  juniorDevelopers: number
  uiUxDesigners: number
  documentationFile: File | null
  documentationFileContent: string | null
  documentationFileText: string | null
  generatedDocumentation: string
  improvedDocumentation: string | null
  quotationPdf: string | null
  clientName: string
  clientEmail: string
  clientPhoneNumber: string
}

// Define validation schemas for each step
const projectDetailsSchema = z.object({
  projectName: z.string().min(10, "Project name must be at least 10 characters"),
  projectOverview: z.string().min(100, "Project overview must be at least 100 characters"),
  clientName: z.string().min(3, "Client name must be at least 3 characters"),
  clientEmail: z.string().email("Please enter a valid email address"),
  clientPhoneNumber: z.string().min(10, "Please enter a valid phone number"),
})

const developmentPreferencesSchema = z
  .object({
    developmentAreas: z.array(z.string()).min(1, "At least one development area is required"),
    seniorDevelopers: z.number(),
    juniorDevelopers: z.number(),
    uiUxDesigners: z.number(),
  })
  .refine((data) => data.seniorDevelopers + data.juniorDevelopers + data.uiUxDesigners > 0, {
    message: "At least one team member is required",
    path: ["teamMembers"],
  })

const documentationSchema = z
  .object({
    documentationFile: z.any().optional(),
    documentationFileContent: z.string().nullable(),
    documentationFileText: z.string().nullable(),
    generatedDocumentation: z.string().optional(),
    improvedDocumentation: z.string().nullable(),
  })
  .refine(
    (data) =>
      data.documentationFile !== null || data.generatedDocumentation !== "" || data.improvedDocumentation !== null,
    {
      message: "Either upload a file or generate documentation",
      path: ["documentation"],
    },
  )

// Define the store type
interface ProjectFormStore {
  // State
  step: number
  formData: ProjectFormData
  validationErrors: Record<string, string>
  
  // Actions
  nextStep: () => void
  prevStep: () => void
  updateFormData: (data: Partial<ProjectFormData>) => void
  validateCurrentStep: () => Promise<boolean>
  generateQuotation: () => void
  resetForm: () => void
  syncUserData: () => void  // New function to sync user data from auth store
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
}

// Create the Zustand store
export const useProjectFormStore = create<ProjectFormStore>((set, get) => ({
  // Initial state
  step: 1,
  formData: { ...defaultFormData },
  validationErrors: {},
  
  // Actions
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 4) })),
  
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  
  updateFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),
  
  // Function to sync user data from auth store to form data

syncUserData: () => {
  const authState = useAuthStore.getState()
  const profile = authState.profile
  
  if (profile) {
    set((state) => ({
      formData: {
        ...state.formData,
        clientName: profile.name || "",
        clientEmail: profile.email || "",
        clientPhoneNumber: profile.phone || "",
      }
    }))
  }
},
  
  validateCurrentStep: async () => {
    const { step, formData } = get()
    
    try {
      if (step === 1) {
        await projectDetailsSchema.parseAsync({
          projectName: formData.projectName,
          projectOverview: formData.projectOverview,
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          clientPhoneNumber: formData.clientPhoneNumber,
        })
      } else if (step === 2) {
        await developmentPreferencesSchema.parseAsync({
          developmentAreas: formData.developmentAreas,
          seniorDevelopers: formData.seniorDevelopers,
          juniorDevelopers: formData.juniorDevelopers,
          uiUxDesigners: formData.uiUxDesigners,
        })
      } else if (step === 3) {
        await documentationSchema.parseAsync({
          documentationFile: formData.documentationFile,
          documentationFileContent: formData.documentationFileContent,
          documentationFileText: formData.documentationFileText,
          generatedDocumentation: formData.generatedDocumentation,
          improvedDocumentation: formData.improvedDocumentation,
        })
      }

      set({ validationErrors: {} })
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path.join(".")] = err.message
          }
        })
        set({ validationErrors: errors })
      }
      return false
    }
  },
  
  generateQuotation: () => {
    const { formData } = get()
    
    // Prevent generating if already generated to avoid infinite loops
    if (formData.quotationPdf) return

    // Calculate cost based on team composition
    const seniorDevCost = formData.seniorDevelopers * 75000
    const juniorDevCost = formData.juniorDevelopers * 30000
    const uiUxCost = formData.uiUxDesigners * 8000
    const totalCost = seniorDevCost + juniorDevCost + uiUxCost

    // Generate HTML for the quotation
    const quotationHtml = `
    <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 0;
          }
          .container {
            position: relative;
            width: 800px;
            height: max-content;
            overflow: auto;
            border: 1px solid black;
            padding: 32px 16px 8px 16px;
          }
          h2 {
            font-size: 3rem;
            font-weight: bold;
            color: #0891b2;
            padding: 0 16px;
            margin: 0;
          }
          .section {
            margin-top: 32px;
          }
          .section-header {
            width: 100%;
            height: max-content;
            background-color: #94a3b8;
            padding: 8px 16px;
          }
          .section-header h4 {
            font-weight: 600;
            color: #0f172a;
            margin: 0;
          }
          .section-content {
            padding: 8px 16px;
            margin-top: 8px;
          }
          .info-line {
            font-weight: bold;
            color: #334155;
            margin: 4px 0;
          }
          .info-line span {
            font-weight: 500;
            color: #1e293b;
            font-size: 0.875rem;
          }
          table {
            width: 100%;
            margin-top: 32px;
            border-collapse: collapse;
          }
          th {
            background-color: #94a3b8;
            padding: 8px;
            text-align: left;
            border: 1px solid #1e293b;
          }
          td {
            padding: 8px;
            border: 1px solid #e2e8f0;
          }
          .total-row {
            border-bottom: 2px solid #0f172a;
          }
          .font-bold {
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Quotation</h2>
          
          <div class="section">
            <div class="section-header">
              <h4>CLIENT INFORMATION :</h4>
            </div> 
            <div class="section-content">
              <p class="info-line">Name : <span>${formData.clientName}</span></p>
              <p class="info-line">Email : <span>${formData.clientEmail}</span></p>
              <p class="info-line">Phone : <span>${formData.clientPhoneNumber}</span></p>
            </div>
          </div>
          
          <div class="section">
            <table>
              <tbody>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
                ${
                  formData.seniorDevelopers > 0
                    ? `<tr>
                        <td class="font-bold">Senior Developer</td>
                        <td>${formData.seniorDevelopers}</td>
                        <td>Rs 70000</td>
                        <td>${seniorDevCost}</td>
                      </tr>`
                    : ""
                }
                ${
                  formData.juniorDevelopers > 0
                    ? `<tr>
                        <td class="font-bold">Junior Developer</td>
                        <td>${formData.juniorDevelopers}</td>
                        <td>Rs 40000</td>
                        <td>${juniorDevCost}</td>
                      </tr>`
                    : ""
                }
                ${
                  formData.uiUxDesigners > 0
                    ? `<tr>
                        <td class="font-bold">UI/UX Designer</td>
                        <td>${formData.uiUxDesigners}</td>
                        <td>Rs 8000</td>
                        <td>${uiUxCost}</td>
                      </tr>`
                    : ""
                }
                <tr class="total-row">
                  <td class="font-bold">Others(Project management)</td>
                  <td></td>
                  <td></td>
                  <td>Rs 50000</td>
                </tr>
                <tr class="total-row">
                  <td class="font-bold">Grand total</td>
                  <td></td>
                  <td></td>
                  <td>Rs ${totalCost}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <div class="section-header">
              <h4>PROJECT INFORMATION :</h4>
            </div>
            <div class="section-content">
              <p class="info-line">
                Project Name : <span>${formData.projectName}</span>
              </p>
              <p class="info-line">
                Project Overview : <span>${formData.projectOverview}</span>
              </p>
              <p class="info-line">
                Development Areas : <span>${formData.developmentAreas.join(", ")}</span>
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
    
    get().updateFormData({ quotationPdf: quotationHtml })
  },
  
  resetForm: () => set({ 
    step: 1, 
    formData: { ...defaultFormData },
    validationErrors: {}
  }),
}))