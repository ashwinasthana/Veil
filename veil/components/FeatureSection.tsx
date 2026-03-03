/**
 * Feature Section
 * 3-column highlights + 6-card grid.
 * Satoshi headings, Inter Tight body, Tabler icons.
 */
"use client";

import { motion } from "framer-motion";
import {
  IconShieldLock,
  IconBolt,
  IconCreditCardOff,
  IconLock,
  IconClock,
  IconBomb,
  IconEyeOff,
  IconWorld,
  IconServer,
} from "@tabler/icons-react";

const highlights = [
  {
    icon: IconShieldLock,
    title: "Privacy-first",
    description: "No accounts. No tracking. No IP logging.",
  },
  {
    icon: IconCreditCardOff,
    title: "No subscriptions",
    description: "Core features free forever. No card needed.",
  },
  {
    icon: IconBolt,
    title: "Fast redirects",
    description: "Sub-100ms redirects via edge infrastructure.",
  },
];

const features = [
  {
    icon: IconLock,
    title: "Password Protection",
    description: "Encrypt links with passwords.",
  },
  {
    icon: IconClock,
    title: "Expiring Links",
    description: "Set custom expiration dates.",
  },
  {
    icon: IconBomb,
    title: "Self Destruct",
    description: "Links destroy after N clicks.",
  },
  {
    icon: IconEyeOff,
    title: "Zero Analytics",
    description: "No click or referrer tracking.",
  },
  {
    icon: IconWorld,
    title: "Tor Compatible",
    description: "Works over Tor and VPNs.",
  },
  {
    icon: IconServer,
    title: "Minimal Logs",
    description: "No user-identifiable data.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: "easeOut" as const },
  }),
};

export default function FeatureSection() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200 text-[10px] font-interTight font-medium tracking-tight mb-4">
            Features
          </span>
          <h2 className="font-satoshi text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-3">
            Built for the <span className="text-neutral-400">privacy-conscious</span>
          </h2>
          <p className="font-interTight text-neutral-500 text-sm max-w-lg mx-auto leading-relaxed">
            Every feature designed to keep you anonymous.
          </p>
        </motion.div>

        {/* 3-column highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i * 0.15}
              className="group relative bg-white rounded-xl p-6 border border-neutral-100 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-neutral-900 text-white mb-4 shadow-md">
                <item.icon className="w-4 h-4" stroke={1.5} />
              </div>
              <h3 className="font-satoshi text-sm font-semibold text-neutral-800 mb-1">{item.title}</h3>
              <p className="font-interTight text-neutral-500 text-xs leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Feature grid header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h3 className="font-satoshi text-xl md:text-2xl font-semibold tracking-tight text-neutral-900 mb-2">
            Everything you need
          </h3>
          <p className="font-interTight text-neutral-500 text-sm max-w-md mx-auto">
            Powerful features with zero compromises.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i * 0.1}
              className="group bg-white rounded-xl p-5 border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-50 text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white mb-3 transition-colors duration-300">
                <feature.icon className="w-4 h-4" stroke={1.5} />
              </div>
              <h4 className="font-satoshi text-[13px] font-semibold text-neutral-800 mb-1">{feature.title}</h4>
              <p className="font-interTight text-neutral-500 text-xs leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
