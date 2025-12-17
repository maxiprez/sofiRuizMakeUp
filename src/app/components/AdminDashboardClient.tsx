"use server";

import { auth } from "auth"; 
import HeaderAdmin from "@/app/components/HeaderAdmin";
import { SidebarAdmin } from "@/app/components/Sidebaradmin";
import {
  Calendar,
  Users,
  Scissors,
} from "lucide-react";
import { SidebarInset, SidebarProvider } from "@/app/components/ui/sidebar";
import CustomersAdmin from "@/app/components/CustomersAdmin";
import { QuickActionCard } from "@/app/components/QuickActionsCardsAdmin";
import CardsAdminWrapper from "@/app/components/CardsAdminWrapper";
import { RevenueData, DailyBookingData, CancelledBookingsData } from "types/entities";
import { getCustomers } from "@/app/_actions/abmCustomers.action";


export async function AdminDashboardClient({ revenue, dailyBookingComparison, cancelledBookings, searchParams }: { revenue: RevenueData, dailyBookingComparison: DailyBookingData, cancelledBookings: CancelledBookingsData, searchParams: { q?: string } }) {
  const session = await auth();
  const response = await getCustomers();
  const customers = response.data || [];

  return (
    <SidebarProvider>
      <SidebarAdmin />
      <SidebarInset>
        <HeaderAdmin />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
               Bienvenid@ de vuelta, <b>{session?.user?.name}</b> Aquí tienes un resumen de tu negocio.
              </p>
            </div>
            <CardsAdminWrapper revenue={revenue} dailyBookingComparison={dailyBookingComparison} cancelledBookings={cancelledBookings} customers={customers} />

            <CustomersAdmin customers={customers} searchParams={searchParams} />
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
  );
}
