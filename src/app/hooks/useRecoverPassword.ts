"use client";

import { useState } from "react";

export const useRecoverPassword = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error);
        return { success: false };
      }

      return { success: true };
    } catch (err) {
      console.error("Error al enviar el email de recuperación:", err);
      setError("Error al enviar el email de recuperación.");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, error, loading };
};
