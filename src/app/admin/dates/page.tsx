"use client";
import { Card, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Calendar } from "lucide-react"

export default function DatesPage() {
    return (
            <div>
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
            </div>
    )
}
