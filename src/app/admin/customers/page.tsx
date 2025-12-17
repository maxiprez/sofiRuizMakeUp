"use server";

import { SidebarProvider } from "@/app/components/ui/sidebar";
import { SidebarAdmin } from "@/app/components/Sidebaradmin";
import { SidebarInset } from "@/app/components/ui/sidebar";
import HeaderAdmin from "@/app/components/HeaderAdmin";
import { Calendar, Users, Scissors } from "lucide-react";
import { QuickActionCard } from "@/app/components/QuickActionsCardsAdmin";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { getCustomers } from "@/app/_actions/abmCustomers.action";

type Customer = {
    id: string;
    name: string;
    tel: string;
    email?: string;
    is_verified?: boolean;
    role?: string;
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
    const q = searchParams.q;
    const response = await getCustomers(q);
    const customers = response.data || [];
   
    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50">
            <SidebarProvider>
                <SidebarAdmin />
                    <SidebarInset>
                        <HeaderAdmin />
                        <main className="flex-1 p-8">
                            <div className="max-w-7xl mx-auto space-y-10">
                                <div className="space-y-1">
                                    <h1 className="text-4xl font-bold text-gray-900">Clientes</h1>
                                    <p className="text-gray-600 text-lg">Administrá y gestioná tus clientes</p>
                                </div>
                                <Card className="border-purple-100">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-gray-900">Clientes</CardTitle>
                                                <CardDescription>Gestiona los clientes de tu negocio</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                            <TableRow>
                                                <TableHead>Cliente</TableHead>
                                                <TableHead>Teléfono</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Estado</TableHead>
                                                <TableHead>Rol</TableHead>
                                                {/* <TableHead className="text-right">Acciones</TableHead> */}
                                            </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {customers.map((customer: Customer) => (
                                                    <TableRow key={customer.id}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-3">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarFallback className="bg-purple-100 text-purple-700">
                                                                {customer.name.charAt(0).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            {customer.name}
                                                            </div>
                                                        </TableCell>    
                                                        <TableCell>{customer.tel}</TableCell>
                                                        <TableCell>{customer.email}</TableCell>
                                                        <TableCell>
                                                            <Badge
                                                            variant={
                                                                customer.is_verified === true
                                                                ? "default"
                                                                : customer.is_verified === false
                                                                    ? "secondary"
                                                                    : "destructive"
                                                            }
                                                            className={
                                                                customer.is_verified === true
                                                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                                                : customer.is_verified === false
                                                                ? "bg-red-100 text-red-800 hover:bg-red-100"
                                                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                                            }
                                                            >
                                                            {customer.is_verified ? "Activo" : "Inactivo"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>{customer.role}</TableCell>
                                                        <TableCell className="text-right">
                                                        {/* <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                                <DropdownMenuItem>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Ver detalles
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Editar
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-red-600">
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Cancelar
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent> 
                                                        </DropdownMenu> */}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card> 
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