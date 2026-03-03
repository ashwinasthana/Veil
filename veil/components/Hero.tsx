/**
 * Hero Section
 * Premium minimal SaaS hero with floating badges and gradient text.
 * Satoshi headings, Inter Tight body, Tabler icons.
 */
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";

/** Floating pill badges that orbit around the hero text */
const badges = [
  { label: "No login", color: "bg-white text-neutral-600 border border-neutral-200 shadow-sm", position: "-top-8 left-[5%]", delay: 0 },
  { label: "No tracking", color: "bg-white text-neutral-600 border border-neutral-200 shadow-sm", position: "-top-6 right-[5%]", delay: 0.5 },
  { label: "Self destruct", color: "bg-white text-neutral-600 border border-neutral-200 shadow-sm", position: "top-[15%] -left-[8%]", delay: 1 },
  { label: "Encrypted", color: "bg-white text-neutral-600 border border-neutral-200 shadow-sm", position: "top-[12%] -right-[8%]", delay: 1.5 },
  { label: "Tor compatible", color: "bg-white text-neutral-600 border border-neutral-200 shadow-sm", position: "top-[38%] -left-[6%]", delay: 2 },
];

/** Fade in from bottom animation variant */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" as const },
  }),
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dots pt-20 pb-12 sm:pt-16 sm:pb-16 md:pt-0 md:pb-0 md:min-h-[85vh]">
      {/* Subtle monochrome orbs */}
      <div className="absolute top-20 left-1/4 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-neutral-100 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-neutral-50 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Floating privacy badges */}
        <div className="relative">
          {badges.map((badge) => (
            <motion.span
              key={badge.label}
              className={`absolute ${badge.position} hidden md:inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-interTight font-medium ${badge.color} shadow-sm animate-float`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: badge.delay }}
              style={{ animationDelay: `${badge.delay}s` }}
            >
              {badge.label}
            </motion.span>
          ))}

          {/* Brand pill */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-md border border-neutral-100 mb-6"
          >
            <Image src="/veil.png" alt="Veil" width={14} height={14} className="rounded-sm" />
            <span className="font-interTight text-[10px] sm:text-xs font-medium text-neutral-600">Veil — Privacy-first URL shortener</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="font-satoshi text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-3 sm:mb-4 text-neutral-900"
            style={{ letterSpacing: "-0.02em", lineHeight: "1.1" }}
          >
            Shorten links. <span className="text-neutral-400">Stay invisible.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
            className="font-interTight text-sm sm:text-base text-neutral-500 max-w-xs sm:max-w-lg mx-auto mb-6 sm:mb-8 leading-relaxed"
          >
            Anonymous URL shortener. No sign-ups, no tracking, no logs.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.6}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-neutral-900 text-white font-interTight font-medium text-sm tracking-tight shadow-lg shadow-neutral-900/20 hover:shadow-xl hover:bg-neutral-800 transition-all duration-300"
            >
              Shorten a link
              <IconArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" stroke={1.5} />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white text-neutral-600 font-interTight font-medium text-sm border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all duration-300"
            >
              Learn more
            </a>
          </motion.div>
        </div>

        {/* Dark product preview mock */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.8}
          className="mt-8 sm:mt-12 md:mt-20 relative"
        >
          <div className="bg-gray-950 rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 shadow-2xl border border-gray-800 max-w-xs sm:max-w-xl md:max-w-2xl mx-auto">
            {/* Window controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500/80" />
              <span className="ml-2 sm:ml-3 text-gray-500 text-[10px] sm:text-xs font-mono">veils.dev/dashboard</span>
            </div>

            {/* Mock shortener UI */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-800/50 rounded-md sm:rounded-lg px-2 sm:px-4 py-2 sm:py-2.5 text-gray-400 text-[10px] sm:text-xs font-mono border border-gray-700/50 truncate">
                  https://example.com/long-url...
                </div>
                <div className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg bg-white/10 text-white text-[10px] sm:text-xs font-medium">
                  Shorten
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-800/30 rounded-md sm:rounded-lg px-2 sm:px-4 py-2 sm:py-2.5 border border-gray-700/30">
                <span className="text-emerald-400 text-[10px] sm:text-xs font-mono">✓</span>
                <span className="text-gray-300 text-[10px] sm:text-xs font-mono">veils.dev/x7Kp2mQ</span>
                <span className="ml-auto text-gray-500 text-[9px] sm:text-[10px]">Copied!</span>
              </div>
            </div>
          </div>

          {/* Subtle shadow under the preview */}
          <div className="absolute -bottom-6 sm:-bottom-10 left-1/2 -translate-x-1/2 w-2/3 h-12 sm:h-16 bg-neutral-900/5 blur-2xl sm:blur-3xl rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}
