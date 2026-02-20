import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { CalendarDays, XCircle, UserCheck, DollarSign } from "lucide-react"
import { RevenueData, DailyBookingData, CancelledBookingsData } from "types/entities";
import { TrendBadge } from '@/app/components/ui/TrendBadge';
import { Customers } from "@/app/_actions/abmCustomers.action";

export default function CardsAdminWrapper({ revenue, dailyBookingComparison, cancelledBookings, customers }: { revenue: RevenueData, dailyBookingComparison: DailyBookingData, cancelledBookings: CancelledBookingsData, customers: Customers }) {

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Citas Hoy</CardTitle>
                    <CalendarDays className="h-4 w-4 text-pink-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{dailyBookingComparison.today}</div>
                    <TrendBadge trend={dailyBookingComparison.trend} integer={dailyBookingComparison.difference}/>
                </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Ingresos Mes</CardTitle>
                    <DollarSign className="h-4 w-4 text-pink-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{revenue.currentTotal}</div>
                    <TrendBadge trend={revenue.trend} percentage={revenue.percentageChange}/>
                </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Clientes Activos</CardTitle>
                    <UserCheck className="h-4 w-4 text-pink-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{customers.count}</div>
                    <p className="text-xs text-gray-500 mt-2">Total de usuarios registrados</p>
                </CardContent>
            </Card>

             <Card className="border-purple-100 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Cancelaciones del día</CardTitle>
                    <XCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{cancelledBookings.today}</div>
                    <TrendBadge trend={cancelledBookings.trend} integer={cancelledBookings.difference}/>
                </CardContent>
            </Card>
        </div>
    )
}