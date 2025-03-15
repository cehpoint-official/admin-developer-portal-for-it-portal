import { fetchAllProjects } from "@/app/actions/admin-actions";
import ProjectRejectedClient from "@/components/admin/rejected/ProjectRejectedClient";

export const revalidate = 200;

export default async function RejectedProjects() {
  const response = await fetchAllProjects();
  return <ProjectRejectedClient projects={response.data} />;
}
