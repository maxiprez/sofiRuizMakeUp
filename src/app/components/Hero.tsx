"use client"

import React from 'react';
import useHero from '@/app/hooks/useHero';
import Button from '@/app/components/Button';

interface HeroProps {
  onSearch: (service: string, date: string) => void;
}

function Hero({ onSearch }: HeroProps) {
  const { selectedService, handleServiceChange, handleDateChange, selectedDate } = useHero();
 
  return (
    <section className="bg-gradient-to-br from-gray-100 to-pink-100 py-20">
      <div className="container mx-auto text-center">
        <h1 className="lg:text-4xl text-2xl font-bold text-gray-800 mb-6">
          Reserva tus turnos de <span className="text-pink-600">Make Up</span> y <span className="text-pink-600">Perfilado de Cejas</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">Encuentra la disponibilidad perfecta para tu próximo servicio de belleza.</p>
        <div className="bg-white flex flex-col lg:gap-2 gap-2 sm:flex-row space-y-4 sm:space-x-4 justify-center align-center p-8">
          <div className="w-full sm:w-auto mb-0"> {/* Quitar margen inferior del contenedor del select */}
            <select
              className="block appearance-none w-full bg-gray-100 border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-pink-500"
              value={selectedService}
              onChange={handleServiceChange}
            >
              <option value="Todos los servicios" disabled>Todos los servicios</option>
              <option value="Make Up">Make Up</option>
              <option value="Make Up Express">Make Up Express</option>
              <option value="Perfilado de Cejas">Perfilado de Cejas</option>
            </select>
          
          </div>
          <div className="relative w-full sm:w-auto mb-0"> {/* Quitar margen inferior del contenedor del input date */}
            <input
                type="date"
                className="block appearance-none w-full bg-gray-100 border border-gray-300 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-pink-500"
                value={selectedDate}
                onChange={(event) => handleDateChange(event.target.value)}
            />
          </div>
          <Button
            text="Ver Disponibilidad"
            onClick={() => onSearch(selectedService, selectedDate)}
            className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto cursor-pointer"
            id="searchButton"
            disabled={false}
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;