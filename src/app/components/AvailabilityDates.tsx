"use client";

import React from 'react';
import useAvailability from '@/app/hooks/useAvailability';
import BeatLoader from 'react-spinners/BeatLoader';
import { useServiceBooking } from '@/app/hooks/useServiceBooking';
import { useSession } from 'next-auth/react'; 
import ModalTel from '@/app/components/modals/ModalTel';
import Button from '@/app/components/CustomBtn';

interface AvailabilityDatesProps {
  service: string | null;
  date: string | null;
}

function AvailabilityDates({ service, date }: AvailabilityDatesProps) {
  const { availableTimes, loading, error, } = useAvailability(service, date);
  const { handleTimeSelect, isReserving, handleReserve, selectedTime, isOpenTelModal, closeModalTel } = useServiceBooking();
  const { data: session } = useSession();

  if (loading) {
    return (
      <div className="bg-gray-50 py-10 availabilityHours">
        <div className="container mx-auto text-center p-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Horarios Disponibles</h2>
          <div className="flex justify-center items-center h-32">
            <BeatLoader color="#f472b6" size={16} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto text-center p-4"><p className="text-gray-600 mt-4">Error al cargar los horarios: {error}</p></div>;
  }

  return (
    <div className="bg-gray-50 py-10 availabilityHours scroll-m-20">
      <div className="container mx-auto text-center p-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Horarios Disponibles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {availableTimes.map((time) => (
            <button
              key={time}
              disabled={isReserving}
              onClick={() => handleTimeSelect(time)}
              className={`border border-pink-300 text-pink-500 rounded-md py-3 px-6 hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1 cursor-pointer ${selectedTime === time ? 'bg-pink-500 text-white hover:bg-pink-400' : ''}`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
      {availableTimes.length > 0 && (
        <div className="mt-6 container mx-auto text-center p-4">
          <Button
            text="Reservar"
            id="reserveButton"
            onClick={() => { handleReserve(service!, date!, selectedTime!, session!); }}
            loading={isReserving}
            className={`bg-pink-500 min-w-40 text-white cursor-pointer py-2 px-4 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1 ${isReserving || !selectedTime ? 'opacity-50' : ''}`}
            disabled={isReserving || !selectedTime}
          />
        </div>
      )}
      {isOpenTelModal && (
        <ModalTel 
        isOpen={isOpenTelModal} 
        onClose={closeModalTel} 
        selectedService={service!} 
        selectedDate={date!} 
        selectedTime={selectedTime!} 
        handleReserve={handleReserve}
        session={session!}
        />
      )}
    </div>
  );
}

export default AvailabilityDates;