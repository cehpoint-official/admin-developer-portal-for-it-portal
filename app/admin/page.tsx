"use client";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CircleCheckBig,
  FileText,
  Inbox,
  LayoutDashboard,
  IndianRupee,
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
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
export default function AdminDashboard() {
  // Static data
  const stats = {
    totalProjects: 12,
    pendingRequests: 4,
    ongoingProjects: 5,
    completedProjects: 3,
    totalRevenue: 58500,
    teamMembers: 8,
  };

  const upcomingDeadlines = [
    {
      id: "1",
      name: "E-commerce Redesign",
      client: "FashionHub Inc.",
      deadline: "2023-12-15",
      daysLeft: 5,
      progress: 65,
    },
    {
      id: "2",
      name: "Mobile App Development",
      client: "TravelBuddy",
      deadline: "2023-12-20",
      daysLeft: 10,
      progress: 30,
    },
  ];

  const recentRequests = [
    {
      id: "r1",
      projectName: "Fitness App UI/UX",
      clientName: "HealthTech Inc.",
      submittedDate: "2023-12-02",
      estimatedCost: 4500,
    },
    {
      id: "r2",
      projectName: "Corporate Website Redesign",
      clientName: "Global Enterprises",
      submittedDate: "2023-12-01",
      estimatedCost: 7800,
    },
    {
      id: "r3",
      projectName: "Social Media Dashboard",
      clientName: "SocialBoost",
      submittedDate: "2023-11-30",
      estimatedCost: 3200,
    },
    {
      id: "r4",
      projectName: "E-learning Platform",
      clientName: "EduTech Solutions",
      submittedDate: "2023-11-29",
      estimatedCost: 12000,
    },
    {
      id: "r5",
      projectName: "Restaurant Management System",
      clientName: "FoodChain Group",
      submittedDate: "2023-11-28",
      estimatedCost: 9500,
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
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
              <div className="text-3xl font-bold">{stats.totalProjects}</div>
              <LayoutDashboard className="h-10 w-10 text-muted-foreground/70" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{stats.pendingRequests}</div>
              <Inbox className="h-10 w-10 text-amber-500/70" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Estimated Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                ₹{stats.totalRevenue.toLocaleString()}
              </div>
              <IndianRupee className="h-10 w-10 text-green-500/70" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {stats.completedProjects}
              </div>
              <CircleCheckBig className="h-10 w-10 text-blue-500/70" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-2"
      >
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>
                Projects due within the next 10 days
              </CardDescription>
            </div>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium">{deadline.name}</div>
                    <div
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        deadline.daysLeft <= 3
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {deadline.daysLeft} days left
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Client: {deadline.client}
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={deadline.progress}
                      className="h-2"
                      color={"bg-blue-500"}
                    />
                    <span className="text-xs font-medium">
                      {deadline.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/admin/ongoing" className="flex items-center gap-2">
                <span>View all ongoing projects</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle>Recent Project Requests</CardTitle>
              <CardDescription>
                Latest client project submissions
              </CardDescription>
            </div>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Est. Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRequests.slice(0, 5).map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {request.projectName}
                    </TableCell>
                    <TableCell>{request.clientName}</TableCell>
                    <TableCell className="text-right">
                      ${request.estimatedCost.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/admin/requests" className="flex items-center gap-2">
                <span>View all requests</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="grid gap-4 grid-cols-1"
      >
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and actions</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="w-full" asChild>
                <Link href="/admin/requests">View Pending Requests</Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/admin/ongoing">Check Project Progress</Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/admin/team">Manage Team</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
