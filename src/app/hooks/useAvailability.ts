"use client";

import { useState, useEffect } from "react";

export default function useAvailability(service: string | null, date: string | null) {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null); // Resetear el error en cada nueva petición
    let url = `/api/availability?date=${date}`;
    if (service && service !== 'Todos los servicios') {
      url += `&service=${service}`;
    }

    fetch(url)
      .then(response => {
        console.log("Respuesta del fetch:", response); // Log de la respuesta completa
        if (!response.ok) {
          console.error("Error en la respuesta:", response.status); // Log del status del error
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setAvailableTimes(data.availableTimes);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error en el catch:", error); // Log del error capturado
        setError(error.message);
        setLoading(false);
      });
  }, [service, date]);

  return {
    availableTimes,
    loading,
    error,
  };
}