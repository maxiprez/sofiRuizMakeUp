import HeaderAdmin from "./HeaderAdmin"
import { SidebarAdmin } from "@/app/components/Sidebaradmin"
import { Calendar, Users, Scissors } from "lucide-react"
import { SidebarInset, SidebarProvider } from "@/app/components/ui/sidebar"
import CardsAdminWrapper from "@/app/components/CardsAdminWrapper"
import { CustomersAdmin } from "@/app/components/CustomersAdmin"
import { QuickActionCard } from "@/app/components/QuickActionsCardsAdmin"

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50">
      <SidebarProvider>
        <SidebarAdmin />
        <SidebarInset>
          <HeaderAdmin />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Bienvenida de vuelta, Sofía Ruiz. Aquí tienes un resumen de tu negocio.</p>
              </div>

             <CardsAdminWrapper/>
              <CustomersAdmin/>
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
