"use client";

import Hero from "@/app/components/Hero";
import AvailabilityDates from "@/app/components/AvailabilityDates";
import Footer from "@/app/components/Footer";
import { useServiceBooking } from "@/app/hooks/useServiceBooking";

export default function Home() {
  const { selectedService, selectedDate, handleSearch } = useServiceBooking();
  return (
    <main className="flex flex-col min-h-screen">
      <Hero onSearch={handleSearch} />
        <main className="flex-grow py-10">
          <div className="container mx-auto text-center">
            {/* El contenido principal ahora podría ir aquí o dentro del Hero */}
          </div>
          {selectedDate && <AvailabilityDates service={selectedService} date={selectedDate} />}
        </main>
      <Footer />
    </main>
  );
}