'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import CancelationEmail from '../components/emails/CancelationEmail';

interface Booking {
  id: number;
  service: string;
  date: string;
  time: string;
  services: Services;
}
interface Services{
  id: string;
  name: string;
  duration?:number;
  price:number;
  createdAt: string;
  status: boolean;
}
interface UseBookingUserResult {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  fetchUserBookings: () => Promise<void>;
  handleCancelBooking: (bookingId: number) => Promise<void>;
  cancelLoadingId: number | null;
  setCancelLoadingId: React.Dispatch<React.SetStateAction<number | null>>;
  cancelErrorId: number | null;
  setCancelErrorId: React.Dispatch<React.SetStateAction<number | null>>;
  isAuthenticated: boolean;
  isUpcoming: (date: string) => boolean;
  filteredBookings: Booking[];
  setShowHistory: React.Dispatch<React.SetStateAction<boolean>>;
  showHistory: boolean;
}

export default function useBookingUser(): UseBookingUserResult {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelLoadingId, setCancelLoadingId] = useState<number | null>(null);
  const [cancelErrorId, setCancelErrorId] = useState<number | null>(null);
  const isAuthenticated = status === 'authenticated';
  const [showHistory, setShowHistory] = useState(false);

  const fetchUserBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/user/bookings')
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        console.error('Error al obtener los turnos del usuario');
        setError('Error al cargar tus turnos.');
      }
    } catch (error) {
      console.error('Error al obtener los turnos del usuario:', error);
      setError('Ocurrió un error al cargar tus turnos.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    setCancelLoadingId(bookingId);
    setCancelErrorId(null);

     const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
        confirmButton: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
        cancelButton: "bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 mr-4"
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: '¿Estás segura/o de cancelar el turno?',
      text: 'No podrás revertir esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleCancelBookingConfirm(bookingId);
      }
    });
  };

  const handleCancelBookingConfirm = async (bookingId: number) => {
    try {
      const bookingToCancel = bookings.find((b) => b.id === bookingId);
      const response = await fetch('/api/user/bookings/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
        
      });


      // Send cancellation email
      const userEmail = session?.user?.email;
      if (userEmail) {
        const subject = "Cancelación de turno";
        
        const formatDate = (dateString: string | undefined, timeString: string | undefined) => {
          if (!dateString) return 'Fecha no disponible';
          
          try {
            // Basic date parsing - assumes dateString is in YYYY-MM-DD format
            const [year, month, day] = dateString.split('-').map(Number);
            const date = new Date(year, month - 1, day); // month is 0-indexed in JS Date
            
            // Add time if available
            if (timeString) {
              const [hours, minutes] = timeString.split(':').map(Number);
              date.setHours(hours, minutes, 0, 0);
            }
            
            return date.toLocaleDateString('es-AR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }).replace(/\//g, '-'); // Convert DD/MM/YYYY to DD-MM-YYYY
            
          } catch (error) {
            console.error('Error formatting date:', error);
            return dateString; // Return original if parsing fails
          }
        };

        const formatTime = (timeString: string | undefined) => {
          if (!timeString) return '--:--';
          try {
            const [hours, minutes] = timeString.split(':').map(part => part.padStart(2, '0'));
            return `${hours}:${minutes}`;
          } catch (error) {
            console.error('Error formatting time:', error);
            return timeString;
          }
        };

        const htmlContent = CancelationEmail({
          userFullName: session?.user?.name ?? '',
          service: bookingToCancel?.services?.name ?? 'Servicio',
          date: bookingToCancel?.date ? formatDate(bookingToCancel?.date, bookingToCancel?.time) : '',
          time: bookingToCancel?.time ? formatTime(bookingToCancel?.time) : ''
        });

        const emailResponse = await fetch('/api/sendEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            toEmail: userEmail,
            ccEmail: process.env.EMAIL_CC!,
            subject,
            htmlContent,
          }),
        });

        if (!emailResponse.ok) {
          console.error('Error al enviar el correo de cancelación');
        }
      }
     
      if (response.ok) {
        setBookings(bookings.filter((booking) => booking.id !== bookingId));
      } else {
        const errorData = await response.json();
        setCancelErrorId(bookingId);
        console.error('Error al cancelar el turno:', errorData?.error);
      }
    } catch (error) {
      console.error('Error al cancelar el turno:', error);
      setCancelErrorId(bookingId);
    } finally {
      setCancelLoadingId(null);
    }
  };

  const isUpcoming = (date: string) => {
    const today = new Date();
    const bookingDate = new Date(date);
    return bookingDate > today;
  };

  const filteredBookings = bookings.filter((booking) => {
    if (showHistory) {
      return !isUpcoming(booking.date);
    } else {
      return isUpcoming(booking.date);
    }
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchUserBookings();
    }
  }, [status, router]);
  return {
    bookings,
    loading,
    error,
    fetchUserBookings,
    handleCancelBooking,
    cancelLoadingId,
    setCancelLoadingId,
    cancelErrorId,
    setCancelErrorId,
    isAuthenticated,
    isUpcoming,
    filteredBookings,
    showHistory,
    setShowHistory,
  };
}