"use client";

import { useSearchDates } from "../hooks/useSearchDates"
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from "@/app/components/ui/card"
import {Button} from "@/app/components/ui/button"
import { Filter, Plus } from "lucide-react"
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/app/components/ui/table"
import {Avatar,AvatarFallback,} from "@/app/components/ui/avatar"
import {Badge} from "@/app/components/ui/badge"

export function CustomersAdmin() {
    const { bookings } = useSearchDates();
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
                <Button disabled={true} size="sm" className="bg-pink-600 hover:bg-pink-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
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
                    {/* <TableHead className="text-right">Acciones</TableHead> */}
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
    )
}