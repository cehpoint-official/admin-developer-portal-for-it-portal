"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarIcon,
  FileText,
  RefreshCw,
  User,
  Mail,
  Phone,
  DollarSign,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Project } from "@/lib/types";

const rejectedProjects = [
  {
    id: "rej-001",
    name: "E-commerce Platform",
    clientName: "Fashion Trends Inc.",
    clientEmail: "contact@fashiontrends.com",
    clientPhone: "+1 (555) 123-4567",
    rejectedReason: "Technical requirements beyond our current capabilities",
    rejectedDate: "2023-05-15",
    budget: 15000,
    description:
      "A comprehensive e-commerce platform with integrated AR features for virtual try-ons, real-time inventory tracking, and AI-powered product recommendations.",
    status: "rejected",
  },
  {
    id: "rej-002",
    name: "Real-Time Analytics Dashboard",
    clientName: "Data Insights Co.",
    clientEmail: "projects@datainsights.co",
    clientPhone: "+1 (555) 987-6543",
    rejectedReason: "Timeline too aggressive for current team availability",
    rejectedDate: "2023-06-22",
    budget: 12000,
    description:
      "An analytics dashboard that provides real-time insights from multiple data sources, with customizable widgets and automated reporting features.",
    status: "rejected",
  },
  {
    id: "rej-003",
    name: "Mobile Payment Gateway",
    clientName: "FinTech Solutions",
    clientEmail: "dev@fintechsolutions.io",
    clientPhone: "+1 (555) 246-8101",
    rejectedReason: "Budget not sufficient for requested features",
    rejectedDate: "2023-07-03",
    budget: 8000,
    description:
      "A secure mobile payment gateway with biometric authentication, multi-currency support, and blockchain-based transaction verification.",
    status: "rejected",
  },
  {
    id: "rej-004",
    name: "AI Content Generator",
    clientName: "Creative Media LLC",
    clientEmail: "info@creativemedia.co",
    clientPhone: "+1 (555) 369-2587",
    rejectedReason: "Technical expertise required not available",
    rejectedDate: "2023-08-10",
    budget: 20000,
    description:
      "An AI-powered platform that generates high-quality content for marketing, blogs, and social media, with SEO optimization and sentiment analysis.",
    status: "rejected",
  },
];
interface ProjectDetailClientProps {
  project: Project | null;
  error: string | null;
}

// This is the client component that will be used in the page
export default function RejectedProjectDetailClient({
  project,
  error,
}: ProjectDetailClientProps) {
  const router = useRouter();

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The project you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/admin/rejected")}>
          Go Back to Rejected Projects
        </Button>
      </div>
    );
  }

  const handleRestore = () => {
    // toast({
    //   title: "Project Restored",
    //   description: `${project.name} has been moved to Project Requests.`,
    // });
    router.push("/admin/requests");
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="flex items-center mb-6"
        onClick={() => router.push("/admin/rejected")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Rejected Projects
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="col-span-1 lg:col-span-2 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {project.name}
                  </CardTitle>
                  <CardDescription>
                    Client: {project.clientName}
                  </CardDescription>
                </div>
                <Badge variant="destructive" className="text-sm">
                  Rejected
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Project Description
                </h3>
                <p>{project.description}</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Rejection Reason
                </h3>
                <p className="text-destructive">{project.rejectedReason}</p>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Rejected on {project.rejectedDate}
                </span>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                className="flex items-center gap-1"
                onClick={handleRestore}
              >
                <RefreshCw className="h-4 w-4" />
                Restore Project
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          className="col-span-1 space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{project.clientName}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{project.clientEmail}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{project.clientPhone}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>${project.budget.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Overview Document
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Developer Guide
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
