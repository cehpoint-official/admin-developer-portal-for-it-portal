"use client" 
import { ProjectSubmissionForm } from "@/components/client components/ProjectSubmissionForm";
import { useAuthStore } from "@/lib/store/userStore";
import React from "react";

const Project = () => {
  const { user } = useAuthStore();
  console.log(user);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <ProjectSubmissionForm />
    </main>
  );
};

export default Project;
