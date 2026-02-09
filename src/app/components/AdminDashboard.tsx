"use server";

import { AdminDashboardClient } from "@/app/components/AdminDashboardClient";
import { getMonthlyRevenueComparison } from "@/app/_actions/getRevenue.action";
import { getDailyBookingsComparison } from "@/app/_actions/getBookingsDailyComparison.action";
import { getDailyCancelledBookingsComparison } from "@/app/_actions/getCancellationBookins.action";

export default async function AdminDashboard({searchParams}: { searchParams: { q?: string }}) {
  const revenue = await getMonthlyRevenueComparison();
  const dailyBookingComparison = await getDailyBookingsComparison();
  const cancelledBookings = await getDailyCancelledBookingsComparison();

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50">
      <AdminDashboardClient 
        revenue={revenue} 
        dailyBookingComparison={dailyBookingComparison} 
        cancelledBookings={cancelledBookings}
        searchParams={searchParams}
      />
    </div>
  );
}