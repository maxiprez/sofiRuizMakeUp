"use client";

import { SidebarProvider } from "@/app/components/ui/sidebar";
import { SidebarAdmin } from "../../components/SidebarAdmin";
import { SidebarInset } from "@/app/components/ui/sidebar";
import HeaderAdmin from "../../components/HeaderAdmin";
import { Card, CardDescription, CardTitle } from "@/app/components/ui/card";
import { Calendar, Users, Scissors, Pencil, Pause, Play, Save, X, Clock, Sparkles } from "lucide-react";
import useGetServices, { usePauseService, useResumeService, useSavePriceService } from "../../hooks/useABMServices";
import { Button } from "@/app/components/ui/button";
import { QuickActionCard } from "../../components/QuickActionsCardsAdmin";
import NewServiceCard from "../../components/NewServiceCard";
import BeatLoader from "react-spinners/BeatLoader";
import { useState } from "react";

export default function CategoriesPage() {
  const { services, loading, setServices } = useGetServices();
  const { stopService } = usePauseService(setServices);
  const { resumeService } = useResumeService(setServices);
  const { savePriceService } = useSavePriceService(setServices);
  const [editingId, setEditingId] = useState<string>();
  const [editedPrices, setEditedPrices] = useState<{ [id: string]: number }>({});

  const editPrice = (id: string, currentPrice: number) => {
    setEditingId(id);
    setEditedPrices((prev: { [id: string]: number }) => ({ ...prev, [id]: currentPrice }));
  };

  
  const savePrice = (id: string) => {
    const priceStr = editedPrices[id];
    const price = Number(priceStr);
    if (!isNaN(price)) {
      savePriceService(id, price);
    }
    setEditingId(undefined);
  };

  console.log("services", services);

  const getServiceIcon = (serviceName?: string) => {
    if (serviceName?.toLowerCase().includes("makeup")) {
      return <Sparkles className="h-5 w-5 text-pink-600" />
    }
    if (serviceName?.toLowerCase().includes("ceja")) {
      return <Scissors className="h-5 w-5 text-purple-600" />
    }
    return <Calendar className="h-5 w-5 text-pink-600" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <SidebarProvider>
        <SidebarAdmin />
        <SidebarInset>
          <HeaderAdmin />
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto space-y-10">
              <div className="space-y-1">
                <h1 className="text-4xl font-bold text-gray-900">Servicios</h1>
                <p className="text-gray-600 text-lg">Administrá y gestioná tus servicios</p>
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <BeatLoader color="#f472b6" size={16} />
                </div>
              ) : (
                <>
                  <NewServiceCard />
                  <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {services.map((service) => (
                      <Card key={service.id} className="p-4 border-pink-200 hover:shadow-xl transition">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="md:p-3 p-2 bg-pink-100 rounded-xl">
                              {getServiceIcon(service.name)}
                            </div>
                            <div className="flex flex-col gap-2">
                              <CardTitle className="md:text-2xl text-sm">{service.name}</CardTitle>
                                <CardDescription className="text-lg text-gray-700">
                                    {editingId === service.id ? (
                                      <input
                                          type="number"
                                          value={editedPrices[service.id] ?? Number(service.price)}
                                          onChange={(e) =>
                                          setEditedPrices((prev: { [id: string]: number }) => ({
                                            ...prev,
                                            [service.id]: Number(e.target.value),
                                          }))
                                        }
                                        className="border rounded p-1 md:text-lg text-sm md:w-24 w-16"
                                      />
                                    ) : (
                                      <span className="md:text-lg text-sm">${service.price.toLocaleString()}</span>
                                    )}
                                </CardDescription>
                               
                                <CardDescription className="text-gray-700 flex items-center gap-2 text-sm">
                                  <Clock className="h-4 w-4 text-pink-600" />
                                  <span>{service.duration} minutos</span>
                                </CardDescription>
                              </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {editingId === service.id ? (
                                <>
                                  <Button
                                    onClick={() => savePrice(service.id)}
                                    variant="outline"
                                    size="sm"
                                    className="gap-1 text-pink-600 border-pink-300 hover:bg-pink-100 cursor-pointer"
                                  >
                                    <Save className="h-4 w-4" />
                                    <span className="md:block hidden">Guardar</span>
                                  </Button>
                                  <Button
                                    onClick={() => setEditingId(undefined)}
                                    variant="outline"
                                    size="sm"
                                    className="gap-1 cursor-pointer"
                                  >
                                    <X className="h-4 w-4"/>
                                    <span className="md:block hidden">Cancelar</span>
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  onClick={() => editPrice(service.id, service.price)}
                                  variant="outline"
                                  size="sm"
                                  className="gap-1 cursor-pointer"
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span className="md:block hidden">Editar</span>
                                </Button>
                              )}
                              <Button 
                                  onClick={() => stopService(service.id)}
                                  variant="outline" size="sm"
                                  disabled={service.status == false ? true : false}
                                  className="cursor-pointer gap-1 text-purple-600 border-purple-300 hover:bg-purple-100">
                                <Pause className="h-4 w-4" />
                                <span className="md:block hidden">Pausar</span>
                              </Button>
                              <Button
                                onClick={() => resumeService(service.id)}
                                variant="outline"
                                size="sm"
                                disabled={service.status == true ? true : false}
                                className="cursor-pointer gap-1 text-green-600 border-green-300 hover:bg-green-100"
                              >
                              <Play className="h-4 w-4" />
                              <span className="md:block hidden">Reanudar</span>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </section>
                </>
              )}
              <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <QuickActionCard
                  icon={<Calendar className="h-6 w-6 text-pink-600" />}
                  title="Gestionar Citas"
                  description="Ver y organizar el calendario"
                />
                <QuickActionCard
                  icon={<Users className="h-6 w-6 text-purple-600" />}
                  title="Clientes"
                  description="Administrar base de clientes"
                />
                <QuickActionCard
                  icon={<Scissors className="h-6 w-6 text-pink-600" />}
                  title="Servicios"
                  description="Configurar precios y duración"
                />
              </section>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
