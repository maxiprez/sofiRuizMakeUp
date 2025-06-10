"use client"

import { SidebarAdmin } from "./Sidebaradmin"
import {
    Calendar,
    Users,
    Settings,
    BarChart3,
    Scissors,
    Clock,
    DollarSign,
    TrendingUp,
    UserCheck,
    CalendarDays,
    Star,
    ChevronDown,
    Bell,
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"
import { CustomersAdmin } from "./CustomersAdmin"

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <SidebarProvider>
        <SidebarAdmin />
        <SidebarInset>
          {/* Header */}
          <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-purple-100">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger className="text-purple-700 hover:bg-purple-50" />
              <div className="flex-1">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Buscar clientes, citas..."
                    className="pl-10 border-purple-200 focus:border-pink-300 focus:ring-pink-200"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-purple-700 hover:bg-purple-50">
                  <Bell className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 text-purple-700 hover:bg-purple-50">
                      <Avatar className="h-8 w-8">
                        {/* <AvatarImage src="/" /> */}
                        <AvatarFallback className="bg-pink-100 text-pink-700">MP</AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline">maxi prez</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white">
                    <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-200"/>
                    <DropdownMenuItem className="cursor-pointer">Perfil</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">Configuración</DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-200"/>
                    <DropdownMenuItem className="text-red-500 hover:text-red-500 cursor-pointer" onClick={() => signOut({ callbackUrl: "/" })}>Cerrar Sesión</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

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

              {/* Recent Appointments */}
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
