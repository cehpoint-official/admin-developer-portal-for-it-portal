import { Project, Task, TeamMember, Message, User } from './types';
import { addDays, subDays, format } from 'date-fns';

// Helper function to format dates
const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

// Current date for reference
const today = new Date();

// Mock Users
export const users: User[] = [
  {
    id: 'user-1',
    name: 'John Admin',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'user-2',
    name: 'Sarah Developer',
    email: 'developer@example.com',
    role: 'developer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Website Redesign',
    clientName: 'John Smith',
    clientEmail: 'john@example.com',
    estimatedCost: 8500,
    status: 'pending',
    progress: 0,
    submittedAt: '2023-09-01T10:00:00',
    description: 'Complete redesign of an existing e-commerce platform with modern UI/UX improvements.',
    overviewPdf: 'ecommerce_overview.pdf',
    developerPdf: 'ecommerce_dev_guide.pdf',
  },
  {
    id: '2',
    name: 'Mobile Banking App',
    clientName: 'Sarah Johnson',
    clientEmail: 'sarah@bank.com',
    estimatedCost: 12000,
    status: 'in-progress',
    deadline: '2023-11-15T00:00:00',
    progress: 35,
    submittedAt: '2023-08-15T14:30:00',
    description: 'Secure mobile banking application with biometric authentication and real-time transaction processing.',
    overviewPdf: 'banking_overview.pdf',
    developerPdf: 'banking_dev_guide.pdf',
  },
  {
    id: '3',
    name: 'Healthcare Management System',
    clientName: 'Michael Williams',
    clientEmail: 'michael@healthcare.org',
    estimatedCost: 15000,
    status: 'in-progress',
    deadline: '2023-12-01T00:00:00',
    progress: 65,
    submittedAt: '2023-07-20T09:15:00',
    description: 'Comprehensive healthcare management system for patient records, appointments, and billing.',
    overviewPdf: 'healthcare_overview.pdf',
    developerPdf: 'healthcare_dev_guide.pdf',
  },
  {
    id: '4',
    name: 'Fitness Tracking App',
    clientName: 'Emily Davis',
    clientEmail: 'emily@fitness.co',
    estimatedCost: 7800,
    status: 'completed',
    deadline: '2023-08-30T00:00:00',
    progress: 100,
    submittedAt: '2023-06-10T16:45:00',
    description: 'Mobile application for tracking workouts, nutrition, and fitness goals with social sharing features.',
    overviewPdf: 'fitness_overview.pdf',
    developerPdf: 'fitness_dev_guide.pdf',
  },
  {
    id: '5',
    name: 'Real Estate Listing Platform',
    clientName: 'Robert Brown',
    clientEmail: 'robert@realty.com',
    estimatedCost: 9200,
    status: 'rejected',
    progress: 0,
    submittedAt: '2023-09-05T11:20:00',
    rejectionReason: 'Budget constraints and timeline issues',
    description: 'Online platform for real estate listings with virtual tours and property management features.',
    overviewPdf: 'realestate_overview.pdf',
    developerPdf: 'realestate_dev_guide.pdf',
  },
  {
    id: '6',
    name: 'Educational Course Platform',
    clientName: 'Jennifer Wilson',
    clientEmail: 'jennifer@edu.org',
    estimatedCost: 10500,
    status: 'in-progress',
    deadline: '2023-11-30T00:00:00',
    progress: 45,
    submittedAt: '2023-08-22T13:10:00',
    description: 'Online learning platform with video courses, quizzes, and certification tracking.',
    overviewPdf: 'education_overview.pdf',
    developerPdf: 'education_dev_guide.pdf',
  },
  {
    id: '7',
    name: 'Restaurant Ordering System',
    clientName: 'David Martinez',
    clientEmail: 'david@restaurant.com',
    estimatedCost: 6500,
    status: 'completed',
    deadline: '2023-09-15T00:00:00',
    progress: 100,
    submittedAt: '2023-07-05T10:30:00',
    description: 'Digital ordering system for restaurants with kitchen management and delivery tracking.',
    overviewPdf: 'restaurant_overview.pdf',
    developerPdf: 'restaurant_dev_guide.pdf',
  },
  {
    id: '8',
    name: 'Event Management Portal',
    clientName: 'Lisa Taylor',
    clientEmail: 'lisa@events.co',
    estimatedCost: 11000,
    status: 'delayed',
    deadline: '2023-10-10T00:00:00',
    progress: 70,
    submittedAt: '2023-06-25T09:40:00',
    description: 'Comprehensive event management system for planning, ticketing, and attendee management.',
    overviewPdf: 'event_overview.pdf',
    developerPdf: 'event_dev_guide.pdf',
  },
];


// Mock Tasks (additional tasks not tied to specific projects)
export const mockTasks: Task[] = [
  {
    id: '1',
    name: 'Design Database Schema',
    projectId: '2',
    projectName: 'Mobile Banking App',
    status: 'completed',
    deadline: '2023-08-25T00:00:00',
    priority: 'high',
  },
  {
    id: '2',
    name: 'Implement User Authentication',
    projectId: '2',
    projectName: 'Mobile Banking App',
    status: 'in-progress',
    deadline: '2023-09-10T00:00:00',
    priority: 'high',
  },
  {
    id: '3',
    name: 'Create Transaction API',
    projectId: '2',
    projectName: 'Mobile Banking App',
    status: 'not-started',
    deadline: '2023-09-25T00:00:00',
    priority: 'medium',
  },
  {
    id: '4',
    name: 'Design Patient Dashboard',
    projectId: '3',
    projectName: 'Healthcare Management System',
    status: 'completed',
    deadline: '2023-08-15T00:00:00',
    priority: 'medium',
  },
  {
    id: '5',
    name: 'Implement Appointment Scheduling',
    projectId: '3',
    projectName: 'Healthcare Management System',
    status: 'completed',
    deadline: '2023-09-01T00:00:00',
    priority: 'high',
  },
  {
    id: '6',
    name: 'Develop Billing Module',
    projectId: '3',
    projectName: 'Healthcare Management System',
    status: 'in-progress',
    deadline: '2023-10-15T00:00:00',
    priority: 'medium',
  },
  {
    id: '7',
    name: 'Integrate Electronic Health Records',
    projectId: '3',
    projectName: 'Healthcare Management System',
    status: 'not-started',
    deadline: '2023-11-01T00:00:00',
    priority: 'high',
  },
  {
    id: '8',
    name: 'Design Course Listing UI',
    projectId: '6',
    projectName: 'Educational Course Platform',
    status: 'completed',
    deadline: '2023-09-05T00:00:00',
    priority: 'medium',
  },
  {
    id: '9',
    name: 'Implement Video Streaming',
    projectId: '6',
    projectName: 'Educational Course Platform',
    status: 'in-progress',
    deadline: '2023-10-10T00:00:00',
    priority: 'high',
  },
  {
    id: '10',
    name: 'Develop Quiz Module',
    projectId: '6',
    projectName: 'Educational Course Platform',
    status: 'not-started',
    deadline: '2023-10-25T00:00:00',
    priority: 'medium',
  },
];


// Mock Team Members
export const teamMembers: TeamMember[] = [
  {
    id: 'user-2',
    name: 'Sarah Developer',
    role: 'developer',
    projectsAssigned: ['project-2', 'project-5'],
    availability: 'busy',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'team-2',
    name: 'Mike Johnson',
    role: 'developer',
    projectsAssigned: [],
    availability: 'available',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'team-3',
    name: 'Emily Chen',
    role: 'designer',
    projectsAssigned: ['project-2'],
    availability: 'busy',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'team-4',
    name: 'James Wilson',
    role: 'developer',
    projectsAssigned: ['project-5'],
    availability: 'busy',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'team-5',
    name: 'Sophia Martinez',
    role: 'designer',
    projectsAssigned: [],
    availability: 'available',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

// Mock Messages
export const messages: Message[] = [
  {
    id: 'msg-1',
    senderId: 'user-1',
    receiverId: 'user-2',
    content: 'How is the progress on the Mobile App project?',
    timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30).toISOString(),
    read: true,
  },
  {
    id: 'msg-2',
    senderId: 'user-2',
    receiverId: 'user-1',
    content: 'Going well! I\'ve completed the UI design and started on the frontend development.',
    timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 45).toISOString(),
    read: true,
  },
  {
    id: 'msg-3',
    senderId: 'user-1',
    receiverId: 'user-2',
    content: 'Great! Let me know if you need any resources or have questions about the requirements.',
    timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0).toISOString(),
    read: false,
  },
  {
    id: 'msg-4',
    senderId: 'user-2',
    receiverId: 'user-1',
    content: 'I might need clarification on the API integration. Can we discuss that tomorrow?',
    timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 15).toISOString(),
    read: false,
  },
];

export const getPendingProjects = () => 
  mockProjects.filter(project => project.status === 'pending');

export const getOngoingProjects = () => 
  mockProjects.filter(project => project.status === 'in-progress' || project.status === 'delayed');

export const getCompletedProjects = () => 
  mockProjects.filter(project => project.status === 'completed');

export const getRejectedProjects = () => 
  mockProjects.filter(project => project.status === 'rejected');

// export const getProjectById = (id: string) => projects.find(project => project.id === id);
// export const getTasksByProjectId = (projectId: string) => tasks.filter(task => task.projectId === projectId);
// export const getTasksByDeveloper = (developerId: string) => {
//   const developerProjects = projects.filter(project => 
//     project.assignedTo?.includes(developerId)
//   ).map(project => project.id);
  
//   return tasks.filter(task => 
//     developerProjects.includes(task.projectId)
//   );
// };

// export const getUpcomingDeadlines = () => {
//   const sevenDaysFromNow = addDays(today, 7);
//   return projects.filter(project => 
//     project.status === 'ongoing' && 
//     project.deadline && 
//     new Date(project.deadline) <= sevenDaysFromNow
//   );
// };

// export const getTotalRevenue = () => {
//   return projects
//     .filter(project => project.status === 'ongoing' || project.status === 'completed')
//     .reduce((total, project) => total + project.estimatedCost, 0);
// };

// export const getRecentRequests = (count = 5) => {
//   return [...projects]
//     .filter(project => project.status === 'pending')
//     .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
//     .slice(0, count);
// };