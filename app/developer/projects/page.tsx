"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Filter,
  Search,
  Clock,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import ProjectTable, {
  ProjectStatus,
} from "@/components/ui-custom/ProjectTable";
import { motion } from "framer-motion";

// Mock data for developer projects
const developerProjects = [
  {
    id: "123",
    name: "E-commerce Website Redesign",
    deadline: "2023-06-15",
    progress: 75,
    status: "in-progress" as ProjectStatus,
    client: "Fashion Trends Inc.",
    description:
      "Redesigning the e-commerce website with improved UI/UX and mobile responsiveness",
    tasksTotal: 12,
    tasksCompleted: 8,
  },

  {
    id: "proj-002",
    name: "Mobile App Development",
    deadline: "2023-06-22",
    progress: 45,
    status: "in-progress" as ProjectStatus,
    client: "TechStart Mobile",
    description:
      "Developing a cross-platform mobile application with React Native",
    tasksTotal: 18,
    tasksCompleted: 8,
  },
  {
    id: "proj-003",
    name: "CRM Integration",
    deadline: "2023-07-10",
    progress: 20,
    status: "in-progress" as ProjectStatus,
    client: "Business Solutions LLC",
    description: "Integrating CRM system with existing business applications",
    tasksTotal: 15,
    tasksCompleted: 3,
  },
  {
    id: "proj-004",
    name: "API Development",
    deadline: "2023-08-05",
    progress: 0,
    status: "pending" as ProjectStatus,
    client: "Data Services Co.",
    description: "Creating RESTful APIs for data processing and analytics",
    tasksTotal: 10,
    tasksCompleted: 0,
  },
  {
    id: "proj-005",
    name: "Content Management System",
    deadline: "2023-05-20",
    progress: 100,
    status: "completed" as ProjectStatus,
    client: "Media Publishing Group",
    description: "Building a custom CMS for digital content management",
    tasksTotal: 14,
    tasksCompleted: 14,
  },
];

export default function DeveloperProjects() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter projects based on search query and active tab
  const filteredProjects = developerProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "in-progress" && project.status === "in-progress") ||
      (activeTab === "completed" && project.status === "completed") ||
      (activeTab === "pending" && project.status === "pending");

    return matchesSearch && matchesTab;
  });

  // Table columns definition
  const columns = [
    {
      header: "Project Name",
      accessor: "name",
      cell: (row: any) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-sm text-muted-foreground">
            Client: {row.client}
          </div>
        </div>
      ),
    },
    {
      header: "Deadline",
      accessor: "deadline",
      cell: (row: any) => (
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          {row.deadline}
        </div>
      ),
    },
    {
      header: "Progress",
      accessor: "progress",
      cell: (row: any) => (
        <div className="w-full max-w-[180px]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span>
              {row.tasksCompleted}/{row.tasksTotal} tasks
            </span>
            <span className="font-medium">{row.progress}%</span>
          </div>
          <Progress
            value={row.progress}
            className="h-2"
            color={"bg-blue-500"}
          />
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row: any) => (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/developer/projects/${row.id}`);
          }}
        >
          View Project
        </Button>
      ),
    },
  ];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glassmorphism-subtle border shadow rounded-lg p-4 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-blue-100">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              In Progress
            </p>
            <p className="text-2xl font-bold">
              {
                developerProjects.filter((p) => p.status === "in-progress")
                  .length
              }
            </p>
          </div>
        </div>

        <div className="glassmorphism-subtle border shadow rounded-lg p-4 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-green-100">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Completed
            </p>
            <p className="text-2xl font-bold">
              {developerProjects.filter((p) => p.status === "completed").length}
            </p>
          </div>
        </div>

        <div className="glassmorphism-subtle border shadow rounded-lg p-4 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-orange-100">
            <ClipboardList className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Not Started
            </p>
            <p className="text-2xl font-bold">
              {developerProjects.filter((p) => p.status === "pending").length}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value)}
          className="w-full"
        >
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <TabsList>
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Not Started</TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>

              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="mt-6">
            <ProjectTable
              data={filteredProjects}
              columns={columns}
              emptyMessage="No projects found"
            />
          </TabsContent>

          <TabsContent value="in-progress" className="mt-6">
            <ProjectTable
              data={filteredProjects}
              columns={columns}
              emptyMessage="No in-progress projects found"
            />
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <ProjectTable
              data={filteredProjects}
              columns={columns}
              emptyMessage="No completed projects found"
            />
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <ProjectTable
              data={filteredProjects}
              columns={columns}
              emptyMessage="No pending projects found"
            />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
