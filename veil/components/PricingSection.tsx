
/**
 * Pricing Section
 * Three-tier pricing: Free, Pro (lifetime $10), Team (custom)
 * Satoshi headings, Inter Tight body, Tabler icons.
 */
"use client";

import { motion } from "framer-motion";
import { IconCheck, IconSparkles } from "@tabler/icons-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Personal use and quick links.",
    features: [
      "Unlimited short links",
      "Password protection",
      "Expiring links",
      "Self-destruct clicks",
      "No tracking",
    ],
    cta: "Get started",
    href: "/dashboard",
    featured: false,
  },
  {
    name: "Pro",
    price: "$10",
    period: "lifetime",
    description: "More control for power users.",
    features: [
      "Everything in Free",
      "Custom short codes",
      "Priority redirects",
      "API access",
      "Bulk creation",
    ],
    cta: "Go Pro",
    href: "/dashboard",
    featured: true,
    badge: "Popular",
  },
  {
    name: "Team",
    price: "Custom",
    period: "",
    description: "Organizations with custom needs.",
    features: [
      "Everything in Pro",
      "Custom domain",
      "Team management",
      "SSO integration",
      "Dedicated support",
    ],
    cta: "Contact us",
    href: "mailto:ashwin@veils.dev",
    featured: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-6 bg-neutral-50/50">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="font-satoshi text-2xl md:text-3xl font-semibold text-neutral-900 mb-2">
            Simple pricing
          </h2>
          <p className="font-interTight text-neutral-500 text-sm max-w-md mx-auto">
            Start free. Upgrade only if you need more.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-xl p-6 transition-all duration-300 ${
                plan.featured
                  ? "bg-neutral-900 text-white shadow-xl shadow-neutral-900/15 md:scale-105"
                  : "bg-white border border-neutral-200 shadow-sm hover:shadow-lg"
              }`}
            >
              {/* Featured badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-neutral-900 text-[10px] font-semibold font-interTight shadow-md border border-neutral-100">
                  <IconSparkles className="w-2.5 h-2.5" stroke={1.5} />
                  {plan.badge}
                </div>
              )}

              {/* Plan header */}
              <div className="mb-5">
                <h3
                  className={`font-satoshi text-sm font-semibold mb-1.5 ${
                    plan.featured ? "text-neutral-300" : "text-neutral-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-1.5">
                  <span className="font-satoshi text-3xl font-semibold">{plan.price}</span>
                  {plan.period && (
                    <span
                      className={`font-interTight text-xs ${
                        plan.featured ? "text-neutral-400" : "text-neutral-500"
                      }`}
                    >
                      /{plan.period}
                    </span>
                  )}
                </div>
                <p
                  className={`font-interTight text-xs ${
                    plan.featured ? "text-neutral-400" : "text-neutral-500"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              {/* Feature list */}
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <IconCheck
                      className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                        plan.featured ? "text-white" : "text-neutral-900"
                      }`}
                      stroke={2}
                    />
                    <span
                      className={`font-interTight text-xs ${
                        plan.featured ? "text-neutral-300" : "text-neutral-600"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <Link
                href={plan.href}
                className={`block w-full text-center py-2.5 px-5 rounded-full font-interTight font-medium text-xs tracking-tight transition-all duration-300 ${
                  plan.featured
                    ? "bg-white text-neutral-900 hover:bg-neutral-100 shadow-md"
                    : "bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footnote */}
        <p className="text-center font-interTight text-[10px] text-neutral-400 mt-6">
          Pro analytics are opt-in and privacy-respecting.
        </p>
      </div>
    </section>
  );
}
