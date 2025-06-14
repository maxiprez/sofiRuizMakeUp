"use client"

import React from 'react';
import useHero from '@/app/hooks/useHero';
import { ChevronDown } from '@/app/icons/icons';
import { Button } from '@/components/ui/button';
import useGetServices  from '@/app/hooks/useABMServices';
import { Service } from '@/app/actions/ambServices';

interface HeroProps {
  onSearch: (serviceId: string, date: string) => void;
}

function Hero({ onSearch }: HeroProps) {
  const { selectedServiceId, selectedService, handleServiceChange, handleDateChange, selectedDate, handleSearchAndScroll } = useHero(onSearch);
  const { services } = useGetServices();
  console.log("selectedServiceId: ", selectedServiceId);
  console.log("selectedService: ", selectedService);
  return (
    <section className="bg-gradient-to-br from-gray-100 to-pink-100 md:py-20 py-10">
      <div className="container mx-auto text-center">
        <h1 className="lg:text-4xl text-2xl font-bold text-gray-800 mb-6">
          Reserva tus turnos de <span className="text-pink-600">Make Up</span> y <span className="text-pink-600">Perfilado de Cejas</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">Encuentra la disponibilidad perfecta para tu próximo servicio de belleza.</p>
        <div className="bg-white flex flex-col lg:gap-2 gap-2 sm:flex-row space-y-4 sm:space-x-4 justify-center align-center p-8">
          <div className="w-full sm:w-auto mb-0 relative">
          <select
            className="block appearance-none w-full bg-gray-100 border border-gray-300 text-gray-700 min-h-12 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-pink-500"
            value={selectedServiceId}
            onChange={handleServiceChange}
            required
            name="service"
            aria-label="Selecciona un servicio"
          >
            <option value="" disabled className="text-gray-400">Todos los servicios</option>
            {services.map((service: Service) => (
              <option key={service.id} value={service.id}>
                {service.name} ${service.price.toLocaleString()}
              </option>
            ))}
          </select>
            <ChevronDown color="#f472b6" size={22} className="absolute right-2 top-3 transition-transform duration-200" />
          </div>
          <div className="relative w-full sm:w-auto mb-0">
            <input type="date" className="block appearance-none w-full bg-gray-100 border border-gray-300 text-gray-700 min-h-12 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-pink-500" value={selectedDate} onChange={(event) => handleDateChange(event.target.value)} required id="dateInput" name="date" aria-label="Selecciona una fecha" />
          </div>
          <Button onClick={handleSearchAndScroll} className="bg-pink-500 hover:bg-pink-600 md:text-base text-sm text-white font-bold min-h-12 py-4 px-6 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto cursor-pointer" id="searchButton" disabled={false}>
            Ver Disponibilidad
          </Button>
        </div>
      </div>
    </section>
  );
}
export default Hero;