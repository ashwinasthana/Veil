/**
 * Footer component - Premium Edition
 * Clean minimal footer inspired by notemap.com
 */
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-100 bg-white py-6 sm:py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Top row: Brand + Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Image
              src="/veil.png"
              alt="Veil"
              width={24}
              height={24}
              className="rounded-md"
            />
            <span className="font-satoshi font-semibold text-xs">Veil</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-5">
            <Link
              href="#features"
              className="font-interTight text-[11px] text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="font-interTight text-[11px] text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="font-interTight text-[11px] text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              FAQ
            </Link>
          </nav>
        </div>

        {/* Bottom row: Copyright + Made by */}
        <div className="pt-4 border-t border-neutral-50 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-interTight text-[10px] text-neutral-400">
            © {new Date().getFullYear()} Veil · No data collected
          </p>
          <p className="font-interTight text-[10px] text-neutral-400">
            Made by{" "}
            <a
              href="https://github.com/ashwinasthana"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-neutral-900 font-medium transition-colors"
            >
              Ashwin Asthana
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
