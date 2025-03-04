export type UserRole = 'admin' | 'developer';

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

export type ProjectStatus = 'pending' | 'ongoing' | 'completed' | 'rejected';

export interface Project {
  id: string;
  name: string;
  client: Client;
  overview: string;
  developerGuide: string;
  estimatedCost: number;
  status: ProjectStatus;
  deadline?: string;
  submittedAt: string;
  progress: number;
  rejectionReason?: string;
  tasks?: Task[];
  assignedTo?: string[];
}

export type TaskStatus = 'not-started' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  projectId: string;
  name: string;
  status: TaskStatus;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
}

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