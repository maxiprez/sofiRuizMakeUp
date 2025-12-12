"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { CalendarDays } from "lucide-react"
import { DollarSign, TrendingUp, UserCheck } from "lucide-react"
import { useInfoAdmin } from "@/app/hooks/useInfoAdmin";
// import { useGetCustomers } from "@/app/hooks/useABMCustomers";

export default function CardsAdminWrapper() {
    const { bookings, difference, icon, iconColor } = useInfoAdmin();
    // const { customersCount } = useGetCustomers();

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Citas Hoy</CardTitle>
                    <CalendarDays className="h-4 w-4 text-pink-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{bookings.today ?? 0}</div>
                    <p className={`text-xs ${iconColor} flex items-center gap-1`}>
                        {icon && React.createElement(icon, { className: "h-3 w-3" })}
                        {difference}
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
                    <p className={`text-xs ${iconColor} flex items-center gap-1`}>
                    {/* <TrendingDown className="h-3 w-3" /> */}
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
                    {/* <div className="text-2xl font-bold text-gray-900">{ customersCount }</div> */}
                    <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +8 este mes
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}