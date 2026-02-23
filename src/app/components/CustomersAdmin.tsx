"use server";

import { CustomersAdminClient } from "@/app/components/CustomersAdminClient";
import { searchDates } from "@/app/_actions/searchDates.action";
import { getCustomers } from "@/app/_actions/obtainCustomers.action";

export default async function CustomersAdmin({ searchParams }: { searchParams: Promise<{ q: string }> }) {
  const { data: bookings } = await searchDates();
  const resolvedParams = await searchParams;
  const q = resolvedParams?.q?.toLowerCase().trim();

  const response = await getCustomers();
  const customersInfo = {
      allCustomers: response.allData
  };
    const filteredBookings = q
    ? bookings?.filter((booking) =>
        booking.users.name.toLowerCase().includes(q) ||
        booking.users.email?.toLowerCase().includes(q) ||
        booking.users.tel?.includes(q)
        )
    : bookings;
    
  return(
        <CustomersAdminClient 
           customers={{
              data: customersInfo.allCustomers,
              count: customersInfo.allCustomers.length
            }}
            bookings={filteredBookings || []}
        />
    )
}
