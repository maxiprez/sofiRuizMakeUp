"use client";

import React from 'react';
import useAvailability from '@/app/hooks/useAvailability';
import BeatLoader from 'react-spinners/BeatLoader';
import { useServiceBooking } from '@/app/hooks/useServiceBooking';
import { useSession } from 'next-auth/react'; 
import ModalPhone from '@/app/components/modals/ModalPhone';
import { CustomBtn as Button } from '@/app/components/CustomBtn';

interface AvailabilityDatesProps {
  service_id: string | null;
  date: string;
  duration: number;
}

function AvailabilityDates({ service_id, date, duration }: AvailabilityDatesProps) {
  const { availableTimes, loading, error, } = useAvailability(service_id, date, duration);
  const { handleTimeSelect, isReserving, handleReserve, selectedTime, isOpenTelModal, closeModalPhone } = useServiceBooking();
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
        {availableTimes.length === 0 && (
          <p className="text-2xl font-semibold text-gray-800 mb-6">Sin horarios disponibles para esta fecha.</p>
        )}
        {availableTimes.length > 0 && (
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Horarios Disponibles</h2>
        )}
        <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {availableTimes.map((time) => (
            <Button
              key={time}
              disabled={isReserving}
              onClick={() => handleTimeSelect(time)}
              text={time}
              className={`border border-pink-300 text-pink-500 rounded-md py-2 px-4 hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1 cursor-pointer ${selectedTime === time ? 'bg-pink-500 text-white hover:bg-pink-400' : ''}`}
              />
          ))}
        </div>
      </div>
      {availableTimes.length > 0 && (
        <div className="md:mt-6 my-2 container mx-auto text-center p-4">
          <Button
            text="Reservar"
            id="reserveButton"
            onClick={() => { handleReserve(service_id!, date!, selectedTime!, session!); }}
            loading={isReserving}
            className={`bg-pink-500 min-w-40 text-white cursor-pointer py-2 px-4 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1 ${isReserving || !selectedTime ? 'opacity-50' : ''}`}
            disabled={isReserving || !selectedTime}
          />
        </div>
      )}  
      {isOpenTelModal && (
        <ModalPhone 
        isOpen={isOpenTelModal} 
        onClose={closeModalPhone} 
        selectedServiceId={service_id!} 
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