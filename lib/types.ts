export type UserRole = 'admin' | 'developer' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  budget: number;
}

export type ProjectStatus = 'pending' | 'in-progress' | 'completed' | 'rejected' | 'delayed';


export type Project = {
  id: string;
  projectName: string;
  clientName: string;
  clientEmail: string;
  clientPhoneNumber: string;
  projectBudget: number;
  finalCost?: number;
  status: ProjectStatus;
  deadline?: string;
  progress: number;
  submittedAt: string;
  startDate: string;
  endDate: string;
  rejectionReason?: string;
  projectOverview: string;
  cloudinaryQuotationUrl?: string;
  cloudinaryDocumentationUrl?: string;
};
export type ProjectTask = {
  id: string
  title: string
  description: string
  assignedTo: string
  status: "todo" | "in-progress" | "completed"
  dueDate: any
}

export type TaskStatus = 'not-started' | 'in-progress' | 'completed';


export type Task = {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  status: 'not-started' | 'in-progress' | 'completed';
  deadline: string;
  priority: 'low' | 'medium' | 'high';
};

export interface TeamMember {
  id: string;
  name: string;
  role: 'developer' | 'designer';
  projectsAssigned: string[];
  availability: 'available' | 'busy' | 'unavailable';
  avatar: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}