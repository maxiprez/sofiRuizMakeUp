"use client";

import useABMServices from "@/app/hooks/useABMServices";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Brush, Eye, Wand, CalendarCheck } from "lucide-react"; // Añadido CalendarCheck para el botón
import { JSX } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import Link from "next/link";
import { motion } from "framer-motion"; // Para animaciones más avanzadas

// Mapeo de iconos (mantener el actual, ya es bueno)
const iconMap: Record<string, JSX.Element> = {
  "perfilado de cejas": <Eye className="w-7 h-7 text-pink-600" />, // Icono ligeramente más grande
  "clase auto-makeup": <Wand className="w-7 h-7 text-pink-600" />,
  "makeup": <Sparkles className="w-7 h-7 text-pink-600" />,
  "makeup express": <Brush className="w-7 h-7 text-pink-600" />,
};

// Formato de precio (mantener el actual, es correcto)
const formatPrice = (price: number) =>
  price.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

// Variants para Framer Motion (para animar la aparición de las tarjetas)
// const cardVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
// };

export default function ServiciosSection() {
  const { services, loading, error } = useABMServices();

  return (
    <section className="py-24 bg-gradient-to-br from-pink-50 via-white to-pink-50 text-center"> {/* Degradado más suave y py-24 para más espacio */}
      <div className="max-w-6xl mx-auto px-6"> {/* max-w-6xl para un poco más de ancho, px-6 para padding */}
        <h2 className="text-4xl font-extrabold text-pink-800 mb-4 tracking-tight">Nuestros Servicios</h2> {/* Fuente más grande, más negrita, color más profundo, tracking-tight para estética */}
        <p className="mb-14 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"> {/* Texto más grande, gris más oscuro, línea más relajada */}
          Elegí el servicio que mejor se adapte a tus necesidades para realzar tu belleza. {/* Texto un poco más descriptivo */}
        </p>

        {loading ? (
          <div className="flex justify-center items-center h-40"> {/* Altura un poco más para el loader */}
            <BeatLoader color="#e04e90" size={20} /> {/* Color de loader más oscuro, tamaño más grande */}
          </div>
        ) : error ? (
          <div className="text-red-600 bg-red-50 p-6 rounded-lg border border-red-200 mx-auto max-w-md"> {/* Estilo más robusto para errores */}
            <p className="font-semibold mb-2">¡Ups! Algo salió mal.</p>
            <p>No pudimos cargar los servicios en este momento. Por favor, intenta de nuevo más tarde.</p>
            {/* Opcional: <p className="text-sm mt-2">Detalles del error: {error}</p> */}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Gap un poco más grande */}
            {services.map((service) => (
              <motion.div // Envuelve la Card con motion.div para animaciones de aparición
                key={service.id}
                // variants={cardVariants}
                // initial="hidden"
                // animate="visible"
                // custom={index} // Permite un ligero stagger si se usa en un Container
              >
                <Card
                  className="rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col justify-between
                             transform hover:-translate-y-2 hover:rotate-1 focus:ring-4 focus:ring-pink-300 focus:outline-none border-2 border-pink-100" // Sombra más prominente, ligero translate-y y rotate, focus ring para accesibilidad, borde sutil
                >
                  <CardContent className="p-8 flex flex-col items-center text-center space-y-5 flex-grow"> {/* Padding más generoso, espacio entre elementos */}
                    <div className="p-5 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 ring-4 ring-pink-400 shadow-xl transform hover:scale-110 transition-transform duration-300"> {/* Degradado más fuerte, ring más prominente, sombra más grande, animación al hover */}
                      {iconMap[service.name.toLowerCase()] ?? (
                        <Sparkles className="w-7 h-7 text-pink-600" />
                      )}
                    </div>

                    <h3 className="text-2xl font-bold capitalize text-pink-800 leading-tight mt-3"> {/* Fuente más grande, más negrita, color más oscuro */}
                      {service.name}
                    </h3>

                    <p className="bg-pink-100 text-pink-700 text-lg font-bold px-4 py-2 rounded-full inline-block mt-2"> {/* Estilo de precio más premium, rounded-full, inline-block */}
                      {formatPrice(service.price)}
                    </p>

                    <Link
                      href={`/reservar/${service.id}`} // Enlaza a una página de reserva específica, mejor UX
                      className="mt-6 flex items-center justify-center gap-2 bg-pink-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg
                                 hover:bg-pink-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5
                                 focus:outline-none focus:ring-4 focus:ring-pink-300" // Botón más prominente, con icono, animaciones al hover y focus
                    >
                      <CalendarCheck className="w-5 h-5" /> Reservar
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Nota: Necesitarías instalar framer-motion: npm install framer-motion o yarn add framer-motion