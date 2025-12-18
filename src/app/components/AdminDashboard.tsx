"use server";

import { AdminDashboardClient } from "@/app/components/AdminDashboardClient";
import { getMonthlyRevenueComparison } from "@/app/_actions/getRevenue.action";
import { getDailyBookingsComparison } from "@/app/_actions/getBookingsDailyComparison.action";
import { getDailyCancelledBookingsComparison } from "@/app/_actions/getCancellationBookins.action";
import { getCustomers } from "@/app/_actions/abmCustomers.action";

export default async function AdminDashboard() {
  const revenue = await getMonthlyRevenueComparison();
  const dailyBookingComparison = await getDailyBookingsComparison();
  const cancelledBookings = await getDailyCancelledBookingsComparison();
  const customers = await getCustomers();

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50">
      <AdminDashboardClient 
        revenue={revenue} 
        dailyBookingComparison={dailyBookingComparison} 
        cancelledBookings={cancelledBookings}
        customers={customers.data || []}
      />
    </div>
  );
}