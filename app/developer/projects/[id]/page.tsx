"use client";

import React, { use, useState } from "react";
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
import { format } from "date-fns";
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

// Mock project data
const projectData = {
  id: "123",
  name: "E-commerce Mobile App",
  clientName: "TechRetail Inc.",
  deadline: "2023-12-15",
  status: "in-progress",
  progress: 65,
  description:
    "Design and develop a fully functional e-commerce mobile application with user authentication, product browsing, cart management, payments, and order tracking.",
  developerNotes:
    "Focus on performance optimization for image loading. Implement Firebase for authentication and real-time features.",
  tasks: [],
  timeline: [],
};

// Simplified PDF files
const pdfFiles = [
  { name: "Project Overview.pdf", size: "1.2 MB", type: "Overview" },
  { name: "Developer Guide.pdf", size: "2.3 MB", type: "Developer" },
];

// Auto-generated tasks from PDF
const generatedTasks = [
  { id: "t1", name: "Project setup and architecture", completed: false },
  { id: "t2", name: "User authentication screens", completed: false },
  { id: "t3", name: "Product listing and filtering", completed: false },
  { id: "t4", name: "Product detail page", completed: false },
  { id: "t5", name: "Shopping cart implementation", completed: false },
  { id: "t6", name: "Checkout and payment flow", completed: false },
  { id: "t7", name: "Order history and tracking", completed: false },
  { id: "t8", name: "User profile and settings", completed: false },
  { id: "t9", name: "Final testing and bug fixes", completed: false },
  { id: "t10", name: "Deployment preparation", completed: false },
];
interface ProjectRequestDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DeveloperProjectDetail({
  params,
}: ProjectRequestDetailProps) {
  const { id } = use(params);
  // const { toast } = useToast();
  const [project, setProject] = useState(projectData);
  const [tasks, setTasks] = useState<
    Array<{ id: string; name: string; completed: boolean }>
  >(project.tasks);
  const [activeTab, setActiveTab] = useState("tasks");
  const [manualProgress, setManualProgress] = useState(project.progress);
  const [usesTaskList, setUsesTaskList] = useState(false);
  const [showTaskOptions, setShowTaskOptions] = useState(true);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);

  // Calculate days left
  const deadlineDate = new Date(project.deadline);
  const today = new Date();
  const daysLeft = Math.ceil(
    (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate progress based on completed tasks
  const calculateTaskProgress = () => {
    if (tasks.length === 0) return 0;
    const completedCount = tasks.filter((task) => task.completed).length;
    return Math.round((completedCount / tasks.length) * 100);
  };

  const handleTaskToggle = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );

    // Update project progress based on tasks
    const newProgress = calculateTaskProgress();
    setProject((prev) => ({ ...prev, progress: newProgress }));

    // toast({
    //   title: "Task updated",
    //   description: `Task progress updated to ${newProgress}%`,
    // });
  };

  const handleGenerateTasks = () => {
    setIsGeneratingTasks(true);
    // Simulate AI processing
    setTimeout(() => {
      setUsesTaskList(true);
      setShowTaskOptions(false);
      setTasks(generatedTasks);
      setActiveTab("tasks");
      setIsGeneratingTasks(false);
      //   toast({
      //     title: "Tasks Generated",
      //     description: "10 tasks have been created based on the Developer Guide",
      //   });
    }, 1500);
  };

  const handleSkipTaskList = () => {
    setUsesTaskList(false);
    setShowTaskOptions(false);
    // toast({
    //   title: "Manual Progress Mode",
    //   description: "You can now update progress manually",
    // });
  };

  const handleUpdateManualProgress = () => {
    setProject((prev) => ({ ...prev, progress: manualProgress }));
    // toast({
    //   title: "Progress Updated",
    //   description: `Project progress set to ${manualProgress}%`,
    // });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
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
          <Button
            variant="outline"
            size="sm"
            className="mb-2 border-primary/20 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to all Projects
          </Button>
        </Link>
      </div>
      {/* Project Status Overview */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
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
              <Progress
                value={project.progress}
                className="h-2 w-full"
                color={"bg-blue-500"}
              />

              <div className="pt-2 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Deadline
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {format(new Date(project.deadline), "MMM d, yyyy")}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Time Left
                    </span>
                  </div>
                  <Badge
                    variant={daysLeft < 5 ? "destructive" : "outline"}
                    className="text-xs"
                  >
                    {daysLeft} days left
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Tasks</span>
                  </div>
                  <span className="text-sm font-medium">
                    {tasks.filter((t) => t.completed).length} / {tasks.length}{" "}
                    completed
                  </span>
                </div>
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

      {/* Manual Progress Update (only shown when not using task list) */}
      {!usesTaskList && !showTaskOptions && (
        <motion.div variants={itemVariants}>
          <Card className="glassmorphism shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Update Progress</CardTitle>
              <CardDescription>
                Manually update the project progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="manual-progress"
                    className="text-sm mb-2 block"
                  >
                    Current Progress: {manualProgress}%
                  </Label>
                  <div className="flex items-center gap-4">
                    <Progress
                      value={manualProgress}
                      className="flex-1 h-2"
                      color={"bg-blue-500"}
                    />
                    <span className="text-sm font-medium w-10">
                      {manualProgress}%
                    </span>
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
                      onChange={(e) =>
                        setManualProgress(parseInt(e.target.value))
                      }
                      className="w-24"
                    />
                    <span className="text-sm">%</span>
                    <Button onClick={handleUpdateManualProgress}>Update</Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Update the percentage to reflect your current progress on
                    this project.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Task Management Options */}
      {showTaskOptions && (
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-6 border shadow-sm"
        >
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-xl font-semibold">
                How would you like to track your progress?
              </h2>
              <p className="text-muted-foreground mt-2">
                Choose your preferred method for managing tasks and tracking
                progress
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <Card className="cursor-pointer hover:shadow-md transition-shadow border-primary/20 hover:border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-primary" />
                    Generate Task List
                  </CardTitle>
                  <CardDescription>
                    Auto-generate tasks from the Developer PDF
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <CheckSquare className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>
                        Automatically breaks down project into manageable tasks
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckSquare className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>
                        Track progress by checking off completed tasks
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckSquare className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Progress percentage automatically calculated</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={handleGenerateTasks}
                    disabled={isGeneratingTasks}
                  >
                    {isGeneratingTasks ? (
                      <>
                        <span className="animate-pulse">
                          Generating Tasks...
                        </span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Tasks
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow border-primary/20 hover:border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-primary" />
                    Manual Progress
                  </CardTitle>
                  <CardDescription>
                    Skip task list and track progress manually
                  </CardDescription>
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
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleSkipTaskList}
                  >
                    <BarChart className="mr-2 h-4 w-4" />
                    Skip Task List
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tasks Tab Content */}
      {usesTaskList && (
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
                      {tasks.filter((t) => t.completed).length} of{" "}
                      {tasks.length} completed
                    </span>
                    <Progress
                      value={calculateTaskProgress()}
                      className="h-2 w-24"
                      color={"bg-blue-500"}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      className={`flex items-start gap-2 p-3 rounded-md transition-colors ${
                        task.completed
                          ? "bg-green-50 dark:bg-green-950/20"
                          : "hover:bg-muted/50"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => handleTaskToggle(task.id)}
                        id={`task-${task.id}`}
                        className={
                          task.completed
                            ? "border-green-500 text-green-500"
                            : ""
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={`task-${task.id}`}
                          className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                            task.completed
                              ? "line-through text-muted-foreground"
                              : ""
                          }`}
                        >
                          {task.name}
                        </label>
                      </div>
                      <div className="ml-auto">
                        {task.completed ? (
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
