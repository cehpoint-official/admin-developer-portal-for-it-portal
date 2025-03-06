"use client";
import Link from "next/link";
import {
  Calendar,
  CheckCircle,
  Clock,
  Layers,
  ArrowUpRight,
  ClipboardList,
  CheckCircle2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function DeveloperDashboard() {
  // Static data
  const projectStats = {
    total: 5,
    inProgress: 3,
    completed: 1,
    notStarted: 1,
  };

  const upcomingDeadlines = [
    {
      id: "proj-001",
      name: "E-commerce Website Redesign",
      deadline: "2023-06-15",
      daysRemaining: 5,
      progress: 75,
    },
    {
      id: "proj-002",
      name: "Mobile App Development",
      deadline: "2023-06-22",
      daysRemaining: 12,
      progress: 45,
    },
    {
      id: "proj-003",
      name: "CRM Integration",
      deadline: "2023-07-10",
      daysRemaining: 30,
      progress: 20,
    },
  ];

  const recentTasks = [
    {
      id: "task-001",
      name: "Design landing page wireframes",
      project: "E-commerce Website Redesign",
      status: "completed",
      completedAt: "2023-05-28",
    },
    {
      id: "task-002",
      name: "Set up authentication flow",
      project: "Mobile App Development",
      status: "in-progress",
      completedAt: null,
    },
    {
      id: "task-003",
      name: "Implement product filtering",
      project: "E-commerce Website Redesign",
      status: "not-started",
      completedAt: null,
    },
    {
      id: "task-004",
      name: "Configure API endpoints",
      project: "CRM Integration",
      status: "in-progress",
      completedAt: null,
    },
  ];
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{projectStats.total}</div>
              <Layers className="h-10 w-10 text-muted-foreground/70" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {projectStats.inProgress}
              </div>
              <Clock className="h-10 w-10 text-blue-500/70" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{projectStats.completed}</div>
              <CheckCircle className="h-10 w-10 text-green-500/70" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {upcomingDeadlines.length}
              </div>
              <Calendar className="h-10 w-10 text-orange-500/70" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Deadlines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="col-span-1 lg:col-span-2"
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Upcoming Deadlines</CardTitle>
                <Link href="/developer/projects">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    View All
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
              <CardDescription>
                Projects due in the next 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((project) => (
                  <div
                    key={project.id}
                    className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Calendar className="h-3.5 w-3.5 mr-1" /> Due:{" "}
                          {new Date(project.deadline).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge
                        className={
                          project.daysRemaining <= 7
                            ? "bg-red-100 text-red-800 hover:bg-red-200"
                            : project.daysRemaining <= 14
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            : "bg-green-100 text-green-800 hover:bg-green-200"
                        }
                      >
                        {project.daysRemaining} days left
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress
                        value={project.progress}
                        className="h-2"
                        color={"bg-blue-500"}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/developer/projects">
                <Button className="w-full" variant="outline">
                  Manage All Projects
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Recent Notifications - Added the missing third column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="col-span-1"
        >
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Recent Tasks</CardTitle>
                <Link href={"/developer/tasks"}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    View All
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
              <CardDescription>Latest tasks from your projects</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="border rounded-lg p-3 hover:bg-muted/50 transition-colors flex items-start justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        {task.status === "completed" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : task.status === "in-progress" ? (
                          <Clock className="h-4 w-4 text-blue-500" />
                        ) : (
                          <ClipboardList className="h-4 w-4 text-orange-500" />
                        )}
                        <h3 className="font-medium">{task.name}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 ml-6">
                        From: {task.project}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Link href={"/developer/tasks"}>
                <Button className="w-full" variant="outline">
                  View All Tasks
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
