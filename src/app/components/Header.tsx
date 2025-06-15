"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { TimesIcon, HamburgerMenu, ChevronDown } from "@/app/icons/icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { Button } from "@/app/components/ui/button"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"

export default function Header() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <header className="bg-white shadow-md sticky top-0 p-4 z-30">
      <div className="container mx-auto flex items-center justify-between relative">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-pink-500">
          SofiRuiz
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-4 gap-8 pr-6">
          <div className="flex items-center space-x-4">
            <Link href="/my-services" className="text-gray-700 hover:text-pink-500">
              Mis servicios
            </Link>
            <Link href="/faqs" className="text-gray-700 hover:text-pink-500">
              Preguntas frecuentes
            </Link>
            {session?.user?.role === "admin" && (
              <Link href="/admin" className="text-gray-700 hover:text-pink-500">
                Admin
              </Link>
            )}
          </div>

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center cursor-pointer gap-2 text-gray-700 hover:text-pink-500 hover:bg-transparent focus:bg-transparent"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-pink-100 text-pink-700">
                        {session.user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{session.user.name}</span>
                    <ChevronDown color="#f472b6" size={22} className="top-3" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg rounded-md">
                <DropdownMenuItem asChild>
                  <Link href="/my-account" className="cursor-pointer">
                    Mi cuenta
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500 cursor-pointer"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="text-gray-700 hover:text-pink-500">
              Iniciar Sesión
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="text-gray-700 hover:text-pink-500 hover:bg-transparent focus:bg-transparent"
          >
            {isMobileMenuOpen ? (
              <TimesIcon color="currentColor" size={24} />
            ) : (
              <HamburgerMenu color="currentColor" size={24} />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white shadow-md z-10 transform transition-all duration-300 ${isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
      >
        <nav className="flex flex-col p-4 space-y-2">
          <Link href="/my-services" className="text-gray-700 hover:text-pink-500 block py-2">
            Mis servicios
          </Link>
          <Link href="/faqs" className="text-gray-700 hover:text-pink-500 block py-2">
            Preguntas frecuentes
          </Link>
          {session?.user?.role === "admin" && (
            <Link href="/admin" className="text-gray-700 hover:text-pink-500 block py-2">
              Admin
            </Link>
          )}

          {session?.user ? (
            <div className="py-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-gray-700 hover:text-pink-500 hover:bg-transparent focus:bg-transparent p-0 h-auto"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-pink-100 text-pink-700">
                          {session.user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{session.user.name}</span>
                      <ChevronDown color="#f472b6" size={22} className="top-3" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-56 bg-white border border-gray-200 shadow-lg rounded-md"
                >
                  <DropdownMenuItem asChild>
                    <Link href="/my-account" className="cursor-pointer">
                      Mi cuenta
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-500 cursor-pointer"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link href="/login" className="text-gray-700 hover:text-pink-500 block py-2">
              Iniciar Sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
