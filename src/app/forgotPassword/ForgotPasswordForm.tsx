'use client';

import Input from "@/app/components/Input";
import Button from "@/app/components/CustomBtn";
import { useForgotPassword } from "@/app/hooks/useForgotPassword";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const { email, setEmail, loading, message, isError, handleForgotPassword } = useForgotPassword();

  return (
    <section className="flex justify-center items-center min-h-screen bg-linear-to-br from-gray-100 to-gray-200 px-4">
      <div className='bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg'>
      {!isError && !message && (
        <>
          <h1 className="text-2xl font-bold mb-6 text-gray-700 text-center">¿Olvidaste tu contraseña?</h1>
          <p className="text-sm text-center text-gray-700 mb-2">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
        </>
        )}
        {message && (
          <>
            <p className={`text-sm mb-4 text-center ${isError ? 'text-red-500' : 'text-green-600'}`}>
              {message}
            </p>
            <Link href="/login" className="cursor-pointer block text-center text-white bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-lg">
              Volver
            </Link>
          </>
        )}
        {!isError && !message && (
          <form onSubmit={handleForgotPassword}>
            <Input labelText="E-mail" inputMode="email" name="email" htmlType="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} button={false} />
            <Button
              text={loading ? "Enviando..." : "Restablecer contraseña"}
              type="submit"
              className={`cursor-pointer w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''} bg-pink-500 text-white px-4 py-3 rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1`}
              id="loginButton"
              loading={loading}
              disabled={loading}
            />
          </form>
        )}
      </div>
    </section>
  );
}