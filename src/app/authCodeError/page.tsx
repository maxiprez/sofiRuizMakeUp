"use client";

import Link from "next/link";

export default function AuthCodeError() {
  return (
    <section className={`flex justify-center items-center h-screen bg-gray-100`}>
      <div className={`bg-white p-8 rounded-md shadow-md w-96 mx-4`}>
        <h1 className={`text-2xl font-bold mb-6 text-gray-700 text-center`}>Hubo un error al verificar el código de verificación</h1>
        <p className={`text-sm text-center text-gray-700 mb-2`}>Hubo un error al verificar el código de verificación. Por favor, inténtalo de nuevo.</p>
        <Link href="/login" className="cursor-pointer block text-center text-white bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded">
          Volver al login
        </Link>
      </div>
    </section>
  );
}