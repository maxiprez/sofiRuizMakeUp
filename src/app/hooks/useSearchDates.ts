"use client";

import { useState, useEffect } from "react";
import { searchDates } from "../actions/searchDates";

interface Booking {
    created_at: string;
    date: string;
    google_event_id: string;
    id: string;
    service_id: string;
    status: boolean;
    time: string;
    users: {
        id: string;
        name: string;
        tel: string;
    };
    services: {
        id: string;
        name: string;
    };
}

export function useSearchDates() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const formatDate = (dateString: string) => {
        const [year, month, day] = dateString.split("-").map(Number)
        const localDate = new Date(year, month - 1, day)
        return localDate.toLocaleDateString("es-AR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
    }

    const fetchDates = async () => {
        setLoading(true);
        try {
            const result = await searchDates();
            if (result.error) {
                setError(result.error);
            } else {
                if (result.data) {
                    result.data.forEach((booking: Booking) => {
                        booking.date = formatDate(booking.date);
                    });
                    setBookings(result.data);
                }
            }
        } catch (error) {
            console.error("Error al buscar citas:", error);
            setError("Error al buscar citas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDates();
    },[]);
    return { bookings, loading, error, fetchDates };
}
