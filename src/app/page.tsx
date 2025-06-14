"use client";

import Hero from "@/app/components/Hero";
import AvailabilityDates from "@/app/components/AvailabilityDates";
import Footer from "@/app/components/Footer";
import { useServiceBooking } from "@/app/hooks/useServiceBooking";

export default function Home() {
  const { selectedServiceId, selectedDate, handleSearch } = useServiceBooking();
  return (
    <main className="flex flex-col">
      <Hero onSearch={handleSearch} />
        <main>
          {selectedDate && <AvailabilityDates service_id={selectedServiceId} date={selectedDate} />}
        </main>
      <Footer />
    </main>
  );
}