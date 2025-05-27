"use client";

import Link from "next/link";

export default function EmailValidateOk() {
    return (
      <section className={`flex justify-center items-center md:h-screen h-[calc(100vh-5rem)] bg-gray-100`}>
        <div className={`bg-white p-8 rounded-md shadow-md w-96 mx-4`}>
          <h2 className={`text-xl font-bold mb-6 text-gray-700 text-center`}>Tu correo electrónico ha sido verificado correctamente.</h2>
          <p className={`text-sm text-center text-gray-700 mb-2`}>Ahora puedes iniciar sesión con tu cuenta.</p>
          <Link href="/login" className="cursor-pointer block text-center text-white bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded">
            Iniciar sesión
          </Link>
        </div>
      </section>
    );
}
