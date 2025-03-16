"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProjectFormStore } from "@/lib/store/projectSteps";
import { useEffect } from "react";

export function ProjectDetails() {
  const { formData, updateFormData, validationErrors, syncUserData } =
    useProjectFormStore();
  useEffect(() => {
    syncUserData();
  }, [syncUserData]);


  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Step 1/4</p>
        <h2 className="sm:text-2xl font-bold text-foreground">
          Tell Us About Your Project
        </h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="projectName">Project Name</Label>
          <Input
            id="projectName"
            suppressHydrationWarning={true}
            placeholder="Enter your project name (at least 10 characters)"
            value={formData.projectName}
            onChange={(e) => updateFormData({ projectName: e.target.value })}
            className={validationErrors.projectName ? "border-destructive" : ""}
          />
          {validationErrors.projectName && (
            <p className="text-sm text-destructive">
              {validationErrors.projectName}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectOverview">
            Project Overview
            <span className="ml-1 text-xs text-muted-foreground">
              (minimum 100 characters)
            </span>
          </Label>
          <Textarea
            id="projectOverview"
            placeholder="Tell us about your project in detail. What are your goals? What problems are you trying to solve? What features do you need?"
            value={formData.projectOverview}
            onChange={(e) =>
              updateFormData({ projectOverview: e.target.value })
            }
            className={`min-h-[150px] ${
              validationErrors.projectOverview ? "border-destructive" : ""
            }`}
          />
          {validationErrors.projectOverview && (
            <p className="text-sm text-destructive">
              {validationErrors.projectOverview}
            </p>
          )}
          <div className="flex justify-end">
            <p className="text-xs text-muted-foreground">
              {formData.projectOverview.length}/100 characters
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
