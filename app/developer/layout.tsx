"use client"
import Layout from "@/components/layout/Layout";
import { users } from "@/lib/data";
import type React from "react";
import { usePathname } from "next/navigation";

interface PageMetadata {
  title: string;
  description: string;
}


interface PageMetadataDict {
  [path: string]: PageMetadata;
}

const pageMetadata: PageMetadataDict = {
  "/developer": {
    title: "Developer Dashboard",
    description: "Track your assigned projects and progress"
  },
  "/developer/projects": {
    title: "My Projects",
    description: "View and manage your assigned projects"
  },
  "/developer/tasks": {
    title: "Task Management",
    description: "Track and update your tasks and deadlines"
  },
  "/developer/chat": {
    title: "Chat with Admin",
    description: "Direct communication channel with administrators"
  }
};

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const metadata = pageMetadata[pathname] || {
    title: "Developer Dashboard",
    description: "Track your assigned projects and progress"
  };

  return (
    <Layout
      user={users[1]}
      title={metadata.title}
      description={metadata.description}
    >
      {children}
    </Layout>
  );
}