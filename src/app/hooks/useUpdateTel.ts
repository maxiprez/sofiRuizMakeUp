"use client"

import { useState } from "react";

export function useUpdateTel() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
  
    const updateTel = async (id: string, tel: string) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const response = await fetch(`/api/updateUserTel`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tel,
            userId: id,
          }),
        });
  
        const result = await response.json();
  
        if (result.success) {
          setSuccess(true);
        } else {
          setError("Error al actualizar el teléfono: " + result.error);
        }
      } catch (error) {
        console.error("Error al hacer la solicitud:", error);
        setError("Error al hacer la solicitud: " + error);
      } finally {
        setLoading(false);
      }
    };
  
    return { updateTel, loading, error, success };
  }