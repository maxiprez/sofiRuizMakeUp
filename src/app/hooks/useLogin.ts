"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { usePassword } from "@/app/hooks/usePassword";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showPassword } = usePassword();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);

    try {
        const result = await signIn("credentials", {
          redirect: false, // Evita la redirección automática
          email,
          password,
          callbackUrl: "/" // Ajusta tu callbackUrl
        });
        console.log("🚀 Resultado del login: ", result);
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
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return{
    handleSubmit,
    error,
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    isSubmitting,
  }
};