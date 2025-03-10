"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUp, FileText, Download, RefreshCw, Wand2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useProjectFormStore } from "@/lib/store/projectSteps"
import { Editor } from "../Editor"
import { PdfViewer } from "../PdfViewer"


export function Documentation() {
  const { formData, updateFormData, generateQuotation } = useProjectFormStore()
  const [activeTab, setActiveTab] = useState("upload")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isImproving, setIsImproving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [fileName, setFileName] = useState<string>("")
  console.log(formData);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFileName(file.name)

      // Read the file content
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target) {
          // For PDF files, we'll store the data URL
          const fileContent = event.target.result as string
          updateFormData({
            documentationFile: file,
            documentationFileContent: fileContent,
          })
        }
      }

      if (file.type === "application/pdf") {
        reader.readAsDataURL(file)
      } else {
        reader.readAsText(file)
      }
    }
  }

  const generateDocumentation = () => {
    setIsGenerating(true)

    // Simulate API call to generate documentation
    setTimeout(() => {
      const generatedDoc = generateSampleDocumentation(
        formData.projectName,
        formData.projectOverview,
        formData.developmentAreas,
      )

      updateFormData({ generatedDocumentation: generatedDoc })
      setIsGenerating(false)
    }, 2000)
  }

  const improveDocumentation = () => {
    setIsImproving(true)

    // Simulate AI improving the documentation
    setTimeout(() => {
      const improvedDoc = `
        <h1>🚀 Enhanced Documentation for ${formData.projectName}</h1>
        
        <h2>Project Overview (AI Improved)</h2>
        <p>${formData.projectOverview}</p>
        <p>This documentation has been enhanced by AI to provide clearer instructions and better structure for developers.</p>
        
        <h2>Development Areas</h2>
        <ul>
          ${formData.developmentAreas.map((area) => `<li><strong>${area}</strong> - Detailed implementation guidelines</li>`).join("")}
        </ul>
        
        <h2>1. Technical Architecture</h2>
        
        <h3>🔹 System Components</h3>
        <ul>
          <li><strong>Frontend:</strong> Next.js with TypeScript</li>
          <li><strong>Backend:</strong> Node.js with Express</li>
          <li><strong>Database:</strong> MongoDB for flexible document storage</li>
          <li><strong>Authentication:</strong> JWT with refresh token rotation</li>
        </ul>
        
        <h3>📌 A. Component Structure</h3>
        
        <p><strong>Recommended Pattern:</strong> Atomic Design</p>
        <ul>
          <li>✅ Atoms: Basic UI components (buttons, inputs)</li>
          <li>✅ Molecules: Combinations of atoms (forms, cards)</li>
          <li>✅ Organisms: Complex UI sections (headers, sidebars)</li>
          <li>✅ Templates: Page layouts</li>
          <li>✅ Pages: Complete views</li>
        </ul>
        
        <h2>2. Implementation Guidelines</h2>
        
        <h3>✔ Code Quality Standards</h3>
        <ul>
          <li>ESLint configuration for consistent code style</li>
          <li>Unit tests with Jest covering at least 80% of code</li>
          <li>Integration tests for critical user flows</li>
          <li>Pre-commit hooks for code quality checks</li>
        </ul>
        
        <h3>✔ Performance Optimization</h3>
        <ul>
          <li>Implement code splitting for faster initial load</li>
          <li>Use React.memo and useMemo for expensive calculations</li>
          <li>Optimize images with next/image</li>
          <li>Implement proper caching strategies</li>
        </ul>
        
        <h2>3. Deployment Strategy</h2>
        
        <h3>✔ CI/CD Pipeline</h3>
        <ul>
          <li>GitHub Actions for automated testing</li>
          <li>Vercel for frontend deployment</li>
          <li>Docker containers for backend services</li>
          <li>Database migrations with safety checks</li>
        </ul>
      `

      updateFormData({ improvedDocumentation: improvedDoc })
      setIsImproving(false)
    }, 3000)
  }

  const handleEditorChange = (value: string) => {
    updateFormData({ generatedDocumentation: value })
  }

  const handleImprovedEditorChange = (value: string) => {
    updateFormData({ improvedDocumentation: value })
  }

  // Generate quotation when reaching this step
  useEffect(() => {
    generateQuotation()
  }, [generateQuotation])

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Step 3/4</p>
        <h2 className="text-2xl font-bold text-foreground">Share Your Documentation</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="upload">Upload Document</TabsTrigger>
          <TabsTrigger value="generate">Generate Document</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4 pt-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <FileUp className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-medium">Upload your requirements document</h3>
            <p className="text-sm text-muted-foreground mb-4">PDF, DOCX, or TXT files up to 10MB</p>

            <div className="flex justify-center">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
              />
              <Label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              >
                <FileUp className="h-4 w-4" />
                {fileName ? fileName : "Select File"}
              </Label>
            </div>
          </div>

          {formData.documentationFile && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{fileName}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setShowPreview(true)}>
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={improveDocumentation}
                    disabled={isImproving}
                  >
                    {isImproving ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Improving...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" />
                        Improve with AI
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {formData.improvedDocumentation && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">AI-Improved Documentation</h3>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setShowPreview(true)}>
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const blob = new Blob([formData.improvedDocumentation || ""], { type: "text/html" })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement("a")
                          a.href = url
                          a.download = `${formData.projectName}-improved-documentation.html`
                          document.body.appendChild(a)
                          a.click()
                          document.body.removeChild(a)
                          URL.revokeObjectURL(url)
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-md h-64 overflow-y-auto">
                    <Editor value={formData.improvedDocumentation} onChange={handleImprovedEditorChange} />
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="generate" className="space-y-4 pt-4">
          {!formData.generatedDocumentation && !isGenerating && (
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="font-medium">Generate Developer Documentation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We'll create detailed documentation based on your project details
              </p>

              <Button onClick={generateDocumentation}>Generate Now</Button>
            </div>
          )}

          {isGenerating && (
            <div className="border rounded-lg p-8 text-center">
              <RefreshCw className="mx-auto h-10 w-10 text-primary mb-4 animate-spin" />
              <h3 className="font-medium">Generating Documentation...</h3>
              <p className="text-sm text-muted-foreground">This may take a few moments</p>
            </div>
          )}

          {formData.generatedDocumentation && !isGenerating && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Generated Documentation</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowPreview(true)}>
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const blob = new Blob([formData.generatedDocumentation], { type: "text/html" })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = `${formData.projectName}-documentation.html`
                      document.body.appendChild(a)
                      a.click()
                      document.body.removeChild(a)
                      URL.revokeObjectURL(url)
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="border rounded-md h-64 overflow-y-auto">
                <Editor value={formData.generatedDocumentation} onChange={handleEditorChange} />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Documentation Preview</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto h-full p-4 border rounded-md">
            {formData.documentationFile && formData.documentationFileContent && !formData.improvedDocumentation ? (
              <PdfViewer fileUrl={formData.documentationFileContent} fileName={fileName} />
            ) : formData.improvedDocumentation ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: formData.improvedDocumentation,
                }}
              />
            ) : (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: formData.generatedDocumentation,
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function generateSampleDocumentation(projectName: string, projectOverview: string, developmentAreas: string[]): string {
  return `
    <h1>🔷 ${projectName} - Developer Documentation</h1>
    
    <h2>Project Overview</h2>
    <p>${projectOverview}</p>
    
    <h2>Development Areas</h2>
    <ul>
      ${developmentAreas.map((area) => `<li>${area}</li>`).join("")}
    </ul>
    
    <h2>1. Project Structure</h2>
    
    <h3>🔹 Main Components</h3>
    <ul>
      <li>Dashboard (/dashboard)</li>
      <li>User Management (/users)</li>
      <li>Settings (/settings)</li>
    </ul>
    
    <h3>📌 A. Dashboard Page (/dashboard)</h3>
    
    <p><strong>Purpose:</strong></p>
    <p>An overview of all key stats for quick access.</p>
    
    <p><strong>Features:</strong></p>
    <ul>
      <li>✅ Total Users Count</li>
      <li>✅ Activity Statistics</li>
      <li>✅ Recent Activities</li>
    </ul>
    
    <h2>2. Technical Implementation</h2>
    
    <h3>✔ Frontend: Next.js, TypeScript, Tailwind CSS</h3>
    <h3>✔ Backend: Node.js, Express.js, MongoDB</h3>
    <h3>✔ Authentication: JWT</h3>
  `
}

