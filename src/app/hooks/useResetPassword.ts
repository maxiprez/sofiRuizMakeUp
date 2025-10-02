"use client";

import { updatePassword } from '@/app/_actions/resetPassword.action';
import { useState, useEffect } from 'react';

export const useResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [messageError, setMessageError] = useState<string | null>(null);
    const [messageSuccess, setMessageSuccess] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlToken = new URLSearchParams(window.location.search).get('token');
            setToken(urlToken);
        }
    }, []);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessageError(null);
        setMessageSuccess(null);
        setLoading(true);
    
        if (!token) {
            setMessageError('Token inválido o faltante.');
            setLoading(false);
            return;
        }
    
        if (newPassword !== confirmPassword) {
            setMessageError('Las contraseñas no coinciden.');
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setMessageError('La contraseña debe tener al menos 6 caracteres.');
            setLoading(false);
            return;
        }
    
        const formData = new FormData();
        formData.set('password', newPassword);
        formData.set('confirmPassword', confirmPassword);
    
        const result = await updatePassword(token, formData);
    
        if (result?.error) {
            console.error('Error al restablecer la contraseña:', result.error);
            setMessageError(`Error al restablecer la contraseña: ${result.error}`);
        } else {
            setMessageSuccess('¡Contraseña restablecida con éxito!');
        }
    
        setLoading(false);
    }

    return {
        newPassword,
        confirmPassword,
        loading,
        messageError,
        messageSuccess,
        token,
        handleUpdatePassword,
        setNewPassword,
        setConfirmPassword,
        setLoading,
        setToken,
    }
}
