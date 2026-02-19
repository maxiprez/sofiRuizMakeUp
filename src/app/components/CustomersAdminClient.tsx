"use client";

import {Card,CardContent,CardDescription,CardHeader,CardTitle} from "@/app/components/ui/card"
import {Button} from "@/app/components/ui/button"
import { Plus } from "lucide-react"
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
import { formatDateTime } from "utils/utilsFormat";

export function CustomersAdminClient({ customers, bookings }: { customers: Customer[], bookings: Booking[] }) {
    const [openModal, setOpenModal] = useState(false);
    const { services } = useGetServices();
    const { handleCancelBooking } = useBookingUser();
    const [modalMode, setModalMode] = useState<'new' | 'edit'>('new');
    const [selectedClient, setSelectedClient] = useState<{ id: string; name: string } | null>(null);
    const [bookingEditing, setBookingEditing] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<{ id: string; name: string } | null>(null);
    const [bookingId, setBookingId] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBookings = bookings.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(bookings.length / itemsPerPage);

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
               <Button onClick={() => {
                    setModalMode('new');
                    setSelectedClient(null);
                    setBookingEditing(null);
                    setSelectedService(null);
                    setBookingId(null);
                    setOpenModal(true);
                }} size="sm" className="bg-pink-600 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Cita
                </Button>
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
                    {currentBookings.map((booking) => (
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
                            <TableCell>{formatDateTime(booking.date!,"10:00")}</TableCell>
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
                                            onClick={() => {
                                                setSelectedClient({ id: booking.users.id, name: booking.users.name });
                                                setModalMode('edit');
                                                setOpenModal(true);
                                                setBookingEditing(booking.date);
                                                setBookingId(booking.id);
                                                setSelectedService({id: booking.services.id, name: booking.services.name});
                                            }}
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
                <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="text-sm text-muted-foreground">
                        Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, bookings.length)} de {bookings.length} citas
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer bg-pink-600 text-white hover:bg-pink-400 disabled:bg-transparent disabled:text-gray-500"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </Button>
                        <div className="flex items-center justify-center text-sm font-medium">
                            Página {currentPage} de {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer bg-pink-600 text-white hover:bg-pink-400 disabled:bg-transparent disabled:text-gray-500"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                        >
                            Siguiente
                        </Button>
                    </div>
                </div>
            </CardContent>
            <ModalBookingsAdmin
                open={openModal}
                onOpenChange={setOpenModal}
                clients={modalMode === 'new' ? customers : undefined}
                client={modalMode === 'edit' ? (selectedClient as { id: string; name: string }) : undefined}
                services={validServices}
                modalMode={modalMode}
                bookingDate={bookingEditing || undefined}
                service={selectedService || undefined}
                bookingId={bookingId || undefined}
            />
        </Card> 
    )
}