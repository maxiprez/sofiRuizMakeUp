import { useState, useCallback, useEffect } from 'react';
import { createBooking } from '../actions/bookingsDB';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useModalTel } from '../hooks/useModalTel';
interface Session {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    tel?: string | null;
  };
}

export const useServiceBooking = () => {
  const { isOpenTelModal, openModalTel, closeModalTel } = useModalTel();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isReserving, setIsReserving] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [hasShownTelError, setHasShownTelError] = useState(false);

  useEffect(() => {
      if (bookingError === "telError") {
        openModalTel();
        setHasShownTelError(true);
      }
      if (bookingError !== "telError" && hasShownTelError) {
        setHasShownTelError(false);
      }
  }, [bookingError, openModalTel, closeModalTel, hasShownTelError]);
  

  const handleSearch = useCallback((service: string, date: string) => {
    setSelectedService(service);
    setSelectedDate(date);
  }, []);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setBookingSuccess(false);
    setBookingError(null);
  };

  const handleReserve = useCallback(
    async (service: string, date: string, selectedTime: string, session: Session) => {
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
        openModalTel();
        return;
      }

      if (!service || !date || !selectedTime) {
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
                service,
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
    [openModalTel]
  );

  return {
    selectedService,
    selectedDate,
    handleSearch,
    selectedTime,
    handleTimeSelect,
    isReserving,
    bookingSuccess,
    bookingError,
    handleReserve,
    isOpenTelModal,
    openModalTel,
    closeModalTel,
    hasShownTelError,
    setHasShownTelError,
  };
};
