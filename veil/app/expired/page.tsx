/**
 * Expired/Destroyed Link Page
 * Shown when a link has expired or reached its click limit.
 * Monochrome premium theme.
 */
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { IconBomb, IconClock, IconAlertTriangle, IconLoader2 } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export default function ExpiredPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <IconLoader2 className="w-5 h-5 animate-spin text-neutral-400" stroke={1.5} />
        </div>
      }
    >
      <ExpiredContent />
    </Suspense>
  );
}

function ExpiredContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "expired";

  const content = {
    expired: {
      icon: IconClock,
      title: "Link Expired",
      description: "This link has passed its expiration date and is no longer available.",
    },
    destroyed: {
      icon: IconBomb,
      title: "Link Destroyed",
      description: "This link reached its click limit and has been permanently deleted.",
    },
    notfound: {
      icon: IconAlertTriangle,
      title: "Link Not Found",
      description: "This link doesn't exist or has already been removed.",
    },
  }[reason] || {
    icon: IconAlertTriangle,
    title: "Link Unavailable",
    description: "This link is no longer available.",
  };

  const Icon = content.icon;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 bg-dots">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm text-center"
      >
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-neutral-900 mb-4 shadow-lg">
          <Icon className="w-6 h-6 text-white" stroke={1.5} />
        </div>

        {/* Title */}
        <h1 className="font-satoshi text-xl font-semibold tracking-tight text-neutral-900 mb-2">
          {content.title}
        </h1>

        {/* Description */}
        <p className="font-interTight text-neutral-500 text-sm mb-6 leading-relaxed">
          {content.description}
        </p>

        {/* CTA */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white font-interTight font-medium text-xs tracking-tight shadow-md shadow-neutral-900/15 hover:shadow-lg hover:bg-neutral-800 transition-all duration-300"
        >
          Create a new link
        </Link>

        {/* Footer */}
        <div className="mt-8">
          <div className="inline-flex items-center gap-1 font-interTight text-[10px] text-neutral-400">
            <Image src="/veil.png" alt="Veil" width={10} height={10} className="rounded-sm" />
            Powered by Veil — built by Ashwin Asthana
          </div>
        </div>
      </motion.div>
    </div>
  );
}
