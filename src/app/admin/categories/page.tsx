"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarAdmin } from "../../components/SidebarAdmin";
import { SidebarInset } from "@/components/ui/sidebar";
import HeaderAdmin from "../../components/HeaderAdmin";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Scissors, Pencil, Pause, Play } from "lucide-react";
import useGetServices, { usePauseService, useResumeService } from "../../hooks/useABMServices";
import { Button } from "@/components/ui/button";
import { QuickActionCard } from "../../components/QuickActionsCardsAdmin";
import NewServiceCard from "../../components/NewServiceCard";
import BeatLoader from "react-spinners/BeatLoader";

export default function CategoriesPage() {
  const { services, loading } = useGetServices();
  const { stopService } = usePauseService();
  const { resumeService } = useResumeService();

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
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  <NewServiceCard />
                  {services.map((service) => (
                  <Card key={service.id} className="p-4 border-pink-200 hover:shadow-xl transition">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-pink-100 rounded-xl">
                          <Scissors className="h-6 w-6 text-pink-600" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">{service.name}</CardTitle>
                          <CardDescription className="text-lg text-gray-700">
                            ${service.price.toLocaleString()}
                          </CardDescription>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        
                        <Button variant="outline" size="sm" className="cursor-pointer gap-1">
                            <Pencil className="h-4 w-4" />
                            Editar
                        </Button>
                        
                        <Button 
                            onClick={() => stopService(service.id)}
                            variant="outline" size="sm"
                            disabled={service.status == false ? true : false}
                            className="cursor-pointer gap-1 text-purple-600 border-purple-300 hover:bg-purple-100">
                          <Pause className="h-4 w-4" />
                          Pausar
                        </Button>
                        <Button
                          onClick={() => resumeService(service.id)}
                          variant="outline"
                          size="sm"
                          disabled={service.status == true ? true : false}
                          className="cursor-pointer gap-1 text-green-600 border-green-300 hover:bg-green-100"
                        >
                          <Play className="h-4 w-4" />
                          Reanudar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                </section>
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
