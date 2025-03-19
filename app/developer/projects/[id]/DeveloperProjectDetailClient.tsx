"use client";

import React, { useState } from "react";
import {
  Calendar,
  FileText,
  Clock,
  CheckSquare,
  Sparkles,
  BarChart,
  Download,
  CircleDashed,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

// Define Project and Task types
export type Project = {
  id: string;
  projectName: string;
  clientName: string;
  clientEmail: string;
  clientPhoneNumber: string;
  projectBudget: number;
  finalCost?: number;
  status: "pending" | "in-progress" | "completed" | "rejected"; // Adjust based on your ProjectStatus
  deadline?: string;
  progress: number;
  submittedAt: string;
  startDate: string;
  endDate: string;
  rejectedDate: string;
  currency?: "INR" | "USD";
  rejectionReason?: string;
  projectOverview: string;
  cloudinaryQuotationUrl?: string;
  cloudinaryDocumentationUrl?: string;
  progressType?: "task-based" | "manual";
  isCompleted?: boolean;
};

export type Task = {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  status: "not-started" | "in-progress" | "completed";
  deadline?: string;
};

// Mock project data
const projectData: Project = {
  id: "123",
  projectName: "E-commerce Mobile App",
  clientName: "TechRetail Inc.",
  clientEmail: "contact@techretail.com",
  clientPhoneNumber: "+1234567890",
  projectBudget: 50000,
  deadline: "2023-12-15",
  status: "in-progress",
  progress: 0,
  submittedAt: "2023-10-01",
  startDate: "2023-10-05",
  endDate: "",
  rejectedDate: "",
  projectOverview: "A mobile app for e-commerce",
  progressType: undefined, // Undefined until user chooses
  isCompleted: false,
};

// Simplified PDF files
const pdfFiles = [
  { name: "Project Overview.pdf", size: "1.2 MB", type: "Overview" },
  { name: "Developer Guide.pdf", size: "2.3 MB", type: "Developer" },
];

// Static AI-generated tasks (aligned with Task type, using status instead of completed)
const generatedTasks: Task[] = [
  { id: "t1", name: "Project setup and architecture", projectId: "123", projectName: "E-commerce Mobile App", status: "not-started" },
  { id: "t2", name: "User authentication screens", projectId: "123", projectName: "E-commerce Mobile App", status: "not-started" },
  { id: "t3", name: "Product listing and filtering", projectId: "123", projectName: "E-commerce Mobile App", status: "not-started" },
  { id: "t4", name: "Product detail page", projectId: "123", projectName: "E-commerce Mobile App", status: "not-started" },
  { id: "t5", name: "Shopping cart implementation", projectId: "123", projectName: "E-commerce Mobile App", status: "not-started" },
  { id: "t6", name: "Checkout and payment flow", projectId: "123", projectName: "E-commerce Mobile App", status: "not-started" },
  { id: "t7", name: "Order history and tracking", projectId: "123", projectName: "E-commerce Mobile App", status: "not-started" },
  { id: "t8", name: "User profile and settings", projectId: "123", projectName: "E-commerce Mobile App", status: "not-started" },
  { id: "t9", name: "Final testing and bug fixes", projectId: "123", projectName: "E-commerce Mobile App", status: "not-started" },
  { id: "t10", name: "Deployment preparation", projectId: "123", projectName: "E-commerce Mobile App", status: "not-started" },
];

interface DeveloperProjectDetailClientProps {
  project?: Project | null;
}

export default function DeveloperProjectDetailClient({ project: initialProject }: DeveloperProjectDetailClientProps) {
  const [project, setProject] = useState<Project>(initialProject || projectData);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [manualProgress, setManualProgress] = useState<number>(project.progress);

  // Calculate days left
  const deadlineDate = project.deadline ? new Date(project.deadline) : null;
  const today = new Date();
  const daysLeft = deadlineDate
    ? Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Calculate progress based on completed tasks
  const calculateTaskProgress = (): number => {
    if (tasks.length === 0) return 0;
    const completedCount = tasks.filter((task) => task.status === "completed").length;
    return Math.round((completedCount / tasks.length) * 100);
  };

  // Handle task toggle
  const handleTaskToggle = (taskId: string) => {
    if (project.isCompleted) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === "completed" ? "not-started" : "completed" }
          : task
      )
    );
    const newProgress = calculateTaskProgress();
    setProject((prev) => ({ ...prev, progress: newProgress }));
    console.log(`Task updated. Progress now at ${newProgress}%`); // Replace with toast

    if (newProgress === 100) {
      setProject((prev) => ({ ...prev, isCompleted: true }));
      console.log("Project completed! No further changes allowed."); // Replace with toast
    }
  };

  // Handle AI task generation
  const handleGenerateTasks = () => {
    if (project.progressType) return;

    setTimeout(() => {
      setTasks(generatedTasks);
      setProject((prev) => ({ ...prev, progressType: "task-based" }));
      console.log("Tasks generated successfully!"); // Replace with toast
    }, 1500);
  };

  // Handle skipping to manual progress
  const handleSkipTaskList = () => {
    if (project.progressType) return;

    setProject((prev) => ({ ...prev, progressType: "manual" }));
    console.log("Switched to manual progress mode."); // Replace with toast
  };

  // Handle manual progress update
  const handleUpdateManualProgress = () => {
    if (project.isCompleted) return;

    if (manualProgress <= project.progress) {
      console.log("Error: Progress must be greater than current value!"); // Replace with toast
      return;
    }
    if (manualProgress < 0 || manualProgress > 100) {
      console.log("Error: Progress must be between 0 and 100!"); // Replace with toast
      return;
    }

    setProject((prev) => ({ ...prev, progress: manualProgress }));
    console.log(`Progress updated to ${manualProgress}%`); // Replace with toast

    if (manualProgress === 100) {
      setProject((prev) => ({ ...prev, isCompleted: true }));
      console.log("Project completed! No further changes allowed."); // Replace with toast
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="mb-6">
        <Link href={"/developer/projects"}>
          <Button variant="outline" size="sm" className="mb-2 border-primary/20 shadow-sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to all Projects
          </Button>
        </Link>
      </div>

      {/* Project Status Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glassmorphism shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2 w-full" />

              <div className="pt-2 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Deadline</span>
                  </div>
                  <span className="text-sm font-medium"> {project.deadline
                                        ? format(new Date(project.deadline), "MMMM dd, yyyy")
                                        : "Not set"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Time Left</span>
                  </div>
                  <Badge variant={daysLeft < 5 ? "destructive" : "outline"} className="text-xs">
                    {daysLeft} days left
                  </Badge>
                </div>

                {project.progressType === "task-based" && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Tasks</span>
                    </div>
                    <span className="text-sm font-medium">
                      {tasks.filter((t) => t.status === "completed").length} / {tasks.length} completed
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Project Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pdfFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.size} • {file.type}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress Type Selection */}
      {project.progressType === null && (
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-6 border shadow-sm"
        >
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-xl font-semibold">How would you like to track your progress?</h2>
              <p className="text-muted-foreground mt-2">
                Choose your preferred method for managing tasks and tracking progress
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <Card className="cursor-pointer hover:shadow-md transition-shadow border-primary/20 hover:border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-primary" />
                    Generate Task List
                  </CardTitle>
                  <CardDescription>Auto-generate tasks from the Developer PDF</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <CheckSquare className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Automatically breaks down project into manageable tasks</span>
                    </li>
                    <li className="flex items-start">
                      <CheckSquare className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Track progress by checking off completed tasks</span>
                    </li>
                    <li className="flex items-start">
                      <CheckSquare className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Progress percentage automatically calculated</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleGenerateTasks}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Tasks
                  </Button>
                </CardFooter>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow border-primary/20 hover:border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-primary" />
                    Manual Progress
                  </CardTitle>
                  <CardDescription>Skip task list and track progress manually</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <CheckSquare className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Simple percentage-based progress tracking</span>
                    </li>
                    <li className="flex items-start">
                      <CheckSquare className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>No need to check off individual tasks</span>
                    </li>
                    <li className="flex items-start">
                      <CheckSquare className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Quickly update overall project status</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={handleSkipTaskList}>
                    <BarChart className="mr-2 h-4 w-4" />
                    Skip Task List
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </motion.div>
      )}

      {/* Manual Progress Update */}
      {project.progressType === "manual" && (
        <motion.div variants={itemVariants}>
          <Card className="glassmorphism shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Update Progress</CardTitle>
              <CardDescription>Manually update the project progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="manual-progress" className="text-sm mb-2 block">
                    Current Progress: {project.progress}%
                  </Label>
                  <div className="flex items-center gap-4">
                    <Progress value={project.progress} className="flex-1 h-2" />
                    <span className="text-sm font-medium w-10">{project.progress}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manual-progress-input">Update Progress</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="manual-progress-input"
                      type="number"
                      min="0"
                      max="100"
                      value={manualProgress}
                      onChange={(e) => setManualProgress(parseInt(e.target.value) || 0)}
                      className="w-24"
                      disabled={project.isCompleted}
                    />
                    <span className="text-sm">%</span>
                    <Button onClick={handleUpdateManualProgress} disabled={project.isCompleted}>
                      Update
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Update the percentage to reflect your current progress (must be greater than {project.progress}%).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tasks Tab Content */}
      {project.progressType === "task-based" && (
        <motion.div variants={itemVariants}>
          <Card className="glassmorphism shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Task Management</CardTitle>
              <CardDescription>Track your progress with tasks</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Task List</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {tasks.filter((t) => t.status === "completed").length} of {tasks.length} completed
                    </span>
                    <Progress value={project.progress} className="h-2 w-24" />
                  </div>
                </div>

                <div className="space-y-2">
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      className={`flex items-start gap-2 p-3 rounded-md transition-colors ${
                        task.status === "completed" ? "bg-green-50 dark:bg-green-950/20" : "hover:bg-muted/50"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Checkbox
                        checked={task.status === "completed"}
                        onCheckedChange={() => handleTaskToggle(task.id)}
                        id={`task-${task.id}`}
                        className={task.status === "completed" ? "border-green-500 text-green-500" : ""}
                        disabled={project.isCompleted}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={`task-${task.id}`}
                          className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                            task.status === "completed" ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {task.name}
                        </label>
                      </div>
                      <div className="ml-auto">
                        {task.status === "completed" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <CircleDashed className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}