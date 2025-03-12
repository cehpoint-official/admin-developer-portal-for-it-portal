"use client";

import type React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp, FileText, RefreshCw, Wand2, Upload } from "lucide-react";
import { toast } from "sonner";
import { validatePdfFile } from "@/lib/PdfValidation";
import {
  uploadToCloudinary,
  uploadToCloudinaryForTextExtraction,
} from "@/lib/cloudinary";
import { Editor } from "../Editor";
import { useProjectFormStore } from "@/lib/store/projectSteps";
import { generateDeveloperDocumentationFromPdf } from "@/app/actions/upload-actions";

export function Documentation() {
  const { formData, updateFormData, generateQuotation, nextStep } =
    useProjectFormStore();

  const [activeTab, setActiveTab] = useState("upload");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Ref to track if we've already uploaded to Cloudinary
  const hasUploadedToCloudinary = useRef(false);

  // Handle file change with proper validation
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || !e.target.files[0]) {
        return;
      }

      const file = e.target.files[0];

      try {
        // Validate the file using Zod schema
        const validation = validatePdfFile(file);
        if (!validation.success) {
          const errorMessage =
            validation.error || "Invalid file format or size";
          setFileError(errorMessage);
          toast.error("File Validation Failed", { description: errorMessage });
          return;
        }
        setFileError(null);
        setFileName(validation.data?.file.name || "");
        hasUploadedToCloudinary.current = false;

        // Reset related form fields
        updateFormData({
          documentationFile: validation.data?.file,
          documentationFileContent: null,
          documentationFileText: null,
          improvedDocumentation: null,
          cloudinaryDocumentationUrl: null,
        });
      } catch (error) {
        console.error("Error processing file:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to process file";
        setFileError(errorMessage);
        toast.error("File Processing Error", { description: errorMessage });
      }
    },
    [updateFormData]
  );

  // Generate documentation with proper error handling
  const generateDocumentation = useCallback(() => {
    if (isGenerating) return;

    setIsGenerating(true);
    hasUploadedToCloudinary.current = false;

    try {
      // Validate required fields
      if (!formData.projectName || !formData.projectOverview) {
        throw new Error("Project name and overview are required");
      }

      // Simulate API call to generate documentation
      setTimeout(() => {
        try {
          const generatedDoc = generateSampleDocumentation(
            formData.projectName,
            formData.projectOverview,
            formData.developmentAreas || []
          );

          updateFormData({
            generatedDocumentation: generatedDoc,
            cloudinaryDocumentationUrl: null,
          });

          toast.success("Documentation Generated", {
            description: "Your documentation has been generated successfully.",
          });
        } catch (error) {
          console.error("Error generating documentation:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to generate documentation";
          toast.error("Generation Failed", { description: errorMessage });
        } finally {
          setIsGenerating(false);
        }
      }, 2000);
    } catch (error) {
      console.error("Error initiating documentation generation:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to start generation process";
      toast.error("Generation Failed", { description: errorMessage });
      setIsGenerating(false);
    }
  }, [
    formData.projectName,
    formData.projectOverview,
    formData.developmentAreas,
    isGenerating,
    updateFormData,
  ]);

  // Improve documentation with proper error handling
  const improveDocumentation = useCallback(async () => {
    if (!formData.documentationFile || isImproving) return;
    console.log(formData);

    setIsImproving(true);
    hasUploadedToCloudinary.current = false;

    try {
      // // Upload to Cloudinary for text extraction
      // const pdfUrl = await uploadToCloudinaryForTextExtraction(
      //   formData.documentationFile
      // );

      // if (!pdfUrl) {
      //   throw new Error("Failed to upload PDF to Cloudinary");
      // }

      // // Generate improved documentation
      // const generatedImprovedDocumentation =
      //   await generateDeveloperDocumentationFromPdf(pdfUrl);

      // if (!generatedImprovedDocumentation) {
      //   throw new Error("Failed to generate improved documentation");
      // }
      // console.log(generatedImprovedDocumentation.data);
      const improved = `\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>AidBridge Developer Documentation</title>\n    <style>\n        body {\n            font-family: Arial, sans-serif;\n            line-height: 1.6;\n            margin: 40px;\n            background-color: #f9f9f9;\n            padding: 20px;\n        }\n        h1, h2, h3 {\n            color: #333;\n            border-bottom: 2px solid #ddd;\n            padding-bottom: 5px;\n        }\n        ul {\n            list-style-type: none;\n            padding: 0;\n        }\n        ul li::before {\n            content: \"✅ \";\n            color: green;\n            margin-right: 5px;\n        }\n        table {\n            width: 100%;\n            border-collapse: collapse;\n            margin: 20px 0;\n            background: #fff;\n        }\n        table, th, td {\n            border: 1px solid #ddd;\n        }\n        th, td {\n            padding: 10px;\n            text-align: left;\n        }\n        pre {\n            background: #eee;\n            padding: 10px;\n            border-radius: 5px;\n            overflow-x: auto;\n        }\n        code {\n            font-family: monospace;\n            background-color: #f0f0f0;\n            padding: 2px 5px;\n            border-radius: 3px;\n        }\n    </style>\n</head>\n<body>\n\n    <h1>📌 AidBridge: Developer Documentation</h1>\n\n    <h2>1. Project Overview</h2>\n    <ul>\n        <li><strong>Project Name:</strong> AidBridge</li>\n        <li><strong>Main Objective:</strong> To connect NGOs with donors and volunteers, streamlining the donation and community support process.</li>\n        <li><strong>Key Features:</strong>\n            <ul>\n                <li>✅ NGO Dashboard for activity and cause management</li>\n                <li>✅ Secure Donation Processing with Admin Verification</li>\n                <li>✅ Real-time Fund Tracking & Automated Receipts</li>\n                <li>✅ Multicurrency Support</li>\n                <li>✅ Volunteer Section for Community Service</li>\n                <li>✅ Social Media Integration for Increased Visibility</li>\n                <li>✅ Analytics for NGOs to measure impact</li>\n            </ul>\n        </li>\n        <li><strong>Target Users:</strong> NGOs, Donors, Volunteers, Administrators</li>\n        <li><strong>Tech Stack:</strong> (To be defined based on implementation. Examples might include: React, Node.js, PostgreSQL, Stripe, etc.)</li>\n    </ul>\n\n    <h2>2. System Architecture</h2>\n    <ul>\n        <li><strong>Frontend:</strong> (Example: React.js for a dynamic user interface)</li>\n        <li><strong>Backend:</strong> (Example: Node.js with Express.js for API and server-side logic)</li>\n        <li><strong>Database:</strong> (Example: PostgreSQL for storing NGO data, user information, donation records, etc.)</li>\n        <li><strong>API Layer:</strong> RESTful API for communication between frontend and backend</li>\n        <li><strong>Security:</strong> Secure authentication and authorization mechanisms, data encryption, and protection against common web vulnerabilities.</li>\n    </ul>\n\n    <h2>3. Core Modules & Functionality</h2>\n\n    <h3>📌 A. Donation Management</h3>\n    <ul>\n        <li><strong>Purpose:</strong> Enables donors to contribute financially to NGO causes.</li>\n        <li><strong>Features:</strong>\n            <ul>\n                <li>✅ Secure payment gateway integration (e.g., Stripe, PayPal)</li>\n                <li>✅ Multi-currency support</li>\n                <li>✅ Automated donation receipts</li>\n                <li>✅ Admin verification process for preventing fraud</li>\n            </ul>\n        </li>\n    </ul>\n\n    <h3>📌 B. Volunteer Management</h3>\n    <ul>\n        <li><strong>Purpose:</strong> Allows individuals to sign up for community service opportunities.</li>\n        <li><strong>Features:</strong>\n            <ul>\n                <li>✅ Volunteer registration and profile management</li>\n                <li>✅ Listing of available volunteer opportunities</li>\n                <li>✅ Application and approval workflow</li>\n            </ul>\n        </li>\n    </ul>\n\n    <h3>📌 C. NGO Management</h3>\n    <ul>\n        <li><strong>Purpose:</strong> Provides NGOs with tools to manage their activities and funding requirements.</li>\n        <li><strong>Features:</strong>\n            <ul>\n                <li>✅ Dashboard for managing causes and projects</li>\n                <li>✅ Donation request submission</li>\n                <li>✅ Real-time tracking of funds</li>\n                <li>✅ Analytics for measuring impact</li>\n            </ul>\n        </li>\n    </ul>\n\n    <h3>📌 Table: Donation Database Schema</h3>\n    <table>\n        <tr>\n            <th>Column Name</th>\n            <th>Data Type</th>\n            <th>Constraints</th>\n        </tr>\n        <tr>\n            <td>donation_id</td>\n            <td>SERIAL</td>\n            <td>PRIMARY KEY, UNIQUE, NOT NULL</td>\n        </tr>\n        <tr>\n            <td>donor_id</td>\n            <td>INTEGER</td>\n            <td>FOREIGN KEY referencing users table</td>\n        </tr>\n        <tr>\n            <td>ngo_id</td>\n            <td>INTEGER</td>\n            <td>FOREIGN KEY referencing ngos table</td>\n        </tr>\n        <tr>\n            <td>amount</td>\n            <td>DECIMAL</td>\n            <td>NOT NULL</td>\n        </tr>\n        <tr>\n            <td>currency</td>\n            <td>VARCHAR(3)</td>\n            <td>NOT NULL</td>\n        </tr>\n        <tr>\n            <td>donation_date</td>\n            <td>TIMESTAMP</td>\n            <td>NOT NULL DEFAULT CURRENT_TIMESTAMP</td>\n        </tr>\n        <tr>\n            <td>status</td>\n            <td>VARCHAR(20)</td>\n            <td>DEFAULT 'pending', ENUM('pending', 'approved', 'rejected')</td>\n        </tr>\n    </table>\n\n    <h3>📌 API Endpoints (Examples)</h3>\n    <table>\n        <tr>\n            <th>Endpoint</th>\n            <th>Method</th>\n            <th>Description</th>\n        </tr>\n        <tr>\n            <td><code>/api/donations</code></td>\n            <td>POST</td>\n            <td>Creates a new donation record</td>\n        </tr>\n        <tr>\n            <td><code>/api/donations/{donation_id}</code></td>\n            <td>GET</td>\n            <td>Retrieves details of a specific donation</td>\n        </tr>\n        <tr>\n            <td><code>/api/ngos</code></td>\n            <td>GET</td>\n            <td>Retrieves a list of all NGOs</td>\n        </tr>\n        <tr>\n            <td><code>/api/volunteers</code></td>\n            <td>POST</td>\n            <td>Register a new volunteer</td>\n        </tr>\n    </table>\n\n    <h2>4. Key Workflows</h2>\n    <ul>\n        <li>1️⃣ <strong>Donation Process:</strong> Donor initiates donation > Payment processed through secure gateway > Admin verifies transaction > Donation recorded and receipt generated.</li>\n        <li>2️⃣ <strong>Volunteer Signup:</strong> Volunteer creates profile > Browses available opportunities > Applies for opportunity > NGO reviews application > Volunteer approved/rejected.</li>\n        <li>3️⃣ <strong>NGO Cause Submission:</strong> NGO submits cause details and funding requirements > Admin reviews and approves cause > Cause listed on platform for donations.</li>\n    </ul>\n\n    <h2>5. Setup Instructions (Example)</h2>\n    <h3>📌 Setting up the Development Environment</h3>\n    <ol>\n        <li>Install Node.js and npm.</li>\n        <li>Install PostgreSQL.</li>\n        <li>Create a database for AidBridge.</li>\n        <li>Clone the AidBridge repository from GitHub.</li>\n    </ol>\n\n    <h3>📌 Example Code Snippet: Setting up the database connection</h3>\n    <pre>\n        <code>\n        const { Pool } = require('pg');\n\n        const pool = new Pool({\n          user: 'dbuser',\n          host: 'localhost',\n          database: 'aidbridge_db',\n          password: 'dbpassword',\n          port: 5432,\n        });\n\n        module.exports = pool;\n        </code>\n    </pre>\n\n    <h2>6. Future Enhancements</h2>\n    <ul>\n        <li>✅ AI-powered matching of donors to relevant causes.</li>\n        <li>✅ Integration with blockchain for enhanced transparency.</li>\n        <li>✅ Mobile app development for increased accessibility.</li>\n    </ul>\n\n</body>\n</html>\n`;
      updateFormData({
        improvedDocumentation: improved,
      });
      toast.success("Documentation Improved", {
        description: "Your documentation has been enhanced with AI.",
      });
    } catch (error) {
      console.error("Error improving documentation:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to improve documentation";

      setFileError(errorMessage);
      toast.error("Improvement Failed", { description: errorMessage });
    } finally {
      setIsImproving(false);
    }
  }, [formData.documentationFile, isImproving, updateFormData]);

  // Handle editor content changes
  const handleEditorChange = useCallback(
    (value: string) => {
      updateFormData({ generatedDocumentation: value });
      hasUploadedToCloudinary.current = false;
    },
    [updateFormData]
  );

  const handleImprovedEditorChange = useCallback(
    (value: string) => {
      updateFormData({ improvedDocumentation: value });
      hasUploadedToCloudinary.current = false;
    },
    [updateFormData]
  );

  // Prepare PDF for upload based on available content
  const preparePdfForUpload = useCallback(async () => {
    if (formData.improvedDocumentation) {
      const pdfBlob = await htmlToPdfBlob(formData.improvedDocumentation);
      const pdfFileName = `${
        formData.projectName || "document"
      }-improved-documentation.pdf`;
      return new File([pdfBlob], pdfFileName, { type: "application/pdf" });
    }

    if (formData.generatedDocumentation) {
      const pdfBlob = await htmlToPdfBlob(formData.generatedDocumentation);
      const pdfFileName = `${
        formData.projectName || "document"
      }-documentation.pdf`;
      return new File([pdfBlob], pdfFileName, { type: "application/pdf" });
    }

    if (formData.documentationFile) {
      return formData.documentationFile;
    }

    return null;
  }, [
    formData.improvedDocumentation,
    formData.generatedDocumentation,
    formData.documentationFile,
    formData.projectName,
  ]);

  // Handle submission with proper error handling
  const handleSubmit = useCallback(async () => {
    // Don't proceed if already uploaded
    if (hasUploadedToCloudinary.current) {
      nextStep();
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Prepare PDF for upload
      const pdfToUpload = await preparePdfForUpload();

      if (!pdfToUpload) {
        throw new Error(
          "No documentation to upload. Please upload a PDF or generate documentation first."
        );
      }

      // Upload the PDF to Cloudinary with progress tracking
      const uploadUrl = await uploadToCloudinary(pdfToUpload, (progress) => {
        setUploadProgress(Math.round(progress));
      });

      if (!uploadUrl) {
        throw new Error("Upload to Cloudinary failed");
      }

      // Update form data with Cloudinary URL
      updateFormData({ cloudinaryDocumentationUrl: uploadUrl });
      hasUploadedToCloudinary.current = true;

      // Upload quotation PDF if it exists
      if (formData.quotationPdf) {
        try {
          const quotationBlob = await htmlToPdfBlobForQuotation(
            formData.quotationPdf
          );
          const quotationFile = new File(
            [quotationBlob],
            `${formData.projectName || "project"}-quotation.pdf`,
            { type: "application/pdf" }
          );

          const quotationUrl = await uploadToCloudinary(quotationFile);

          if (quotationUrl) {
            updateFormData({ cloudinaryQuotationUrl: quotationUrl });
          }
        } catch (quotationError) {
          console.error("Error uploading quotation PDF:", quotationError);
          // Continue with main flow even if quotation upload fails
          toast.warning("Quotation Upload Warning", {
            description:
              "Quotation upload failed, but documentation was uploaded successfully.",
          });
        }
      }

      toast.success("Documentation Uploaded", {
        description: "Your documentation has been uploaded successfully.",
      });

      // Move to the next step
      nextStep();
    } catch (error) {
      console.error("Error handling submission:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Upload failed. Please try again.";
      toast.error("Upload Failed", { description: errorMessage });
    } finally {
      setIsUploading(false);
    }
  }, [
    nextStep,
    preparePdfForUpload,
    updateFormData,
    formData.quotationPdf,
    formData.projectName,
  ]);

  // Determine if the submit button should be disabled
  const isSubmitDisabled =
    isUploading ||
    (!formData.documentationFile &&
      !formData.generatedDocumentation &&
      !formData.improvedDocumentation);

  // Get the appropriate submit button text
  const getSubmitButtonText = () => {
    if (isUploading) {
      return `Uploading... ${uploadProgress}%`;
    }
    return hasUploadedToCloudinary.current ? "Proceed to Next Step" : "Submit";
  };
  // Generate quotation when reaching this step
  useEffect(() => {
    // Generate quotation only once when component mounts
    if (!formData.quotationPdf) {
      generateQuotation();
    }
  }, []); // Empty dependency array to run only once

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Step 3/4</p>
        <h2 className="text-2xl font-bold text-foreground">
          Share Your Documentation
        </h2>
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
            <p className="text-sm text-muted-foreground mb-4">
              Only PDF files are supported (up to 10MB)
            </p>

            <div className="flex justify-center">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
              <Label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              >
                <FileUp className="h-4 w-4" />
                {fileName ? fileName : "Select PDF File"}
              </Label>
            </div>

            {fileError && (
              <p className="text-sm text-destructive mt-2">{fileError}</p>
            )}
          </div>

          {formData.documentationFile && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{fileName}</span>
                </div>
                <div className="flex gap-2">
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
                  </div>

                  <div className="border rounded-md h-64 overflow-y-auto">
                    <Editor
                      value={formData.improvedDocumentation}
                      onChange={handleImprovedEditorChange}
                    />
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
                We'll create detailed documentation based on your project
                details
              </p>

              <Button onClick={generateDocumentation}>Generate Now</Button>
            </div>
          )}

          {isGenerating && (
            <div className="border rounded-lg p-8 text-center">
              <RefreshCw className="mx-auto h-10 w-10 text-primary mb-4 animate-spin" />
              <h3 className="font-medium">Generating Documentation...</h3>
              <p className="text-sm text-muted-foreground">
                This may take a few moments
              </p>
            </div>
          )}

          {formData.generatedDocumentation && !isGenerating && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Generated Documentation</h3>
              </div>

              <div className="border rounded-md h-64 overflow-y-auto">
                <Editor
                  value={formData.generatedDocumentation}
                  onChange={handleEditorChange}
                />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Submit button with upload status */}
      <div className="flex justify-end mt-4">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="gap-2"
        >
          {isUploading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              {getSubmitButtonText()}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              {getSubmitButtonText()}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Function to convert HTML to PDF blob
async function htmlToPdfBlobForQuotation(htmlContent: string): Promise<Blob> {
  // Create a temporary div to render the HTML
  const element = document.createElement("div");
  element.innerHTML = htmlContent;
  element.style.position = "absolute";
  element.style.left = "-9999px";
  element.style.top = "-9999px";
  document.body.appendChild(element);

  try {
    // Apply a CSS override to replace oklch colors with fallback colors
    const styleElement = document.createElement("style");
    styleElement.textContent = `
       /* Override oklch colors with safe RGB equivalents */
       [class*="bg-"], [class*="text-"], [class*="border-"] {
         color: #333333 !important; /* Fallback text color */
         background-color: #ffffff !important; /* Fallback background color */
         border-color: #cccccc !important; /* Fallback border color */
       }
       /* Restore some basic color distinctions */
       h1, h2, h3, h4, h5, h6 { color: #000000 !important; }
       a { color: #0000EE !important; }
       code { background-color: #f5f5f5 !important; }
     `;
    element.appendChild(styleElement);

    // Dynamic imports
    const { jsPDF } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");

    // Render the HTML to canvas with additional options to handle color issues
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 1200, // Fixed width to avoid layout issues
      removeContainer: false, // Keep container until we're done with it
      backgroundColor: "#ffffff", // Explicit background color
      ignoreElements: (element) => {
        // Skip elements with problematic styles
        const computedStyle = window.getComputedStyle(element);
        const style = element.getAttribute("style") || "";
        return (
          style.includes("oklch") ||
          computedStyle.color.includes("oklch") ||
          computedStyle.backgroundColor.includes("oklch")
        );
      },
    });

    // Get image data from canvas
    const imgData = canvas.toDataURL("image/png");

    // Initialize jsPDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Get the PDF as blob
    return pdf.output("blob");
  } catch (error) {
    console.error("Error generating PDF blob:", error);

    // Fallback method if the first method fails due to color issues
    try {
      console.log("Attempting fallback PDF generation method...");

      // Get content directly without preserving styles
      const cleanContent = sanitizeHtmlForPdf(htmlContent);

      // Create a new jsPDF instance
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add text directly to PDF
      const splitText = pdf.splitTextToSize(cleanContent, 190); // 190mm width
      pdf.text(splitText, 10, 10); // 10mm margin

      return pdf.output("blob");
    } catch (fallbackError) {
      console.error("Fallback PDF generation also failed:", fallbackError);
      throw new Error(
        "Failed to generate PDF. Please try a different approach."
      );
    }
  } finally {
    // Clean up
    if (document.body.contains(element)) {
      document.body.removeChild(element);
    }
  }
}
//Helper function to sanitize HTML for direct PDF text insertion
function sanitizeHtmlForPdf(htmlContent: string): string {
  // Create a temporary div to extract text content
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;

  // Function to extract text and maintain basic structure
  function extractTextWithStructure(element: Element, indent = 0): string {
    let result = "";

    // Handle heading elements with proper spacing
    if (/^h[1-6]$/i.test(element.tagName)) {
      result += "\n" + "  ".repeat(indent) + element.textContent + "\n";
    }
    // Handle list items with bullets
    else if (element.tagName.toLowerCase() === "li") {
      result += "\n" + "  ".repeat(indent) + "• " + element.textContent;
    }
    // Handle paragraph elements
    else if (element.tagName.toLowerCase() === "p") {
      result += "\n" + "  ".repeat(indent) + element.textContent + "\n";
    }
    // Extract text from element if it has no children or is a leaf node
    else if (
      element.childNodes.length === 0 ||
      (element.childNodes.length === 1 &&
        element.childNodes[0].nodeType === Node.TEXT_NODE)
    ) {
      const text = element.textContent?.trim();
      if (text) {
        result += text + " ";
      }
    }
    // Process child elements recursively
    else {
      Array.from(element.children).forEach((child) => {
        result += extractTextWithStructure(child, indent + 1);
      });
    }

    return result;
  }

  // Extract text with basic formatting preserved
  let extractedText = extractTextWithStructure(tempDiv);

  // Clean up extra whitespace
  extractedText = extractedText
    .replace(/\n\s*\n/g, "\n\n") // Remove multiple blank lines
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim();

  return extractedText;
}
// Updated htmlToPdfBlob function with proper TypeScript support
async function htmlToPdfBlob(htmlContent: string): Promise<Blob> {
  try {
    // Import pdfmake
    const pdfMakeModule = await import("pdfmake/build/pdfmake");
    const pdfMake = pdfMakeModule.default || pdfMakeModule;

    // Import vfs_fonts properly - this is the key fix
    const vfs = await import("pdfmake/build/vfs_fonts");

    // Set fonts directly
    pdfMake.vfs = vfs.vfs;

    // Import html-to-pdfmake
    const htmlToPdfMakeModule = await import("html-to-pdfmake");
    const htmlToPdfMake = htmlToPdfMakeModule.default || htmlToPdfMakeModule;

    // Pre-process HTML content to handle emojis and styles
    let processedHtml = htmlContent;

    // Simple emoji mapping
    const emojiMap = {
      "📌": " ",
      "✅": " ",
      "🔷": " ",
      "🔹": " ",
      "1️⃣": " ",
      "2️⃣": " ",
      "3️⃣": " ",
      // Add more emoji mappings as needed
    };

    // Replace emojis with text representations
    Object.entries(emojiMap).forEach(([emoji, text]) => {
      processedHtml = processedHtml.replace(new RegExp(emoji, "g"), text);
    });

    // Remove style tags but keep their selectors for manual styling later
    processedHtml = processedHtml.replace(/<style>[\s\S]*?<\/style>/gi, "");
    // Create a temporary div to parse the HTML
    const element = document.createElement("div");
    element.innerHTML = processedHtml;
    try {
      // Convert HTML to pdfmake compatible format
      const pdfContent = htmlToPdfMake(element.innerHTML, {
        tableAutoSize: true,
        imagesByReference: false,
      });

      // Generate the PDF document definition
      const docDefinition = {
        content: pdfContent,
        defaultStyle: {
          fontSize: 11,
        },
        styles: {
          h1: {
            fontSize: 18,
            bold: true,
            margin: [0, 10, 0, 5] as [number, number, number, number],
          },
          h2: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5] as [number, number, number, number],
          },
          h3: {
            fontSize: 14,
            bold: true,
            margin: [0, 10, 0, 5] as [number, number, number, number],
          },
          p: { margin: [0, 5, 0, 5] as [number, number, number, number] },
          ul: { margin: [0, 5, 0, 15] as [number, number, number, number] },
        },
      };

      // Create and return the PDF blob
      return new Promise((resolve, reject) => {
        try {
          const pdfDocGenerator = pdfMake.createPdf(docDefinition);
          pdfDocGenerator.getBlob((blob: Blob) => {
            resolve(blob);
          });
        } catch (error) {
          reject(error);
        }
      });
    } finally {
      // No need to remove from DOM since we didn't append
    }
  } catch (error) {
    console.error("Error generating PDF blob:", error);
    throw new Error(
      error instanceof Error
        ? `Failed to generate PDF: ${error.message}`
        : "Failed to generate PDF blob"
    );
  }
}
// Generate sample documentation
function generateSampleDocumentation(
  projectName: string,
  projectOverview: string,
  developmentAreas: string[]
): string {
  if (!projectName || !projectOverview) {
    throw new Error("Project name and overview are required");
  }

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
  `;
}
