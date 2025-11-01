import { useState, useCallback, useEffect } from 'react';
import { createBooking } from '@/app/_actions/bookingsDB.action';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useModalPhone } from '@/app/hooks/useModalPhone';
interface Session {
  user: {
    name?: string | null;
    email?: string | null;
    tel?: string | null;
  };
}

export const useServiceBooking = () => {
  const { isOpenTelModal, openModalPhone, closeModalPhone } = useModalPhone();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isReserving, setIsReserving] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [hasShownTelError, setHasShownTelError] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(0);

  useEffect(() => {
      if (bookingError === "telError") {
        openModalPhone();
        setHasShownTelError(true);
      }
      if (bookingError !== "telError" && hasShownTelError) {
        setHasShownTelError(false);
      }
  }, [bookingError, openModalPhone, closeModalPhone, hasShownTelError]);
  

  const handleSearch = useCallback((service_id: string, date: string, durationService: number) => {
    setSelectedServiceId(service_id);
    setSelectedDate(date);
    setSelectedDuration(durationService);
  }, []);

  const handleTimeSelect = (time: string) => {
    document.getElementById('reserveButton')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setSelectedTime(time);
    setBookingSuccess(false);
    setBookingError(null);
  };

  const handleReserve = useCallback(
    async (service_id: string, date: string, selectedTime: string, session: Session) => {
      if (!session) {
        Swal.fire({
          icon: 'warning',
          title: 'Debes iniciar sesión',
          text: 'Por favor, iniciá sesión para continuar.',
        });
        return;
      }

      const tel = session?.user?.tel;
      if (!tel || tel.trim() === '') {
        openModalPhone();
        return;
      }

      if (!service_id || !date || !selectedTime) {
        Swal.fire({
          icon: 'warning',
          title: '¡Atención!',
          text: 'Por favor, selecciona servicio, fecha y hora.',
        });
        return;
      }

      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton:
            'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
          cancelButton:
            'bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 mr-4',
        },
        buttonsStyling: false,
      });

      const [year, month, day] = date.split('-').map(Number);
      const localDate = new Date(year, month - 1, day);
      const formattedDate = localDate.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
      });

      swalWithBootstrapButtons
        .fire({
          title: '¿Confirmar reserva?',
          html: `
            <p style="font-size:16px;">
              ¿Querés confirmar el turno para el <strong>${formattedDate}</strong> a las <strong>${selectedTime}hs</strong>?
            </p>
          `,
          icon: 'question',
          iconColor: '#3B82F6',
          showCancelButton: true,
          confirmButtonText: 'Sí, confirmar',
          cancelButtonText: 'Cancelar',
          background: '#fff',
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            setIsReserving(true);
            setBookingSuccess(false);
            setBookingError(null);

            try {
              const bookingData = {
                service_id,
                date,
                time: selectedTime,
                tel,
              };

              const bookingResult = await createBooking(bookingData);

              if (bookingResult.error) {
                if (bookingResult.tel) {
                  setBookingError('telError');
                  return;
                }

                setBookingError(bookingResult.error);
                Swal.fire({
                  icon: 'error',
                  title: '¡Error!',
                  text: bookingResult.error,
                });
              } else {
                setBookingSuccess(true);
                Swal.fire({
                  icon: 'success',
                  title: '¡Reserva exitosa!',
                  text: 'Turno reservado.',
                  timer: 2000,
                  showConfirmButton: false,
                });
                setSelectedTime(null);
              }
            } catch (error) {
              console.error('Error al reservar la cita:', error);
              setBookingError('Ocurrió un error al reservar el turno.');
              Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Ya existe un turno en este horario',
              });
            } finally {
              setIsReserving(false);
            }
          }
        });
    },
    [openModalPhone]
  );

  return {
    selectedServiceId,
    selectedDate,
    selectedDuration,
    handleSearch,
    selectedTime,
    handleTimeSelect,
    isReserving,
    bookingSuccess,
    bookingError,
    handleReserve,
    isOpenTelModal,
    openModalPhone,
    closeModalPhone,
    hasShownTelError,
    setHasShownTelError,
  };
};
