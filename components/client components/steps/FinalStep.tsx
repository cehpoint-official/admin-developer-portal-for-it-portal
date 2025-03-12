"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Download, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useProjectFormStore } from "@/lib/store/projectSteps";
import { PdfViewer } from "../PdfViewer";
import Link from "next/link";

export function FinalStep() {
  const { formData } = useProjectFormStore();
  const [showDocPreview, setShowDocPreview] = useState(false);
  const [showQuotationPreview, setShowQuotationPreview] = useState(false);
  console.log(formData);
  // Determine which documentation URL to use
  const documentationUrl = formData.cloudinaryDocumentationUrl;
  const quotationUrl = formData.cloudinaryQuotationUrl;

  return (
    <div className="space-y-8 text-center py-8">
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Thank You for Your Submission!
        </h2>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
          We appreciate and have received your project details and requirements.
          Our team will review your submission and get back to you shortly.
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="font-medium">Project Summary</h3>

        <div className="border rounded-md p-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Project Name</p>
              <p className="font-medium">{formData.projectName}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Development Areas</p>
              <p className="font-medium">
                {formData.developmentAreas.join(", ")}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Team Composition</p>
              <p className="font-medium">
                {formData.seniorDevelopers > 0 &&
                  `${formData.seniorDevelopers} Senior Developer${
                    formData.seniorDevelopers > 1 ? "s" : ""
                  }`}
                {formData.juniorDevelopers > 0 &&
                  `${formData.seniorDevelopers > 0 ? ", " : ""}${
                    formData.juniorDevelopers
                  } Junior Developer${
                    formData.juniorDevelopers > 1 ? "s" : ""
                  }`}
                {formData.uiUxDesigners > 0 &&
                  `${
                    formData.seniorDevelopers > 0 ||
                    formData.juniorDevelopers > 0
                      ? ", "
                      : ""
                  }${formData.uiUxDesigners} UI/UX Designer${
                    formData.uiUxDesigners > 1 ? "s" : ""
                  }`}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Documentation</p>
              <p className="font-medium">
                {formData.documentationFile
                  ? formData.improvedDocumentation
                    ? "AI-Improved Documentation"
                    : "Uploaded File"
                  : "Generated Documentation"}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Project Overview</p>
            <p className="text-sm mt-1">{formData.projectOverview}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setShowQuotationPreview(true)}
        >
          <FileText className="h-4 w-4" />
          View Quotation
        </Button>
        <Link href={quotationUrl || ""}>
          {" "}
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download Quotation
          </Button>
        </Link>

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setShowDocPreview(true)}
        >
          <FileText className="h-4 w-4" />
          View Documentation
        </Button>
        <Link href={documentationUrl || ""}>
          {" "}
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download Documentation
          </Button>
        </Link>
      </div>

      {/* Documentation Preview Dialog */}
      <Dialog open={showDocPreview} onOpenChange={setShowDocPreview}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Documentation Preview</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto h-full p-4 border rounded-md">
            {formData.documentationFile &&
            formData.documentationFileContent &&
            !formData.improvedDocumentation ? (
              <PdfViewer
                fileUrl={formData.documentationFileContent}
                fileName={formData.documentationFile.name}
              />
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

      {/* Quotation Preview Dialog */}
      <Dialog
        open={showQuotationPreview}
        onOpenChange={setShowQuotationPreview}
      >
        <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
            <DialogTitle>Quotation Preview</DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto h-full p-4 border rounded-md">
            {formData.quotationPdf ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: formData.quotationPdf,
                }}
              />
            ) : (
              <div className="text-center p-8">
                <p>No quotation available</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
