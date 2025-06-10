"use client";
import { useState } from "react";
import { resetPassword } from "@/app/actions/resetPassword";

export const useForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setMessage('Por favor, ingresa un email válido.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.set('email', email);
        const result = await resetPassword(formData);
    
        if (result?.error) {
            setIsError(true);
            setMessage(`Error al solicitar restablecimiento: ${result.error}`);
        } else {
            setIsError(false);
            setMessage('Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña.');
        }
        setLoading(false);
      };
    return {
        email,
        setEmail,
        loading,
        message,
        isError,
        handleForgotPassword,
    }
}
