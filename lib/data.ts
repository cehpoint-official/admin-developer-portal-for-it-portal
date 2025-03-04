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
export const projects: Project[] = [
  {
    id: 'project-1',
    name: 'E-commerce Website Redesign',
    client: {
      id: 'client-1',
      name: 'Alex Johnson',
      email: 'alex@company.com',
      phone: '555-123-4567',
      company: 'Fashion Forward',
      budget: 15000,
    },
    overview: 'Overview PDF link',
    developerGuide: 'Developer Guide PDF link',
    estimatedCost: 12000,
    status: 'pending',
    submittedAt: formatDate(subDays(today, 2)),
    progress: 0,
  },
  {
    id: 'project-2',
    name: 'Mobile App Development',
    client: {
      id: 'client-2',
      name: 'Maria Garcia',
      email: 'maria@techstart.com',
      phone: '555-987-6543',
      company: 'TechStart',
      budget: 25000,
    },
    overview: 'Overview PDF link',
    developerGuide: 'Developer Guide PDF link',
    estimatedCost: 22000,
    status: 'ongoing',
    deadline: formatDate(addDays(today, 30)),
    submittedAt: formatDate(subDays(today, 15)),
    progress: 35,
    assignedTo: ['user-2'],
    tasks: [
      {
        id: 'task-1',
        projectId: 'project-2',
        name: 'UI Design',
        status: 'completed',
        deadline: formatDate(addDays(today, 5)),
        priority: 'high',
      },
      {
        id: 'task-2',
        projectId: 'project-2',
        name: 'Frontend Development',
        status: 'in-progress',
        deadline: formatDate(addDays(today, 15)),
        priority: 'high',
      },
      {
        id: 'task-3',
        projectId: 'project-2',
        name: 'Backend Integration',
        status: 'not-started',
        deadline: formatDate(addDays(today, 25)),
        priority: 'medium',
      },
    ],
  },
  {
    id: 'project-3',
    name: 'Corporate Website',
    client: {
      id: 'client-3',
      name: 'Robert Smith',
      email: 'robert@megacorp.com',
      phone: '555-555-5555',
      company: 'MegaCorp',
      budget: 18000,
    },
    overview: 'Overview PDF link',
    developerGuide: 'Developer Guide PDF link',
    estimatedCost: 16500,
    status: 'completed',
    deadline: formatDate(subDays(today, 10)),
    submittedAt: formatDate(subDays(today, 60)),
    progress: 100,
  },
  {
    id: 'project-4',
    name: 'Social Media Dashboard',
    client: {
      id: 'client-4',
      name: 'Jennifer Lee',
      email: 'jennifer@socialco.com',
      phone: '555-222-3333',
      company: 'SocialCo',
      budget: 9000,
    },
    overview: 'Overview PDF link',
    developerGuide: 'Developer Guide PDF link',
    estimatedCost: 8500,
    status: 'rejected',
    submittedAt: formatDate(subDays(today, 5)),
    progress: 0,
    rejectionReason: 'Budget constraints and timeline issues',
  },
  {
    id: 'project-5',
    name: 'Healthcare Portal',
    client: {
      id: 'client-5',
      name: 'David Wilson',
      email: 'david@healthplus.com',
      phone: '555-444-7777',
      company: 'HealthPlus',
      budget: 30000,
    },
    overview: 'Overview PDF link',
    developerGuide: 'Developer Guide PDF link',
    estimatedCost: 28000,
    status: 'ongoing',
    deadline: formatDate(addDays(today, 45)),
    submittedAt: formatDate(subDays(today, 20)),
    progress: 15,
    assignedTo: ['user-2'],
    tasks: [
      {
        id: 'task-4',
        projectId: 'project-5',
        name: 'Requirements Analysis',
        status: 'completed',
        deadline: formatDate(subDays(today, 10)),
        priority: 'high',
      },
      {
        id: 'task-5',
        projectId: 'project-5',
        name: 'Database Design',
        status: 'in-progress',
        deadline: formatDate(addDays(today, 5)),
        priority: 'high',
      },
      {
        id: 'task-6',
        projectId: 'project-5',
        name: 'Frontend Development',
        status: 'not-started',
        deadline: formatDate(addDays(today, 25)),
        priority: 'medium',
      },
      {
        id: 'task-7',
        projectId: 'project-5',
        name: 'Testing',
        status: 'not-started',
        deadline: formatDate(addDays(today, 40)),
        priority: 'medium',
      },
    ],
  },
  {
    id: 'project-6',
    name: 'Restaurant Ordering System',
    client: {
      id: 'client-6',
      name: 'Michael Brown',
      email: 'michael@tastybites.com',
      phone: '555-888-9999',
      company: 'Tasty Bites',
      budget: 12000,
    },
    overview: 'Overview PDF link',
    developerGuide: 'Developer Guide PDF link',
    estimatedCost: 11000,
    status: 'pending',
    submittedAt: formatDate(subDays(today, 1)),
    progress: 0,
  },
];

// Mock Tasks (additional tasks not tied to specific projects)
export const tasks: Task[] = [
  ...projects
    .filter(project => project.tasks)
    .flatMap(project => project.tasks || []),
  {
    id: 'task-8',
    projectId: 'project-3',
    name: 'Documentation',
    status: 'completed',
    deadline: formatDate(subDays(today, 15)),
    priority: 'low',
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

// Helper functions to get filtered data
export const getPendingProjects = () => projects.filter(project => project.status === 'pending');
export const getOngoingProjects = () => projects.filter(project => project.status === 'ongoing');
export const getCompletedProjects = () => projects.filter(project => project.status === 'completed');
export const getRejectedProjects = () => projects.filter(project => project.status === 'rejected');

export const getProjectById = (id: string) => projects.find(project => project.id === id);
export const getTasksByProjectId = (projectId: string) => tasks.filter(task => task.projectId === projectId);
export const getTasksByDeveloper = (developerId: string) => {
  const developerProjects = projects.filter(project => 
    project.assignedTo?.includes(developerId)
  ).map(project => project.id);
  
  return tasks.filter(task => 
    developerProjects.includes(task.projectId)
  );
};

export const getUpcomingDeadlines = () => {
  const sevenDaysFromNow = addDays(today, 7);
  return projects.filter(project => 
    project.status === 'ongoing' && 
    project.deadline && 
    new Date(project.deadline) <= sevenDaysFromNow
  );
};

export const getTotalRevenue = () => {
  return projects
    .filter(project => project.status === 'ongoing' || project.status === 'completed')
    .reduce((total, project) => total + project.estimatedCost, 0);
};

export const getRecentRequests = (count = 5) => {
  return [...projects]
    .filter(project => project.status === 'pending')
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, count);
};