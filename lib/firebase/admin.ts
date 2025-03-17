import {
  collection,
  getDocs,
  doc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { Project, ProjectStatus } from "../types";
import { db } from "@/firebase";



export const updateTheStatusOfProject = async (
  projectId: string,
  status: ProjectStatus
) => {
  try {
    const projectRef = doc(db, "Projects", projectId);
    await updateDoc(projectRef, {
      status: status,
      // If the status is "in-progress", we might want to set the startDate
      ...(status === "in-progress" && { startDate: new Date() }),
      // If the status is "completed", we might want to set the endDate
      ...(status === "completed" && { endDate: new Date() }),
    });

    return { success: true, message: `Project status updated to ${status}` };
  } catch (error) {
    console.error("Error updating project status:", error);
    throw error;
  }
};

// Get projects by status
export async function getProjectsByStatus(status: string | string[]) {
  try {
    const projectsRef = collection(db, "projects");
    let projectsQuery;

    if (Array.isArray(status)) {
      // If status is an array, get projects with any of those statuses
      projectsQuery = query(projectsRef, where("status", "in", status));
    } else {
      // If status is a string, get projects with that status
      projectsQuery = query(projectsRef, where("status", "==", status));
    }

    const projectsSnapshot = await getDocs(projectsQuery);
    const projects = projectsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        submittedAt: data.submittedAt?.toDate() || null,
        startDate: data.startDate?.toDate() || null,
        endDate: data.endDate?.toDate() || null,
      } as Project;
    });
  } catch (error) {
    console.error("Error getting projects by status:", error);
    throw new Error("Failed to fetch projects by status");
  }
}
