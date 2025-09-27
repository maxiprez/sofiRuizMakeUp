"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BeatLoader from 'react-spinners/BeatLoader';

export default function EmailValidateOk() {
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [message, setMessage] = useState('Verificando tu sesión...');
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    const handleSession = async () => {
      try {
        // Primero intentamos obtener la sesión actual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Si ya hay una sesión, redirigir al dashboard
          router.push('/');
          return;
        }
        
        // Si no hay sesión, intentar refrescar la sesión
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshData?.session) {
          // Si el refresh funcionó, redirigir
          setMessage('¡Sesión iniciada! Redirigiendo...');
          router.push('/');
        } else {
          // Si aún no hay sesión, mostrar mensaje y redirigir al login
          console.error('No se pudo iniciar sesión automáticamente:', refreshError);
          setMessage('Redirigiendo al inicio de sesión...');
          setTimeout(() => router.push('/login'), 2000);
        }
      } catch (error) {
        console.error('Error al verificar la sesión:', error);
        setMessage('Error al verificar la sesión. Redirigiendo...');
        setTimeout(() => router.push('/login'), 2000);
      } finally {
        setSessionLoaded(true);
      }
    };

    // Pequeño retraso para asegurar que las cookies se hayan establecido
    const timer = setTimeout(handleSession, 1000);
    return () => clearTimeout(timer);
  }, [router, supabase]);

  return (
    <section className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-96 mx-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-700">
          {sessionLoaded ? '¡Email verificado con éxito!' : 'Verificando tu email...'}
        </h1>
        
        <div className="flex flex-col items-center justify-center my-4">
          <BeatLoader color="#f472b6" size={16} className="mb-4" />
          <p className="text-sm text-gray-600">
            {message}
          </p>
        </div>
        
        {sessionLoaded && (
          <button
            onClick={() => router.push('/login')}
            className="mt-4 w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition-colors"
          >
            Ir al Inicio de Sesión
          </button>
        )}
      </div>
    </section>
  );
}
   