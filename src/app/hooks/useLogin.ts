"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type LoginFormData = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    if (isSubmitting) return;
    
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl: "/"
      });
      
      if (result?.error) {
        if (result.error === "USER_NOT_VERIFIED") {
          setError("Tu usuario no está verificado. Por favor revisa tu email.");
        } else if (result.error === "CredentialsSignin") {
          setError("Correo o contraseña incorrectos.");
        } else {
          setError("Ocurrió un error inesperado. Intenta nuevamente.");
        }
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
      setError("Ocurrió un error inesperado. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    onSubmit,
    error,
    isSubmitting,
  };
};