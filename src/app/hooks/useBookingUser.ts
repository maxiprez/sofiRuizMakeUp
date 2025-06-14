'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

interface Booking {
  id: number;
  service: string;
  date: string;
  time: string;
  services: Services[];
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
}

export default function useBookingUser(): UseBookingUserResult {
  const { status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelLoadingId, setCancelLoadingId] = useState<number | null>(null);
  const [cancelErrorId, setCancelErrorId] = useState<number | null>(null);
  const isAuthenticated = status === 'authenticated';

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
      //const bookingToCancel = bookings.find((b) => b.id === bookingId);
      // const eventId = bookingToCancel?.google_event_id;

      const response = await fetch('/api/user/bookings/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
        
      });
     
      if (response.ok) {
        console.log("response cancel event: ", response);
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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchUserBookings();
    }
  }, [status, router]);

  console.log("bookings: ", bookings);
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
  };
}