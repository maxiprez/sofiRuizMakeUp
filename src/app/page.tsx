"use client";

import Hero from "@/app/components/Hero";
import AvailabilityDates from "@/app/components/AvailabilityDates";
import Footer from "@/app/components/Footer";
import { useServiceBooking } from "@/app/hooks/useServiceBooking";

export default function Home() {
  const { selectedServiceId, selectedDate, selectedDuration, handleSearch } = useServiceBooking();
  return (
    <main className={`bg-gradient-to-br from-gray-100 to-pink-100 flex flex-col ${selectedDate ? "h-auto" : "h-screen"}`}>
      <Hero onSearch={handleSearch} />
        <div>
          {selectedDate && <AvailabilityDates service_id={selectedServiceId} date={selectedDate} duration={selectedDuration} />}
        </div>
      <Footer />
    </main>
  );
}