import AdminDashboard from "@/app/components/AdminDashboard";

export default async function AdminMain({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  return <AdminDashboard searchParams={searchParams}/>
}