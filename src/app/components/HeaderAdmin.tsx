"use client";

import { SidebarTrigger } from "@/app/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import { Search } from "lucide-react"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Bell } from "lucide-react"
import { ChevronDown } from "lucide-react"
import { useSession } from 'next-auth/react';

export default function HeaderAdmin() {
    const { data: session } = useSession();

    return (
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
                                <AvatarFallback className="bg-pink-100 text-pink-700 uppercase">{session?.user?.name?.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="hidden md:inline capitalize">{session?.user?.name}</span>
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
    )
}
