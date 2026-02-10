"use client";

import {Card,CardContent,CardDescription,CardHeader,CardTitle} from "@/app/components/ui/card"
import {Button} from "@/app/components/ui/button"
import { Filter, Plus } from "lucide-react"
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/app/components/ui/table"
import {Avatar,AvatarFallback,} from "@/app/components/ui/avatar"
import {Badge} from "@/app/components/ui/badge"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { ModalBookingsAdmin } from "@/app/components/modals/ModalBookingsAdmin";
import { useState } from "react";
import useGetServices from "@/app/hooks/useABMServices";
import useBookingUser from "@/app/hooks/useBookingUser";
import { Customer } from "@/app/_actions/abmCustomers.action"
import { Booking } from "types/entities";

export function CustomersAdminClient({ customers, bookings }: { customers: Customer[], bookings: Booking[] }) {
    const [openModal, setOpenModal] = useState(false);
    const { services } = useGetServices();
    const { handleCancelBooking } = useBookingUser();

    const validServices = Array.isArray(services) ? services.filter(service => 
        Boolean(service.status) &&
        service.id &&
        service.name &&
        typeof service.duration === 'number'
      )
      .map(({ id, name, duration }) => ({ id, name, duration }))
  : [];

    return (
        <Card className="border-purple-100">
            <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                <CardTitle className="text-gray-900">Citas Recientes</CardTitle>
                <CardDescription>Gestiona las próximas citas de tus clientes</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                </Button>
               <Button onClick={() => setOpenModal(true)} size="sm" className="bg-pink-600 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Cita
                    </Button>

                    <ModalBookingsAdmin
                    open={openModal}
                    onOpenChange={setOpenModal}
                    clients={customers}
                    services={validServices}
                    />
                </div>
            </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Servicio</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-purple-100 text-purple-700">
                                    {booking.users.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                {booking.users.name}
                                </div>
                            </TableCell>    
                            <TableCell>{booking.users.tel}</TableCell>
                            <TableCell>{booking.services.name}</TableCell>
                            <TableCell>{booking.date}</TableCell>
                            <TableCell>{booking.time.slice(0, 5)}hs.</TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        booking.status === true
                                        ? "default"
                                        : booking.status === false
                                            ? "secondary"
                                            : "destructive"
                                    }
                                    className={
                                        booking.status === true
                                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                                        : booking.status === false
                                        ? "bg-red-100 text-red-800 hover:bg-red-100"
                                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                    }
                                >
                                {booking.status ? "Confirmada" : "Cancelada"}
                                </Badge>
                            </TableCell>
                        {
                                booking.status === true && (
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button
                                            id={`booking-menu-${booking.id}`}
                                            variant="ghost"
                                            size="icon"
                                            className="hover:bg-purple-50 focus-visible:ring-1 focus-visible:ring-purple-200 flex items-center justify-center" 
                                        >
                                            <MoreHorizontal className="h-4 w-4 text-gray-500 align-middle" />
                                        </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent
                                        align="start"
                                        sideOffset={6}
                                        className="w-44 bg-white shadow-md border border-gray-100 rounded-lg p-1 z-50"
                                        >
                                        <DropdownMenuItem
                                            className="flex items-center px-2 py-2 rounded-md cursor-pointer text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                                        >
                                            <Eye className="h-4 w-4 mr-2 text-gray-500" />
                                            Ver detalles
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            className="flex items-center px-2 py-2 rounded-md cursor-pointer text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                                        >
                                            <Edit className="h-4 w-4 mr-2 text-gray-500" />
                                            Editar
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator className="my-1 bg-gray-100 h-px" />

                                        <DropdownMenuItem
                                            onClick={() => handleCancelBooking(booking.id, {
                                                id: booking.id,
                                                service: booking.services.name,
                                                date: booking.date,
                                                time: booking.time,
                                                services: booking.services,
                                                users: booking.users,
                                            })}
                                            className="flex items-center px-2 py-2 rounded-md cursor-pointer text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                                            Cancelar
                                        </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card> 
    )
}