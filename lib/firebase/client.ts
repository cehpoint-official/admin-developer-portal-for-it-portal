import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  updateDoc,
  limit,
} from "firebase/firestore";
import { Project, ProjectStatus } from "../types";
import { db } from "@/firebase";

//get all projects 
export const getAllProjects = async () => {
  try {
    const projectsRef = collection(db, "Projects");
    const querySnapshot = await getDocs(projectsRef);
    const projects: Project[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      projects.push({
        id: doc.id,
        ...data,
        submittedAt: data.submittedAt?.toDate() || null,
        startDate: data.startDate?.toDate() || null,
        endDate: data.endDate?.toDate() || null,
      } as Project);
    });

    return projects;
  } catch (error) {
    console.error("Error fetching all projects:", error);
    throw error;
  }
};
// Get all projects for a specific client
export async function getClientProjects(clientEmail: string) {
  try {
    const projectsRef = collection(db, "Projects");
    const q = query(projectsRef, where("clientEmail", "==", clientEmail));
    
    const querySnapshot = await getDocs(q);
    const projects: Project[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      projects.push({
        id: doc.id,
        ...data,
        submittedAt: data.submittedAt?.toDate() || new Date(),
        startDate: data.startDate?.toDate() || null,
        endDate: data.endDate?.toDate() || null,
      } as Project);
    });
    
    return projects;
  } catch (error) {
    console.error("Error fetching client projects:", error);
    throw error;
  }
}

// Get a single project by ID
export async function getProjectById(projectId: string) {
  try {
    const projectRef = doc(db, "Projects", projectId);
    const projectSnap = await getDoc(projectRef);
    
    if (projectSnap.exists()) {
      const data = projectSnap.data();
      return {
        id: projectSnap.id,
        ...data,
        submittedAt: data.submittedAt?.toDate() || new Date(),
        startDate: data.startDate?.toDate() || null,
        endDate: data.endDate?.toDate() || null,
      } as Project;
    } else {
      throw new Error("Project not found");
    }
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
}

// Get projects by status
export async function getProjectsByStatus(
  clientEmail: string,
  status: ProjectStatus
) {
  try {
    const projectsRef = collection(db, "Projects");
    const q = query(
      projectsRef,
      where("clientEmail", "==", clientEmail),
      where("status", "==", status),
      orderBy("submittedAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const projects: Project[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      projects.push({
        id: doc.id,
        ...data,
        submittedAt: data.submittedAt?.toDate() || new Date(),
        startDate: data.startDate?.toDate() || null,
        endDate: data.endDate?.toDate() || null,
      } as Project);
    });
    
    return projects;
  } catch (error) {
    console.error(`Error fetching ${status} projects:`, error);
    throw error;
  }
}

// Get recent projects (limited number)
export async function getRecentProjects(clientEmail: string, limitCount = 5) {
  try {
    const projectsRef = collection(db, "Projects");
    const q = query(
      projectsRef,
      where("clientEmail", "==", clientEmail),
      orderBy("submittedAt", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const projects: Project[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      projects.push({
        id: doc.id,
        ...data,
        submittedAt: data.submittedAt?.toDate() || new Date(),
        startDate: data.startDate?.toDate() || null,
        endDate: data.endDate?.toDate() || null,
      } as Project);
    });
    
    return projects;
  } catch (error) {
    console.error("Error fetching recent projects:", error);
    throw error;
  }
}