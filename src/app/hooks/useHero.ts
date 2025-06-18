"use client";

import { useState, useCallback } from 'react';
import useGetServices from './useABMServices';
import { Service } from '../actions/abmServices';

export default function useHero(onSearchCallback: (serviceId: string, date: string, duration: number) => void) {
  const { services } = useGetServices();
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(0);

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
  };
}