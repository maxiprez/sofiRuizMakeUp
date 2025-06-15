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
      <section className="max-w-2xl mx-auto my-16 px-4">
        <div className="flex items-center justify-center">
            <h2 className="text-3xl font-semibold mb-8 text-center">Preguntas Frecuentes</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-2xl p-4 shadow-sm bg-white/80 hover:shadow-md transition-all"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-center text-left cursor-pointer"
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                {openIndex === index ? <ChevronUp /> : <ChevronDown />}
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-3 text-gray-700 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    );
  }