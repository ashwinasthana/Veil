/**
 * Navbar component - Premium Edition
 * Clean, minimal navigation inspired by notemap.com
 * Satoshi brand, Inter Tight nav links, Tabler icons.
 */
"use client";

import { IconMenu2, IconX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-100/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/veil.png"
            alt="Veil"
            width={28}
            height={28}
            className="rounded-lg shadow-sm"
          />
          <span className="font-satoshi font-semibold text-sm tracking-tight">Veil</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="font-interTight text-xs text-neutral-500 hover:text-neutral-900 transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="font-interTight text-xs text-neutral-500 hover:text-neutral-900 transition-colors">
            Pricing
          </Link>
          <Link href="#faq" className="font-interTight text-xs text-neutral-500 hover:text-neutral-900 transition-colors">
            FAQ
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-full bg-neutral-900 text-white font-interTight text-xs font-medium tracking-tight shadow-sm hover:shadow-md hover:bg-neutral-800 transition-all duration-300"
          >
            Open App
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <IconX className="w-5 h-5 text-neutral-700" stroke={1.5} />
          ) : (
            <IconMenu2 className="w-5 h-5 text-neutral-700" stroke={1.5} />
          )}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white/80 backdrop-blur-xl border-b border-neutral-100/50 px-4 sm:px-6 py-4 space-y-3">
          <Link
            href="#features"
            className="block font-interTight text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="block font-interTight text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="block font-interTight text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            FAQ
          </Link>
          <Link
            href="/dashboard"
            className="block w-full text-center py-2.5 rounded-full bg-neutral-900 text-white font-interTight text-xs font-medium tracking-tight shadow-sm hover:shadow-md hover:bg-neutral-800 transition-all duration-300"
            onClick={() => setMobileOpen(false)}
          >
            Open App
          </Link>
        </div>
      )}
    </header>
  );
}
