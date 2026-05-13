"use server";

import HeaderAdmin from "@/app/components/HeaderAdmin";
import { SidebarAdmin } from "@/app/components/Sidebaradmin";
import { SidebarInset, SidebarProvider } from "@/app/components/ui/sidebar";
import { getAvailability } from "@/app/_actions/abmAvailability.action";
import { SchedulesClient } from "@/app/admin/schedules/schedulesClient";

import { Clock3 } from "lucide-react";

export default async function SchedulesPage() {
  const availabilityResult = await getAvailability();
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50">
      <SidebarProvider>
        <SidebarAdmin />
        <SidebarInset>
          <HeaderAdmin />
          <main className="p-6">
            <div className="mx-auto max-w-7xl space-y-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100">
                    <Clock3 className="h-7 w-7 text-pink-600" />
                  </div>

                  <div>
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                      Horarios de Atención
                    </h1>

                    <p className="mt-1 text-gray-600">
                      Configura los días y horarios disponibles para reservas.
                    </p>
                  </div>
                </div>
              </div>
              <SchedulesClient initialData={availabilityResult.data || []} />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}