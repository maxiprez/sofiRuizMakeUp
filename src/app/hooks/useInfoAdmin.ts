'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Equal } from "lucide-react"

export const useInfoAdmin = () => {
    const [bookings, setBookings] = useState({today: 0, yesterday: 0});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [difference, setDifference] = useState(0);
    const [icon, setIcon] = useState<React.ElementType | null>(null);
    const [iconColor, setIconColor] = useState('text-green-500');

    useEffect(() => {
        const fetchBookings = async () => {
          try {
            const response = await fetch('/api/bookingDay');
            const data = await response.json();
            setBookings(data);
            const todayBookings = Number(data.today) || 0;
            const yesterdayBookings = Number(data.yesterday) || 0;
            const diff = todayBookings - yesterdayBookings;
            setDifference(diff);
            if(diff > 0){
                setIcon(TrendingUp);
                setIconColor('text-green-500');
            }else if(diff < 0){
                setIcon(TrendingDown);
                setIconColor('text-red-500');
            }else{
                setIcon(Equal);
                setIconColor('text-yellow-500');
            }
          } catch (error) {
            setError(error as string);
          } finally {
            setLoading(false);
          }
        };
      
        fetchBookings();
      }, []);
    return { bookings, loading, error, difference, icon, iconColor };
};