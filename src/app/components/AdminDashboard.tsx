"use client";

import HeaderAdmin from "./HeaderAdmin"
import { SidebarAdmin } from "./SidebarAdmin"
import {
    Calendar,
    Users,
    Scissors,
    DollarSign,
    TrendingUp,
    UserCheck,
    CalendarDays,
    Star,
} from "lucide-react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomersAdmin } from "./CustomersAdmin"

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <SidebarProvider>
        <SidebarAdmin />
        <SidebarInset>
          <HeaderAdmin />
          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Page Title */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Bienvenida de vuelta, Sofía Ruiz. Aquí tienes un resumen de tu negocio.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-purple-100 hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Citas Hoy</CardTitle>
                    <CalendarDays className="h-4 w-4 text-pink-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">8</div>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +2 desde ayer
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-100 hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Ingresos Mes</CardTitle>
                    <DollarSign className="h-4 w-4 text-pink-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">$300.000</div>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +12% vs mes anterior
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-100 hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Clientes Activos</CardTitle>
                    <UserCheck className="h-4 w-4 text-pink-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">156</div>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +8 este mes
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-100 hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Valoración Media</CardTitle>
                    <Star className="h-4 w-4 text-pink-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">4.9</div>
                    <p className="text-xs text-gray-500">Basado en 89 reseñas</p>
                  </CardContent>
                </Card>
              </div>

              <CustomersAdmin/>

              {/* Quick Actions */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-purple-100 hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pink-100 rounded-lg group-hover:bg-pink-200 transition-colors">
                        <Calendar className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Gestionar Citas</CardTitle>
                        <CardDescription>Ver y organizar el calendario</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <Card className="border-purple-100 hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Clientes</CardTitle>
                        <CardDescription>Administrar base de clientes</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <Card className="border-purple-100 hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pink-100 rounded-lg group-hover:bg-pink-200 transition-colors">
                        <Scissors className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Servicios</CardTitle>
                        <CardDescription>Configurar precios y duración</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
