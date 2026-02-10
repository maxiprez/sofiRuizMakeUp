import AdminDashboard from "@/app/components/AdminDashboard";

export default async function AdminMain({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  return <AdminDashboard searchParams={Promise.resolve(resolvedSearchParams)} />
}