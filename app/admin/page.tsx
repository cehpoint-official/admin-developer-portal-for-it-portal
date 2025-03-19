import DashboardClient from "@/components/admin/DashboardClient";
import { fetchAllProjects } from "../actions/common-actions";


export const revalidate = 100;
export default async  function AdminDashboard() {
  const response = await fetchAllProjects();

  return <DashboardClient projects={response.data}/>
}
