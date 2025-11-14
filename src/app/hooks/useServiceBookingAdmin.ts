import { useState } from 'react';
import { createBooking } from '@/app/_actions/bookingsDB.action';
import Swal from 'sweetalert2';

export const useServiceBookingAdmin = () => {
  const [isSaving, setIsSaving] = useState(false);

  const handleAdminReserve = async (service_id: string, date: string, time: string, user: { user: string }) => {

    if (!service_id || !date || !time || !user?.user) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Debe seleccionar cliente, servicio y fecha',
      });
      return; 
    }

    try {
      setIsSaving(true);
      const bookingResult = await createBooking({
        service_id,
        user_id: user.user,
        date,
        time,
      });

      if (bookingResult.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear la cita',
          text: bookingResult.error,
        });
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Cita creada correctamente',
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error al crear la cita:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: 'No se pudo crear el turno.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return { handleAdminReserve, isSaving };
};
