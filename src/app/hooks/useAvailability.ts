"use client";

import { useState, useEffect } from "react";

export default function useAvailability(service: string | null, date: string, duration: number) {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!date || duration <= 0) {
      setAvailableTimes([]);
      return;
    }
    setLoading(true);
    setError(null);
    let url = `/api/availability?date=${date}`;
    if (service && service !== 'Todos los servicios') {
      url += `&service=${service}&duration=${duration}`;
    }

    fetch(url)
      .then(response => {
        if (!response.ok) {
          console.error("Error en la respuesta:", response.status);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setAvailableTimes(data.availableTimes);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error en el catch:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [service, date, duration]);

  return {
    availableTimes,
    loading,
    error,
  };
}