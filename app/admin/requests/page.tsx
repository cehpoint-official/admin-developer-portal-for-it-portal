import ProjectRequestsClient from "@/components/admin/request/ProjectRequestsClient";
import { fetchAllProjects } from "@/app/actions/admin-actions";
export const revalidate = 200;
export default async function ProjectRequests() {
  const response = await fetchAllProjects();
  return <ProjectRequestsClient projects={response.data} />;
}
