"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "¿Cómo reservo un turno?",
    answer:
      "Todos los turnos se reservan únicamente a través de la web. No tomamos reservas por WhatsApp ni redes sociales.",
  },
  {
    question: "¿Puedo reprogramar mi turno?",
    answer:
      "Sí, podés reprogramar tu turno con al menos 24 horas de anticipación. Esto permite que otra persona pueda ocupar ese espacio. Las reprogramaciones también deben hacerse a través del mismo sistema online.",
  },
  {
    question: "¿Qué pasa si llego tarde?",
    answer:
      "Contamos con una tolerancia máxima de 20 minutos. Si vas a llegar tarde, te pedimos que nos avises por WhatsApp para tenerlo en cuenta. Si se supera ese tiempo sin aviso, el turno podrá ser cancelado.",
  },
  {
    question: "¿Qué pasa si no asisto a mi turno?",
    answer:
      "En caso de inasistencia sin previo aviso, será necesario abonar el 100% del servicio mediante transferencia para poder agendar un nuevo turno. No se hacen excepciones.",
  },
  {
    question: "No encuentro el horario que quiero, ¿qué hago?",
    answer:
      "Los turnos disponibles son los que figuran en la agenda online. Si no ves el horario que buscás, significa que ya fue reservado. Te sugerimos probar con otras fechas.",
  },
];

export default function FaqsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-pink-50 via-white to-pink-50 text-center"> {/* Fondo degradado coherente */}
      <div className="max-w-2xl mx-auto px-6"> {/* max-w-2xl para contenido centrado, px-6 para padding */}
        <h2 className="text-4xl font-extrabold text-pink-800 mb-14 tracking-tight">Preguntas Frecuentes</h2> {/* Estilo de título coherente, mb-14 */}
        
        <div className="space-y-6"> {/* Más espacio entre tarjetas */}
          {faqs.map((faq, index) => (
            <motion.div // Envuelve cada FAQ para posibles animaciones futuras si decides que aparezcan
              key={index}
              initial={false} // importante para AnimatePresence dentro
              className="rounded-3xl p-6 shadow-xl bg-white border-2 border-pink-100 // Más redondeado, sombra más fuerte, fondo blanco, borde sutil
                         hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 // Mejor hover effect
                         focus-within:ring-4 focus-within:ring-pink-200 focus-within:outline-none" // Focus para accesibilidad
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-center text-left cursor-pointer focus:outline-none"
              >
                <span className="text-xl font-semibold text-pink-800 leading-snug pr-4"> {/* Texto de pregunta más grande, color de marca, padding a la derecha */}
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 180 : 0 }} // Anima la rotación del icono
                  transition={{ duration: 0.3 }}
                >
                  {openIndex === index ? (
                    <ChevronUp className="w-7 h-7 text-pink-500 flex-shrink-0" /> // Icono más grande y color de acento
                  ) : (
                    <ChevronDown className="w-7 h-7 text-pink-500 flex-shrink-0" />
                  )}
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }} // Transición más suave
                    className="overflow-hidden" // Asegura que el contenido no se desborde durante la animación
                  >
                    <p className="mt-4 text-gray-700 text-base leading-relaxed pt-3 border-t border-pink-100"> {/* Texto de respuesta más grande, mejor interlineado, separador visual */}
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}