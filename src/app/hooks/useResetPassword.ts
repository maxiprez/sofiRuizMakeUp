"use client";

import { updatePassword } from '@/app/_actions/resetPassword.action';
import { useState, useEffect } from 'react';

export const useResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlToken = new URLSearchParams(window.location.search).get('token');
            setToken(urlToken);
        }
    }, []);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);
    
        if (!token) {
            setMessage('Token inválido o faltante.');
            setLoading(false);
            return;
        }
    
        if (newPassword !== confirmPassword) {
            setMessage('Las contraseñas no coinciden.');
            setLoading(false);
            return;
        }

        if (newPassword.length < 8) {
            setMessage('La contraseña debe tener al menos 8 caracteres.');
            setLoading(false);
            return;
        }
    
        const formData = new FormData();
        formData.set('password', newPassword);
        formData.set('confirmPassword', confirmPassword);
    
        const result = await updatePassword(token, formData);
    
        if (result?.error) {
            console.error('Error al restablecer la contraseña:', result.error);
            setMessage(`Error al restablecer la contraseña: ${result.error}`);
        } else {
            setMessage('¡Contraseña restablecida con éxito!');
        }
    
        setLoading(false);
    }

    return {
        newPassword,
        confirmPassword,
        loading,
        message,
        token,
        handleUpdatePassword,
        setNewPassword,
        setConfirmPassword,
        setLoading,
        setMessage,
        setToken,
    }
}
