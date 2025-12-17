"use server";

import { CustomersAdminClient } from "@/app/components/CustomersAdminClient";
import { searchDates } from "@/app/_actions/searchDates.action";
import { Customer } from "types/entities";

export default async function CustomersAdmin({ customers, searchParams }: { customers: Customer[]; searchParams: { q?: string } }) {
  const { data: bookings } = await searchDates();
  const q = searchParams?.q?.toLowerCase().trim() ?? "";

    const filteredBookings = q
    ? bookings?.filter((booking) =>
        booking.users.name.toLowerCase().includes(q) ||
        booking.users.email?.toLowerCase().includes(q) ||
        booking.users.tel?.includes(q)
        )
    : bookings;
    
  return(
        <CustomersAdminClient 
            customers={customers}
            bookings={filteredBookings || []}
        />
    )
}
