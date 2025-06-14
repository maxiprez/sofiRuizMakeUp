"use client";

import { useState, useEffect } from "react";
import { getServices, createService, pauseService, resumeService, Service, editPriceService } from "../actions/ambServices";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default function useGetServices() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const fetchServices = async () => {
        setLoading(true);
        try {
            const result = await getServices();
            if (result.error) {
                setError(result.error);
            } else {
                if (result.data) {
                    setServices(result.data);
                }
            }
        } catch (error) {
            console.error("Error al buscar servicios:", error);
            setError("Error al buscar servicios.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchServices();
    }, []);
    return { services, loading, error, setServices };
}

export function useCreateService({ refreshServices }: { refreshServices: () => void }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreateService = async (service: Omit<Service, "id">) => {
        setLoading(true);
        try {
            const result = await createService(service);
            if (result.error) {
                setError(result.error);
            } else {
                Swal.fire({
                    icon: 'success',
                    title: '¡Servicio creado exitosamente!',
                    text: 'Servicio creado.',
                    timer: 2000,
                    showConfirmButton: false,
                });
                refreshServices();
            }
        } catch (error) {
            console.error("Error al crear servicio:", error);
            setError("Error al crear servicio.");
            Swal.fire({
                icon: 'error',
                title: '¡Error al crear servicio!',
                text: 'Error al crear servicio.',
                timer: 2000,
                showConfirmButton: false,
            });
        } finally {
            setLoading(false);
        }
    };
    return { createService: handleCreateService, loading, error };
}

export function usePauseService(setServices: React.Dispatch<React.SetStateAction<Service[]>>) {
    const [error, setError] = useState<string | null>(null);
    const handleStopService = async (id: string) => {
        try {
            const result = await pauseService(id);
            if (result.error) {
                setError(result.error);
            } else {
                Swal.fire({
                    icon: 'success',
                    title: '¡Servicio pausado exitosamente!',
                    text: 'Servicio pausado.',
                    timer: 2000,
                    showConfirmButton: false,
                });
                setServices((prevServices) =>
                    prevServices.map((service) =>
                        service.id === id ? { ...service, status: false } : service
                    )
                );
            }
        } catch (error) {
            console.error("Error al pausar servicio:", error);
            setError("Error al pausar servicio.");
            Swal.fire({
                icon: 'error',
                title: '¡Error al pausar servicio!',
                text: 'Error al pausar servicio.',
                timer: 2000,
                showConfirmButton: false,
            });
        }
    }
    return { stopService: handleStopService, error }
}

export function useResumeService(setServices: React.Dispatch<React.SetStateAction<Service[]>>) {
    const [error, setError] = useState<string | null>(null);
    const handleResumeService = async (id: string) => {
        try {
            const result = await resumeService(id);
            if (result.error) {
                setError(result.error);
            } else {
                Swal.fire({
                    icon: 'success',
                    title: '¡Servicio reanudado exitosamente!',
                    text: 'Servicio reanudado.',
                    timer: 2000,
                    showConfirmButton: false,
                });
                setServices((prevServices) =>
                    prevServices.map((service) =>
                        service.id === id ? { ...service, status: true } : service
                    )
                );
            }
        } catch (error) {
            console.error("Error al reanudar servicio:", error);
            setError("Error al reanudar servicio.");
            Swal.fire({
                icon: 'error',
                title: '¡Error al reanudar servicio!',
                text: 'Error al reanudar servicio.',
                timer: 2000,
                showConfirmButton: false,
            });
        }
    }
    return { resumeService: handleResumeService, error }
}

export function useSavePriceService(setServices: React.Dispatch<React.SetStateAction<Service[]>>) {
    const [error, setError] = useState<string | null>(null);
  
    const handleEditPriceService = async (id: string, price: number) => {
      try {
        const result = await editPriceService(id, price);
        if (result.error) {
          setError(result.error);
        } else {
          setServices((prevServices: Service[]) =>
            prevServices.map((service) =>
              service.id === id ? { ...service, price } : service
            )
          );
          Swal.fire({
            icon: "success",
            title: "¡Precio editado exitosamente!",
            text: "Precio editado.",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error("Error al editar precio:", error);
        setError("Error al editar precio.");
        Swal.fire({
          icon: "error",
          title: "¡Error al editar precio!",
          text: "Error al editar precio.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    };
  
    return { savePriceService: handleEditPriceService, error };
  }