"use client";

import { useState, useEffect } from "react";
import { getCustomers } from "../actions/abmCustomers";
import { Customer } from "../actions/abmCustomers";

export default function useGetCustomers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const result = await getCustomers();
            if (result.error) {
                setError(result.error);
            } else {
                if (result.data) {
                    setCustomers(result.data);
                }
            }
        } catch (error) {
            console.error("Error al buscar los clientes:", error);
            setError("Error al buscar los clientes.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCustomers();
    }, []);
    return { customers, loading, error, setCustomers };
}