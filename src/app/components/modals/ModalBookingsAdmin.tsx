"use client";

import { useState, useEffect } from "react";
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
import { formatDateTime } from "utils/utilsFormat";
import { SaveModalButton } from "@/app/components/modals/SaveModalButton";

interface ModalBookingsAdminProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients?: { id: string; name: string }[];
  services: { id: string; name: string; duration: number | undefined }[];
  client?: { id: string; name: string };
  modalMode: 'new' | 'edit';
  bookingDate?: string;
  service?: { id: string; name: string };
  bookingId?: string;
}

export function ModalBookingsAdmin({ open, onOpenChange, clients, services, client, modalMode, bookingDate, service, bookingId }: ModalBookingsAdminProps) {
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
  const { handleAdminReserve, handleEditBooking, isSaving } = useServiceBookingAdmin();

  const handleServiceChange = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    setSelectedService(serviceId);
    setDuration(service?.duration || 0);
  };

  const handleTimeSelect = (time: string) => setSelectedTime(time);

  useEffect(() => {
      if (client) {
          setSelectedClient(client.id);
      } else {
          setSelectedClient(null);
      }
  }, [client]);

  useEffect(() => {
      if (service && modalMode === 'edit') {
          setSelectedService(service.id);
      } else if (modalMode === 'new') {
          setSelectedService(null);
      }
  }, [service, modalMode]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">{modalMode === 'new' ? 'Crear nueva' : 'Editar'} Cita</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {modalMode === 'new' && (
            <>
              <label className="text-sm text-gray-600">Cliente</label>
              <div className="bg-white rounded-md border border-gray-300">
                <Command className="max-h-45">
                  <CommandInput placeholder="Buscar cliente..." />
                  <CommandList>
                    <CommandEmpty>No se encontraron resultados</CommandEmpty>
                    {clients?.map(client => (
                      <CommandItem key={client.id} value={client.name} onSelect={() => setSelectedClient(client.id)}>
                        {client.name}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Seleccionado: {clients?.find(c => c.id === selectedClient)?.name}
              </p>
            </>
          )}

          {modalMode === 'edit' && client && (
            <>
              <p className="text-base text-gray-600">
                Editar cita de: <span className="font-semibold">{client.name}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Fecha: {formatDateTime(bookingDate!, '10:00')}
              </p>
            </>
          )}
         
          <>
            <label className="text-sm text-gray-600">Servicio</label>
            <Select 
              onValueChange={handleServiceChange}
              defaultValue={selectedService || undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar servicio" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {service && modalMode === 'edit' && (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                )}
                {modalMode === 'new' && (
                  services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </>

          <>
            <label className="text-sm text-gray-600">{modalMode === 'new' ? 'Fecha' : 'Nueva fecha'}</label>
            <Input type="date" onChange={(e) => setSelectedDate(e.target.value)} className="bg-white" />
          </>
          {selectedService && selectedDate && (
            <>
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
                      className={`text-sm py-2 cursor-pointer ${selectedTime === time ? "bg-pink-600 text-white" : ""}`}
                    >
                      {time}
                    </Button>
                  ))}
                  {availableTimes.length === 0 && (
                    <p className="text-sm text-red-500 col-span-4 font-semibold">
                      No hay horarios disponibles para esta fecha
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
              Cancelar
          </Button>
          <SaveModalButton
            selectedClient={selectedClient!}
            selectedService={selectedService!}
            selectedDate={selectedDate!}
            selectedTime={selectedTime!}
            modalMode={modalMode}
            bookingId={bookingId || null}
            isSaving={isSaving}
            handleAdminReserve={handleAdminReserve}
            handleEditBooking={handleEditBooking}
            onOpenChange={onOpenChange}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
