import { getAllProjectsRequest, getProjectById } from "@/lib/firebase/admin";

export async function fetchAllProjects() {
    try {
      const projects = await getAllProjectsRequest();
      return { success: true, data: projects };
    } catch (error) {
      console.error("Error fetching projects:", error);
      return { success: false, error: "Failed to fetch projects" };
    }
  }

export async function fetchProjectById(id: string) {
  try {
    const project = await getProjectById(id);
    if (!project) {
      return { success: false, error: "Project not found" };
    }
    return { success: true, data: project };
  } catch (error) {
    console.error("Error fetching project:", error);
    return { success: false, error: "Failed to fetch project" };
  }
}