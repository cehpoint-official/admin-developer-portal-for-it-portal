
import { fetchAllProjects } from "@/app/actions/admin-actions";
import DeveloperProjectsClient from "@/components/developer/projects/DeveloperProjectsClient";

export const revalidate = 200;

export default async function ProjectRequests() {
  const response = await fetchAllProjects();
  return <DeveloperProjectsClient projects={response.data} />;
}
