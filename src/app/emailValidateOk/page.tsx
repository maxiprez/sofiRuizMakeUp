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
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        router.push('/');
      } else {
        router.push('/login');
      }
      setSessionLoaded(true);
    };

    handleSession();
  }, [router, supabase]);

  if (!sessionLoaded) {
    return (
      <section className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-md shadow-md w-96 mx-4">
        <BeatLoader color="#f472b6" size={16} />
        </div>
      </section>
    );
  }
  return (
    <section className="flex justify-center items-center h-screen bg-gray-100">
        <div className="flex flex-col items-center justify-center bg-white p-8 rounded-md shadow-md w-96 mx-4">
          <h1 className="text-2xl font-bold mb-4 text-gray-700 text-center">¡Tu email ha sido verificado con éxito!</h1>
          <BeatLoader color="#f472b6" size={16} />
          <p className="text-sm text-center text-gray-700 mt-2">Redireccionando...</p>
        </div>
    </section>
  );
}
   