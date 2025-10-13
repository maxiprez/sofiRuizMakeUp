"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/app/_actions/authDB.action";
import { ValidateEmail } from "@/utils/utilsFormat";

export const useRegister = () => {
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

    if (!ValidateEmail.validate(email)) {
      setError("El correo electrónico no es válido.");
      setIsSubmitting(false);
      return;
    }
  
    const telRegex = /^[0-9]{7,15}$/;
    if (!telRegex.test(tel)) {
      setError("El número de teléfono no es válido.");
      setIsSubmitting(false);
      return;
    }
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("tel", tel);
    formData.append("password", password);
  
    const result = await createUser(formData);
  
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      router.push("/validateEmailPage");
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
    isSubmitting,
  };
};
