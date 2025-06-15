"use client";

import useABMServices from "@/app/hooks/useABMServices";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Brush, Eye, Wand } from "lucide-react";
import { JSX } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import Link from "next/link";

const iconMap: Record<string, JSX.Element> = {
    "perfilado de cejas": <Eye className="w-6 h-6 text-pink-600" />,
    "clase auto-makeup": <Wand className="w-6 h-6 text-pink-600" />,
    "makeup": <Sparkles className="w-6 h-6 text-pink-600" />,
    "makeup express": <Brush className="w-6 h-6 text-pink-600" />,
  };
  
  const formatPrice = (price: number) =>
  price.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
  
  export default function ServiciosSection() {
    const { services, loading, error } = useABMServices();
  
    return (
      <section className="py-20 bg-gradient-to-b from-white via-pink-50 to-white text-center">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2">Nuestros Servicios</h2>
          <p className="mb-10 text-gray-700">
            Elegí el servicio que mejor se adapte a tus necesidades
          </p>
  
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <BeatLoader color="#f472b6" size={16} />
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className="rounded-2xl shadow-sm hover:scale-[1.02] hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between"
                >
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4 flex-grow">
                    <div className="p-4 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 ring-2 ring-pink-300 shadow-md">
                      {iconMap[service.name.toLowerCase()] ?? (
                        <Sparkles className="w-6 h-6 text-pink-600" />
                      )}
                    </div>
  
                    <h3 className="text-xl font-semibold capitalize leading-tight">
                      {service.name}
                    </h3>
  
                    <p className="bg-black/10 text-sm font-medium px-3 py-1 rounded-md">
                      Precio: {formatPrice(service.price)}
                    </p>
                    <Link href={`/`} className="mt-4 cursor-pointer text-pink-600 hover:text-pink-700 border-pink-300 border-2 px-4 py-2 rounded-lg w-40 mx-auto">
                      Reservar
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }
