"use client";

import { useState, useCallback, useEffect } from 'react';
import useGetServices from '@/app/hooks/useABMServices';
import { Service } from '@/app/_actions/abmServices.action';

interface DayStatus {
  date: string;
  status: 'available' | 'busy' | 'disabled';
}

export default function useHero(onSearchCallback: (serviceId: string, date: string, duration: number) => void) {
  const { services } = useGetServices();
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(0);
  const [dayStatuses, setDayStatuses] = useState<DayStatus[]>([]);

  useEffect(() => {
    const fetchCalendarStatus = async () => {
      try {
        const today = new Date();
        const endDate = new Date();
        endDate.setMonth(today.getMonth() + 2);
        
        console.log('Requesting calendar status from', today.toISOString(), 'to', endDate.toISOString());
        
        const response = await fetch(
          `/api/calendarStatus?startDate=${today.toISOString()}&endDate=${endDate.toISOString()}`
        );
        const data = await response.json();
        console.log('Received dayStatuses count:', data.dayStatuses?.length);
        console.log('Date range in response:', data.dayStatuses?.[0]?.date, 'to', data.dayStatuses?.[data.dayStatuses?.length - 1]?.date);
        console.log('Sample dayStatuses:', data.dayStatuses?.slice(0, 5));
        setDayStatuses(data.dayStatuses || []);
      } catch (error) {
        console.error('Error al obtener estado del calendario:', error);
      }
    };

    fetchCalendarStatus();
  }, []);

  const handleServiceChange = (id: string) => {
    const service = services.find((s: Service) => s.id === id);
    const duration = service?.duration;
    if (service) {
      setSelectedServiceId(service.id);
      setSelectedService(service.name);
      setSelectedDuration(duration || 0);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    handleSearch(selectedService, date, selectedDuration);
  };

  const handleSearchClick = () => {
    handleSearch(selectedService, selectedDate, selectedDuration);
  };

  const handleSearchAndScroll = () => {
    if (onSearchCallback) {
      onSearchCallback(selectedServiceId, selectedDate, selectedDuration);
      setTimeout(() => {
        const availabilityDiv = document.querySelector('.availabilityHours');
        if (availabilityDiv) {
          availabilityDiv.scrollIntoView({ behavior: 'smooth', block: 'start'});
        }
      }, 1500);
    }
  };

  const handleSearch = useCallback((service: string, date: string, duration: number) => {
    setSelectedService(service);
    setSelectedDate(date);
    setSelectedDuration(duration);
  }, []);

  return {
    selectedService,
    selectedDate,
    handleServiceChange,
    selectedServiceId,
    selectedDuration,
    handleDateChange,
    handleSearchClick,
    handleSearchAndScroll,
    dayStatuses,
  };
}