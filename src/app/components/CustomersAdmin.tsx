"use server";

import { getCustomers } from "@/app/_actions/abmCustomers.action";
import { CustomersAdminClient } from "@/app/components/CustomersAdminClient";
import { searchDates } from "@/app/_actions/searchDates.action";

export default async function CustomersAdmin() {
  const { data: customers } = await getCustomers();
  const { data: bookings } = await searchDates();

  return(
        <CustomersAdminClient 
            customers={customers ?? []}
            bookings={bookings ?? []} 
        />
    )
}
