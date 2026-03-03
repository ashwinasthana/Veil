/**
 * FAQ Section
 * Accordion-style FAQ with smooth animations
 * Satoshi headings, Inter Tight body, Tabler icons.
 */
"use client";

import { motion } from "framer-motion";
import { IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";

const faqs = [
  {
    question: "Is Veil really free?",
    answer: "Yes. Core features are free forever. No sign-up or card needed.",
  },
  {
    question: "Do you track data?",
    answer: "No. We don’t log IPs, track clicks, or use cookies.",
  },
  {
    question: "How does password protection work?",
    answer: "Passwords are bcrypt-hashed. The original is never stored.",
  },
  {
    question: "What happens when a link self-destructs?",
    answer: "It’s permanently deleted. The short code becomes invalid.",
  },
  {
    question: "Can I use Veil over Tor?",
    answer: "Yes. Server-side redirects, no JavaScript, no CAPTCHAs.",
  },
  {
    question: "What’s the rate limit?",
    answer: "10 links per minute per IP. No IP data is persisted.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-satoshi text-xl md:text-2xl font-semibold text-neutral-900 mb-2">
            FAQ
          </h2>
          <p className="font-interTight text-neutral-500 text-sm">
            Common questions answered.
          </p>
        </motion.div>

        {/* FAQ accordion */}
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
                aria-expanded={openIndex === i}
              >
                <span className="font-satoshi text-sm font-medium text-neutral-900 pr-4">
                  {faq.question}
                </span>
                <IconChevronDown
                  className={`w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  stroke={1.5}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-4 pb-4 font-interTight text-neutral-500 text-xs leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
