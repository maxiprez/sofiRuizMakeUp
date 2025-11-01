"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/app/components/ui/select";
import { Input } from "@/app/components/ui/input";
import useAvailability from "@/app/hooks/useAvailability";
import { useServiceBookingAdmin } from "@/app/hooks/useServiceBookingAdmin";
import BeatLoader from "react-spinners/BeatLoader";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/app/components/ui/command";

interface ModalBookingsAdminProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: { id: string; name: string }[];
  services: { id: string; name: string; duration: number | undefined }[];
}

export function ModalBookingsAdmin({ open, onOpenChange, clients, services }: ModalBookingsAdminProps) {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);

  const { availableTimes, loading } = useAvailability(
  services.find(s => s.id === selectedService)?.name || null,
  selectedDate,
  duration
);
  const { handleAdminReserve, isSaving } = useServiceBookingAdmin();

  const handleServiceChange = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    setSelectedService(serviceId);
    setDuration(service?.duration || 0);
  };

  const handleTimeSelect = (time: string) => setSelectedTime(time);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-amber-50">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">Agendar Nueva Cita</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Cliente */}
          <div>
            <label className="text-sm text-gray-600">Cliente</label>
            <div className="bg-amber-50 rounded-md border border-gray-300">
              <Command className="max-h-45">
                <CommandInput placeholder="Buscar cliente..." />
                <CommandList>
                  <CommandEmpty>No se encontraron resultados</CommandEmpty>
                  {clients.map(client => (
                    <CommandItem key={client.id} value={client.name} onSelect={() => setSelectedClient(client.id)}>
                      {client.name}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </div>
            {selectedClient && (
              <p className="text-xs text-gray-500 mt-1">
                Seleccionado: {clients.find(c => c.id === selectedClient)?.name}
              </p>
            )}
          </div>

          {/* Servicio */}
          <div>
            <label className="text-sm text-gray-600">Servicio</label>
            <Select onValueChange={handleServiceChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar servicio" />
              </SelectTrigger>
              <SelectContent className="bg-amber-50">
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fecha */}
          <div>
            <label className="text-sm text-gray-600">Fecha</label>
            <Input type="date" onChange={(e) => setSelectedDate(e.target.value)} className="bg-amber-50" />
          </div>

          {/* Horarios disponibles */}
          {selectedService && selectedDate && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Horarios disponibles</h3>
              {loading ? (
                <div className="flex justify-center py-4">
                  <BeatLoader color="#ec4899" size={14} />
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => handleTimeSelect(time)}
                      className={`text-sm py-2 ${selectedTime === time ? "bg-pink-600 text-white" : ""}`}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            className="bg-pink-600 text-white hover:bg-pink-700"
            onClick={() => {
              if (!selectedClient || !selectedService || !selectedDate || !selectedTime) return;
              handleAdminReserve(selectedService, selectedDate, selectedTime, { user: selectedClient });
              onOpenChange(false);
            }}
            disabled={isSaving || !selectedClient || !selectedService || !selectedDate || !selectedTime}
          >
            {isSaving ? "Guardando..." : "Guardar Cita"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
