'use client';

import { useState } from 'react';
import { resetPassword } from '@/app/actions/resetPassword';
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
  
    const formData = new FormData();
    formData.set('email', email);
    const result = await resetPassword(formData);
  
    if (result?.error) {
      console.error('Error al solicitar restablecimiento:', result.error);
      setMessage(`Error al solicitar restablecimiento: ${result.error}`);
    } else {
      setMessage('Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña.');
      setEmail('');
    }
    setLoading(false);
  };

  return (
    <section className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className={`bg-white p-8 rounded-md shadow-md w-96 mx-4`}>
        <h1 className="text-2xl font-bold mb-6 text-gray-700 text-center">¿Olvidaste tu contraseña?</h1>
        <p className="text-sm text-center text-gray-700 mb-2">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
        {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
        <form onSubmit={handleForgotPassword}>
          <Input labelText="E-mail" inputMode="email" name="email" htmlType="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} button={false} />
          <Button
            text="Restablecer contraseña"
            type="submit"
            className={`cursor-pointer w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''} bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1`}
            id="loginButton"
            loading={loading}
            disabled={loading}
          />
        </form>
      </div>
    </section>
  );
}