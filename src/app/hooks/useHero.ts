"use client";

import { useState, useCallback } from 'react';

export default function useHero(onSearchCallback: (service: string, date: string) => void) {
  const [selectedService, setSelectedService] = useState('Todos los servicios');
  const [selectedDate, setSelectedDate] = useState('');
 
  const handleServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedService(event.target.value);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    handleSearch(selectedService, date);
  };

  const handleSearchClick = () => {
    handleSearch(selectedService, selectedDate);
  };

  const handleSearchAndScroll = () => {
    if (onSearchCallback) {
      onSearchCallback(selectedService, selectedDate);
      setTimeout(() => {
        const availabilityDiv = document.querySelector('.availabilityHours');
        if (availabilityDiv) {
          availabilityDiv.scrollIntoView({ behavior: 'smooth', block: 'start'});
        }
      }, 1500);
    }
  };

  const handleSearch = useCallback((service: string, date: string) => {
    setSelectedService(service);
    setSelectedDate(date);
  }, []);

  return {
    selectedService,
    selectedDate,
    handleServiceChange,
    handleDateChange,
    handleSearchClick,
    handleSearchAndScroll,
  };
}