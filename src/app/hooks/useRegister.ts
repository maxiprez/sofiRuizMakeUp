"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/app/actions/authDB";
import { signIn } from "next-auth/react";

export const useRegister = () =>{
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [tel, setTel] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);
    
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            setIsSubmitting(false);
            return;
        }
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const result = await createUser(formData);
        if (result?.error) {
            setError(result.error);
        } else if (result?.success) {
            //Intenta iniciar sesión automáticamente después del registro exitoso
            const signInResult = await signIn('credentials', {
                redirect: false,
                email: email,
                password: password,
            });
            if (!signInResult?.error) {
                router.push("/");
            }
            else{
                setError("Error de inicio de sesión.");
            }
        }
        setIsSubmitting(false);
    };
    return {
        handleSubmit,
        error,
        name,
        setName,
        email,
        setEmail,
        tel,
        setTel,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        isSubmitting
    };
}
