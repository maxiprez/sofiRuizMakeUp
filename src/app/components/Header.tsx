"use client";

import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from 'react';
import { TimesIcon, HamburgerMenu, ChevronDown } from "@/app/icons/icons";

function Header() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  console.log("session: ", session);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Cierra el menú móvil si la pantalla se hace más grande
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cierra el menú desplegable del usuario al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuRef]);

  return (
    <header className="bg-white shadow-md sticky top-0 p-4 z-30">
      <div className="container mx-auto flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-pink-500">
            SofiRuiz
          </Link>

          {/* Menú Desktop */}
          <nav className="hidden md:flex items-center space-x-4 gap-8 pr-6">
            <div className="flex items-center space-x-4">
              <Link href="/allServices" className="text-gray-700 hover:text-pink-500">
                Servicios
              </Link>
              <Link href="/admin/login" className="text-gray-700 hover:text-pink-500">
                Admin
              </Link>
            </div>
            {session?.user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={toggleUserMenu}
                  className="text-gray-700 relative hover:text-pink-500 py-2 flex items-center gap-2 cursor-pointer focus:outline-none"
                >
                  {session.user.name}
                  <ChevronDown color="#f472b6" size={22} className="top-3"/>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute mt-2 min-w-36 max-w-56 bg-white shadow-md rounded-md z-20">
                    <Link href="/myAccount" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Mi cuenta
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="block px-4 py-2 text-red-500 hover:bg-gray-100 w-full text-left cursor-pointer"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-gray-700 hover:text-pink-500">
                Iniciar Sesión
              </Link>
            )}
          </nav>

          {/* Botón Menú Mobile */}
          <div className="md:hidden z-20">
            <button onClick={toggleMobileMenu} className="text-gray-700 hover:text-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 z-30 relative">
              {isMobileMenuOpen ? (
                <TimesIcon color="currentColor" size={24} />
              ) : (
                <HamburgerMenu color="currentColor" size={24} />
              )}
            </button>
          </div>
      </div>

      {/* Menú Mobile (Desplegable) */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white shadow-md z-10 transform transition-all duration-300 ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <nav className="flex flex-col p-4 space-y-2">
          <Link href="/allServices" className="text-gray-700 hover:text-pink-500 block py-2">
            Servicios
          </Link>
          <Link href="/admin/login" className="text-gray-700 hover:text-pink-500 block py-2">
            Admin
          </Link>
          {session?.user && (
            <>
              <button
                onClick={toggleUserMenu} // Puedes mantener un botón aquí si lo prefieres
                className="flex items-center gap-2 text-gray-700 hover:text-pink-500 py-2 focus:outline-none text-left"
              >
                {session.user.name}
                <ChevronDown color="#f472b6" size={22} className="top-3"/>
              </button>
              {isUserMenuOpen && (
                <div className="ml-4 flex flex-col">
                  <Link href="/myAccount" className="block py-2 text-gray-700 hover:bg-gray-100">
                    Mi cuenta
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="block py-2 text-red-500 hover:bg-gray-100 text-left cursor-pointer"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </>
          )}
          {!session?.user && (
            <Link href="/login" className="text-gray-700 hover:text-pink-500 block py-2">
              Iniciar Sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;