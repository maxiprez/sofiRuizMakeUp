"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/app/actions/authDB";

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

        console.log("Valores al enviar:", { name, email, password, confirmPassword });
    
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
        router.push("/");
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

