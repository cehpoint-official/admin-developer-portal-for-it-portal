"use client";

import React, { useState } from "react";
import { Search, Download, CheckCircle, XCircle, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPendingProjects } from "@/lib/data";
import ProjectTable from "@/components/ui-custom/ProjectTable";
import Link from "next/link";

export default function ProjectRequests() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items to display per page

  const pendingProjects = getPendingProjects();

  const filteredProjects = pendingProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProjects.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects or clients..."
            className="pl-9 w-full sm:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-auto flex justify-end">
          <Button variant="outline" className="bg-white/80 shadow-sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>
      <div className="rounded-lg overflow-hidden glassmorphism shadow-md">
        <ProjectTable
          data={currentItems}
          columns={[
            { header: "Project Name", accessor: "name" },
            { header: "Client", accessor: "clientName" },
            {
              header: "Estimated Cost",
              accessor: "estimatedCost",
              cell: (row) => {
                return `₹${row.estimatedCost.toLocaleString()}`;
              },
            },
            { header: "Status", accessor: "status" },
            {
              header: "Actions",
              accessor: "actions",
              cell: (row) => (
                <div className="flex items-center gap-2">
                  <Link href={`/admin/requests/${row.id}`}>
                    {" "}
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </Link>
                </div>
              ),
            },
          ]}
          emptyMessage="No pending project requests found"
        />
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                // Show first page, last page, current page, and pages around current
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 &&
                    pageNumber <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNumber);
                        }}
                        isActive={pageNumber === currentPage}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  (pageNumber === 2 && currentPage > 3) ||
                  (pageNumber === totalPages - 1 &&
                    currentPage < totalPages - 2)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      handlePageChange(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {filteredProjects.length === 0 && searchQuery && (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            No projects found matching "{searchQuery}"
          </p>
          <Button
            variant="link"
            className="mt-2"
            onClick={() => setSearchQuery("")}
          >
            Clear search
          </Button>
        </div>
      )}
    </motion.div>
  );
}
