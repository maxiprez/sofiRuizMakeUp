import FaqsClient from "@/app/faqs/FaqsClient";

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
  return (
    <section className="py-24 bg-linear-to-br from-pink-50 via-white to-pink-50 text-center">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-pink-800 mb-14 tracking-tight">
          Preguntas Frecuentes
        </h2>
        <FaqsClient faqs={faqs} />
      </div>
    </section>
  );
}
