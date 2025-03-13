"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  FileText,
  Star,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

const completedProjects = [
  {
    id: "4",
    name: "E-commerce Redesign",
    clientName: "FashionRetail Co.",
    clientEmail: "projects@fashionretail.com",
    clientPhone: "+1 (555) 123-4567",
    estimatedCost: 12000,
    actualCost: 11800,
    submittedAt: "2023-01-10",
    deadline: "2023-03-15",
    completedAt: "2023-03-10",
    description:
      "A complete redesign of the client's e-commerce platform with improved user experience, mobile responsiveness, and integration with their inventory management system.",
    feedback:
      "Exceptional work. The team delivered ahead of schedule and the new design has already increased our conversion rates by 15%.",
    feedbackRating: 5,
    status: "completed",
  },
  {
    id: "7",
    name: "CRM Integration",
    clientName: "Business Solutions Inc.",
    clientEmail: "tech@businesssolutions.com",
    clientPhone: "+1 (555) 987-6543",
    estimatedCost: 20000,
    actualCost: 22500,
    submittedAt: "2023-02-20",
    deadline: "2023-05-10",
    completedAt: "2023-05-15",
    description:
      "Integration of a custom CRM solution with existing client systems, including data migration, user training, and documentation.",
    feedback:
      "While the project took slightly longer than expected, the quality of work was excellent. The team was responsive and addressed all our concerns promptly.",
    feedbackRating: 4,
    status: "completed",
  },
  {
    id: "3",
    name: "Mobile Banking App",
    clientName: "First Digital Bank",
    clientEmail: "dev@firstdigital.com",
    clientPhone: "+1 (555) 246-8101",
    estimatedCost: 35000,
    actualCost: 34000,
    submittedAt: "2023-03-05",
    deadline: "2023-07-20",
    completedAt: "2023-07-15",
    description:
      "Development of a secure mobile banking application with features including account management, transfers, bill payments, and biometric authentication.",
    feedback:
      "Outstanding work. The app exceeded our expectations in terms of both security and user experience. Our customers love it.",
    feedbackRating: 5,
    status: "completed",
  },
];
interface ProjectRequestDetailProps {
  params: Promise<{
    id: string;
  }>;
}

// Client component
export default function CompletedProjectDetail({
  params,
}: ProjectRequestDetailProps) {
  const router = useRouter();
  const { id } = use(params);
  // Find the project based on ID
  const project = completedProjects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push("/admin/completed")}>
            Go Back to Completed Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="space-y-6">
        <Button
          variant="ghost"
          className="flex items-center mb-6"
          onClick={() => router.push("/admin/completed")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Completed Projects
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card >
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {project.name}
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">
                    Client: {project.clientName}
                  </p>
                </div>
                <Badge
                 // variant="success"
                  className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full flex items-center"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Completed
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Project Description
                      </h3>
                      <p className="text-sm">{project.description}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Client Feedback
                      </h3>
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < project.feedbackRating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm italic">{project.feedback}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Estimated Cost
                        </h3>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-lg font-medium">
                            ${project.estimatedCost.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Actual Cost
                        </h3>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-lg font-medium">
                            ${project.actualCost.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white p-5 rounded-lg border">
                      <h3 className="font-medium mb-3">Project Progress</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Completion Status</span>
                          <span className="font-medium">100%</span>
                        </div>
                        <Progress value={100} className="h-2" />

                        <div className="pt-3 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              Started:{" "}
                              {new Date(
                                project.submittedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              Deadline:{" "}
                              {new Date(project.deadline).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>
                              Completed:{" "}
                              {new Date(
                                project.completedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                              Total Duration:{" "}
                              {Math.ceil(
                                (new Date(project.completedAt).getTime() -
                                  new Date(project.submittedAt).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )}{" "}
                              days
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-lg border">
                      <h3 className="font-medium mb-3">Client Information</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{project.clientName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm overflow-hidden">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">
                            {project.clientEmail}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{project.clientPhone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-3">Project Documentation</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button variant="outline" className="justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      <span className="truncate">Project Overview</span>
                      <Download className="ml-auto h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      <span className="truncate">Developer Guide</span>
                      <Download className="ml-auto h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 mt-6">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/completed")}
                className="ml-auto"
              >
                Close
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
