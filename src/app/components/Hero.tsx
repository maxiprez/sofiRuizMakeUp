"use client"

import React, { useState } from 'react';
import useHero from '@/app/hooks/useHero';
import { Button } from '@/app/components/ui/button';
import useGetServices from '@/app/hooks/useABMServices';
import { Service } from '@/app/_actions/abmServices.action';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { Calendar } from "@/app/components/ui/calendar";
import { format, parseISO, startOfToday } from "date-fns";
import { es } from 'date-fns/locale';
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormatNumber } from "@/utils/utilsFormat";

interface HeroProps {
  onSearch: (serviceId: string, date: string, duration: number) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const { selectedServiceId, handleServiceChange, selectedDate, handleDateChange, handleSearchAndScroll } = useHero(onSearch);
  const { services } = useGetServices();
  const dateObj = selectedDate ? parseISO(selectedDate) : undefined;
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
    handleDateChange(formattedDate);
    setIsCalendarOpen(false);
  };
  const disabledDayStyle = {
    textDecoration: 'line-through',
    color: '#a0aec0',
    opacity: 0.7 
  };
  const today = startOfToday()

  return (
    <section className="md:py-20 py-10 px-4">
      <div className="container mx-auto text-center">
        <h1 className="lg:text-4xl text-2xl font-bold text-gray-800 mb-6">
          Reserva tus turnos de <span className="text-pink-600">Make Up</span> y <span className="text-pink-600">Perfilado de Cejas</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">Encuentra la disponibilidad perfecta para tu próximo servicio de belleza.</p>
        <div className="bg-white md:p-8 p-6 rounded-lg shadow-xl flex flex-col lg:flex-row lg:gap-4 gap-4 justify-center items-center">
          <Select value={selectedServiceId} onValueChange={handleServiceChange} name="service">
            <SelectTrigger className="w-full sm:w-[240px] min-h-12 border-gray-300 focus:ring-pink-500 focus:border-pink-500">
              <SelectValue placeholder="Todos los servicios" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              {services.map((service: Service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name} ${FormatNumber.number(service.price)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full sm:w-55 justify-start text-left font-normal min-h-12",
                  !dateObj && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateObj ? format(dateObj, "PPP", { locale: es }) : <span>Seleccioná una fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border-gray-200">
              <Calendar
                mode="single"
                selected={dateObj}
                onSelect={handleDateSelect}
                locale={es}
                disabled={{ before: today }}
                modifiersStyles={{ disabled: disabledDayStyle }}
              />
            </PopoverContent>
          </Popover>
          <Button
            onClick={handleSearchAndScroll}
            className="bg-pink-500 hover:bg-pink-600 md:text-base text-sm text-white font-bold min-h-12 py-4 px-6 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto cursor-pointer"
            id="searchButton"
            disabled={!selectedServiceId || !selectedDate}
          >
            Ver Disponibilidad
          </Button>
        </div>
      </div>
    </section>
  );
}