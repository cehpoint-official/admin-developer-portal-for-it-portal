"use client";
import React, { useState } from "react";
import { File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProjectTable, {
  ProjectStatus,
} from "@/components/ui-custom/ProjectTable";
import Link from "next/link";

// Mock data for rejected projects
const rejectedProjects = [
  {
    id: "rej-001",
    name: "E-commerce Platform",
    clientName: "Fashion Trends Inc.",
    rejectedReason: "Technical requirements beyond our current capabilities",
    rejectedDate: "2023-05-15",
    budget: 15000,
    status: "rejected" as ProjectStatus,
  },
  {
    id: "rej-002",
    name: "Real-Time Analytics Dashboard",
    clientName: "Data Insights Co.",
    rejectedReason: "Timeline too aggressive for current team availability",
    rejectedDate: "2023-06-22",
    budget: 12000,
    status: "rejected" as ProjectStatus,
  },
  {
    id: "rej-003",
    name: "Mobile Payment Gateway",
    clientName: "FinTech Solutions",
    rejectedReason: "Budget not sufficient for requested features",
    rejectedDate: "2023-07-03",
    budget: 8000,
    status: "rejected" as ProjectStatus,
  },
  {
    id: "rej-004",
    name: "AI Content Generator",
    clientName: "Creative Media LLC",
    rejectedReason: "Technical expertise required not available",
    rejectedDate: "2023-08-10",
    budget: 20000,
    status: "rejected" as ProjectStatus,
  },
];

const RejectedProjects = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter projects based on search query
  const filteredProjects = rejectedProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Table columns definition
  const columns = [
    { header: "Project", accessor: "name" },
    { header: "Client", accessor: "clientName" },
    {
      header: "Date Rejected",
      accessor: "rejectedDate",
    },
    {
      header: "Status",
      accessor: "status",
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Link href={`/admin/rejected/${row.id}`}>
            {" "}
            <Button
              size="sm"
              className="flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <File className="h-4 w-4" />
              View Deatils
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search projects or clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <ProjectTable
        data={filteredProjects}
        columns={columns}
        emptyMessage="No rejected projects found"
      />
    </div>
  );
};

export default RejectedProjects;
