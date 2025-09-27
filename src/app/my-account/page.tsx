'use client';

import useBookingUser from "../hooks/useBookingUser";
import BeatLoader from 'react-spinners/BeatLoader';
import Link from "next/link";
import { Calendar, Clock, Scissors, AlertCircle, CalendarX, Sparkles, ArrowRight, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Alert, AlertDescription } from "@/app/components/ui/alert"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"

export default function MyAccount() {
  const { bookings, loading, error, handleCancelBooking, cancelErrorId, isAuthenticated, isUpcoming, filteredBookings, showHistory, setShowHistory } = useBookingUser()
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 border-purple-100">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="p-4 bg-pink-100 rounded-full">
              <BeatLoader color="#ec4899" size={16} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Verificando acceso</h3>
              <p className="text-gray-600">Redirigiendo a la página de inicio de sesión...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 border-purple-100">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="p-4 bg-pink-100 rounded-full">
              <BeatLoader color="#ec4899" size={16} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Cargando tus citas</h3>
              <p className="text-gray-600">Obteniendo tu información...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number)
    const localDate = new Date(year, month - 1, day)
    return localDate.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getServiceIcon = (serviceName?: string) => {
    if (serviceName?.toLowerCase().includes("makeup")) {
      return <Sparkles className="h-5 w-5 text-pink-600" />
    }
    if (serviceName?.toLowerCase().includes("ceja")) {
      return <Scissors className="h-5 w-5 text-purple-600" />
    }
    return <Calendar className="h-5 w-5 text-pink-600" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white text-xl font-bold">
                M
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Mi Cuenta</h1>
              <p className="text-gray-600 mt-1">Gestiona tus citas de belleza</p>
            </div>
          </div>
        </div>
        {bookings.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total de Citas</CardTitle>
                <Calendar className="h-4 w-4 text-pink-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
                <p className="text-xs text-gray-500">Citas reservadas</p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Próximas Citas</CardTitle>
                <Clock className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {bookings.filter((booking) => isUpcoming(booking.date)).length}
                </div>
                <p className="text-xs text-gray-500">Por confirmar</p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Servicios Favoritos</CardTitle>
                <Sparkles className="h-4 w-4 text-pink-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{new Set(bookings.map((b) => b.services?.name)).size}</div>
                <p className="text-xs text-gray-500">Tipos diferentes</p>
              </CardContent>
            </Card>
          </div>
        )}
        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-pink-600" />
              Tus Citas
            </CardTitle>
            <CardDescription>Gestiona y revisa tus próximas citas de belleza</CardDescription>
            <div className="flex justify-center gap-4 mt-8">
              <Button 
                variant={!showHistory ? "default" : "outline"}
                className={!showHistory 
                  ? "bg-pink-600 hover:bg-pink-700 text-white shadow-md transition-all cursor-pointer"
                  : "text-pink-600 border-pink-300 hover:bg-pink-100 hover:text-pink-700 transition-all cursor-pointer"
                }
                onClick={() => setShowHistory(false)}
              >
                Próximas citas
              </Button>
              <Button
                variant={showHistory ? "default" : "outline"}
                className={showHistory
                  ? "bg-pink-600 hover:bg-pink-700 text-white shadow-md transition-all cursor-pointer"
                  : "text-pink-600 border-pink-300 hover:bg-pink-100 hover:text-pink-700 transition-all cursor-pointer"
                }
                onClick={() => setShowHistory(true)}
              >
                Historial
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12 space-y-6">
                <div className="flex justify-center">
                  <div className="p-6 bg-pink-100 rounded-full">
                    <CalendarX className="h-12 w-12 text-pink-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">No tienes citas reservadas</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    ¡Es hora de mimarte! Reserva tu próxima sesión de belleza y déjanos cuidar de ti.
                  </p>
                </div>
                <Button
                  asChild
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  <Link href="/" className="flex items-center gap-2 text-white">
                    <Sparkles className="h-4 w-4" />
                    ¡Reservar mi primera cita!
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="md:space-y-4 space-y-2">
                {filteredBookings.map((booking) => {
                  return (
                    <Card
                      key={booking.id}
                      hidden={showHistory && isUpcoming(booking.date)}
                      className={`transition-all hover:shadow-md ${
                        isUpcoming(booking.date)
                          ? "border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <CardContent className="md:p-4">
                        <div className="flex flex-row gap-4 items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="md:p-3 p-2 bg-white rounded-lg shadow-sm">
                              {booking.services?.name 
                                ? getServiceIcon(booking.services.name) 
                                : <Calendar className="h-5 w-5 text-gray-400" />
                              }
                            </div>
                            <div className="md:space-y-1 space-y-2">
                              <div className="flex md:flex-row flex-col md:items-center items-start md:gap-2 gap-1">
                                <h3 className="font-semibold md:text-lg text-sm text-gray-900">
                                  {booking.services?.name || 'Servicio no especificado'}
                                </h3>
                                {isUpcoming(booking.date) && (
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Próxima</Badge>
                                )}
                              </div>
                              <div className="flex md:items-center items-start md:flex-row flex-col md:gap-4 gap-1 text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span className="md:text-sm text-xs">{formatDate(booking.date)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span className="md:text-sm text-xs">{booking.time.slice(0, 5)}hs</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {isUpcoming(booking.date) && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleCancelBooking(booking.id)}
                                className="text-white bg-red-500 md:text-sm text-xs hover:bg-red-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                              >
                                <span className="md:block hidden">Cancelar</span>
                                <Trash2 className="h-4 w-4 md:mr-2" />
                              </Button>
                            )}
                            {cancelErrorId === booking.id && <p className="text-red-500 text-xs">Error al cancelar</p>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
                <Card className="border-dashed border-2 border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50 hover:border-pink-300 transition-colors">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="flex justify-center">
                        <div className="p-3 bg-pink-100 rounded-full">
                          <Sparkles className="h-6 w-6 text-pink-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">¿Necesitas otra cita?</h3>
                        <p className="text-gray-600 text-sm">Reserva tu próxima sesión de belleza</p>
                      </div>
                      <Button asChild variant="outline" className="border-pink-200 text-pink-700 hover:bg-pink-50">
                        <Link href="/" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Reservar nueva cita
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}