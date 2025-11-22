'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { CancelationEmail } from '@/app/components/emails/CancelationEmail';

interface Booking {
  id: number | string;
  service: string;
  date: string;
  time: string;
  services?: Services;
  users?: {
    id?: string;
    name?: string;
    email?: string;
    tel?: string;
  };
}
interface Services{
  id?: string;
  name?: string;
  duration?:number;
  price?:number;
  createdAt?: string;
  status?: boolean;
}
interface UseBookingUserResult {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  fetchUserBookings: () => Promise<void>;
  handleCancelBooking: (bookingId: number | string, fallbackBooking?: Booking) => Promise<void>;
  cancelLoadingId: number | string | null;
  setCancelLoadingId: React.Dispatch<React.SetStateAction<number | string | null>>;
  cancelErrorId: number | string | null;
  setCancelErrorId: React.Dispatch<React.SetStateAction<number | string | null>>;
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
  const [cancelLoadingId, setCancelLoadingId] = useState<number | string | null>(null);
  const [cancelErrorId, setCancelErrorId] = useState<number | string | null>(null);
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

  const handleCancelBooking = async (bookingId: number | string, fallbackBooking?: Booking) => {
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
        handleCancelBookingConfirm(bookingId, fallbackBooking);
      }
    });
  };

  const handleCancelBookingConfirm = async (bookingId: number | string, fallbackBooking?: Booking) => {
    try {
      const normalizedId = String(bookingId);
      const bookingToCancel = bookings.find((b) => String(b.id) === normalizedId);
      const bookingDetails = bookingToCancel ?? fallbackBooking;

      const cancelEndpoint = session?.user?.role === 'admin'
        ? '/api/admin/bookings/cancel'
        : '/api/user/bookings/cancel';

      const response = await fetch(cancelEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
        
      });

      if (bookingDetails && session?.user?.role !== 'admin') {
        const subject = "Cancelación de turno";

        const formatDate = (dateString: string | undefined, timeString: string | undefined) => {
          if (!dateString) return 'Fecha no disponible';

          try {
            const normalized = dateString.includes('/')
              ? (() => {
                  const [day, month, year] = dateString.split('/');
                  return `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                })()
              : dateString;

            const [year, month, day] = normalized.split('-').map(Number);
            const date = new Date(year, month - 1, day);

            if (Number.isNaN(date.getTime())) return dateString;

            if (timeString) {
              const [hours = '00', minutes = '00'] = timeString.split(':');
              date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
            }

            return date.toLocaleDateString('es-AR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }).replace(/\//g, '-');
          } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
          }
        };

        const formatTime = (timeString: string | undefined) => {
          if (!timeString) return '--:--';
          try {
            const [hours = '00', minutes = '00'] = timeString.split(':');
            return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
          } catch (error) {
            console.error('Error formatting time:', error);
            return timeString;
          }
        };

        const recipientName = bookingDetails?.users?.name ?? session?.user?.name ?? 'Cliente';
        const targetEmail = bookingDetails?.users?.email ?? session?.user?.email;

        if (targetEmail) {
          const htmlContent = CancelationEmail({
            userFullName: recipientName,
            service: bookingDetails?.services?.name ?? bookingDetails?.service ?? 'Servicio',
            date: bookingDetails?.date ? formatDate(bookingDetails?.date, bookingDetails?.time) : 'Fecha no disponible',
            time: bookingDetails?.time ? formatTime(bookingDetails?.time) : '--:--'
          });

          const emailResponse = await fetch('/api/sendEmail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              toEmail: targetEmail,
              ccEmail: process.env.EMAIL_CC!,
              subject,
              htmlContent,
            }),
          });

          if (!emailResponse.ok) {
            console.error('Error al enviar el correo de cancelación');
          }
        }
      }    
      if (response.ok) {
        setBookings(bookings.filter((booking) => String(booking.id) !== normalizedId));
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