"use client"

import { useState, useEffect } from "react";

export function useUpdatePhone() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    useEffect(() => {
      if (success || error) {
          const timer = setTimeout(() => {
              setSuccess(false);
              setError(null);
          }, 3000);
          return () => clearTimeout(timer);
      }
    }, [success, error]);
  
    const updateTel = async (id: string, tel: string) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const response = await fetch(`/api/updateUserPhone`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tel,
            userId: id,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error en la red: ${response.statusText}`);
       }
  
        const result = await response.json();
  
        if (result.success) {
          setSuccess(true);
        } else {
          setError("Error al actualizar el teléfono: " + result.error || "Error desconocido");
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