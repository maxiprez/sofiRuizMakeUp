"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Faq {
  question: string;
  answer: string;
}

export default function FaqsClient({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-6">
      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          initial={false}
          className="rounded-3xl p-6 shadow-xl bg-white border-2 border-pink-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus-within:ring-4 focus-within:ring-pink-200 focus-within:outline-none"
        >
          <button
            onClick={() => toggleFaq(index)}
            className="w-full flex justify-between items-center text-left cursor-pointer focus:outline-none"
          >
            <span className="text-xl font-semibold text-pink-800 leading-snug pr-4">
              {faq.question}
            </span>
            <motion.span
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {openIndex === index ? (
                <ChevronUp className="w-7 h-7 text-pink-500 shrink-0" />
              ) : (
                <ChevronDown className="w-7 h-7 text-pink-500 shrink-0" />
              )}
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <p className="mt-4 text-gray-700 text-base leading-relaxed pt-3 border-t border-pink-100">
                  {faq.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
