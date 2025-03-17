
import { getClientProjects} from "@/lib/firebase/client";
import { revalidatePath } from "next/cache";


  
export async function fetchClientProjects(clientEmail: string) {
  try {
    const projects = await getClientProjects(clientEmail);
    console.log(projects);
    
    return { success: true, data: projects };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { success: false, error: "Failed to fetch projects" };
  }
}

