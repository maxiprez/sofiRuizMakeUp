"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BeatLoader from 'react-spinners/BeatLoader';

export default function EmailValidateOk() {
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient(); 
    
  useEffect(() => {
    const handleSession = async () => {
      // Supabase Auth Helpers automáticamente intentará leer los tokens del fragmento de URL
      // (#access_token=...) y establecer la sesión.
      const { data: { session }, error } = await supabase.auth.getSession();

      if (session) {
        // Puedes redirigir a una página de dashboard, perfil, etc.
        router.push('/'); // Ejemplo: Redirige al usuario logueado
      } else {
        console.error('ℹ️ No hay sesión activa después de la validación. Error: ', error);
        router.push('/login');
      }
      setSessionLoaded(true);
    };

    handleSession();
  }, [router, supabase]);

  if (!sessionLoaded) {
    return (
      <section className={`flex justify-center items-center h-screen bg-gray-100`}>
        <div className={`bg-white p-8 rounded-md shadow-md w-96 mx-4`}>
        <BeatLoader color="#f472b6" size={16} />
        </div>
      </section>
    );
  }
  return (
    <section className={`flex justify-center items-center h-screen bg-gray-100`}>
        <div className={`bg-white p-8 rounded-md shadow-md w-96 mx-4`}>
          <h1 className={`text-2xl font-bold mb-6 text-gray-700 text-center`}>¡Tu email ha sido verificado con éxito!</h1>
          <BeatLoader color="#f472b6" size={16} />
          <p className={`text-sm text-center text-gray-700 mb-2`}>Redireccionando...</p>
        </div>
    </section>
  );
}
   