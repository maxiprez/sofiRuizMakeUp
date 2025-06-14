"use client";

import { useState, useCallback } from 'react';
import useGetServices from './useABMServices';
import { Service } from '../actions/ambServices';

export default function useHero(onSearchCallback: (serviceId: string, date: string) => void) {
  const { services } = useGetServices();
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const handleServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value;
    const service = services.find((s: Service) => s.id === id);
    if (service) {
      setSelectedServiceId(service.id);
      setSelectedService(service.name);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    handleSearch(selectedService, date);
  };

  const handleSearchClick = () => {
    handleSearch(selectedService, selectedDate);
  };

  console.log("selectedServiceId: ", selectedServiceId);

  const handleSearchAndScroll = () => {
    if (onSearchCallback) {
      onSearchCallback(selectedServiceId, selectedDate);
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
    selectedServiceId,
    handleDateChange,
    handleSearchClick,
    handleSearchAndScroll,
  };
}