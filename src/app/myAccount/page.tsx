'use client';

import useBookingUser from "../hooks/useBookingUser";
import BeatLoader from 'react-spinners/BeatLoader';
import Link from "next/link";

export default function MyAccount() {
  const {
    bookings,
    loading,
    error,
    handleCancelBooking,
    // cancelLoadingId,
    cancelErrorId,
    isAuthenticated,
  } = useBookingUser();

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-32 flex-col center">
        <BeatLoader color="#f472b6" size={16} />
        <p>Redirigiendo a la página de inicio de sesión...</p>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32 flex-col center">
        <BeatLoader color="#f472b6" size={16} />
        <p>Cargando tus turnos...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Mi Cuenta</h1>
      <h2 className="text-xl font-semibold mb-2">Tus Turnos</h2>
      {bookings.length === 0 ? (
        <>
          <p className="text-gray-600">No tienes turnos reservados aún.</p>
          <Link href="/" className="cursor-pointer mt-2 block text-center max-w-40 mx-auto text-white bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded">
            ¡Buscar un turno!
          </Link>
        </>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li key={booking.id} className="bg-white shadow rounded-md p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{booking.service}</p>
                <p className="text-gray-600 xs:text-xs lg:text-md">
                  {(() => {
                    const [year, month, day] = booking.date.split('-').map(Number);
                    const localDate = new Date(year, month - 1, day);
                    return localDate.toLocaleDateString('es-AR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    });
                  })()} a las {booking.time.slice(0, 5)}hs
                </p>
              </div>
              <div>
                <button
                  onClick={() => handleCancelBooking(booking.id)}
                  // disabled={cancelLoadingId === booking.id}
                  className="bg-red-500 xs:text-xs lg:text-md cursor-pointer hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancelar Turno
                </button>
                {cancelErrorId === booking.id && (
                  <p className="text-red-500 text-sm mt-1">Ocurrió un error al cancelar.</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}