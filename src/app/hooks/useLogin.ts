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
      // **Llama a signIn aquí, en el componente del cliente**
      const result = await signIn("credentials", {
        redirect: false, // Evita la redirección automática
        email,
        password,
        callbackUrl: "/" // Ajusta tu callbackUrl
      });

      console.log("result login: ", result);

      if (result?.error) {
        setError("Credenciales inválidas."); // Muestra el mensaje de error de next-auth
      } else {
        router.push("/"); // Redirige en el cliente
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
}