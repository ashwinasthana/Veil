/**
 * Dashboard Page
 * The URL shortening interface.
 * Clean, centered layout with the ShortenerForm component.
 * Satoshi headings, Inter Tight body, Tabler icons.
 */
import Image from "next/image";
import ShortenerForm from "@/components/ShortenerForm";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Dashboard — Veil",
  description: "Create anonymous short links with Veil.",
};

export default function DashboardPage() {
  return (
    <>
      <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-12 bg-dots">
        {/* Subtle monochrome orbs */}
        <div className="fixed top-20 left-1/4 w-96 h-96 bg-neutral-100 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-20 right-1/4 w-80 h-80 bg-neutral-50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm border border-neutral-100 mb-5">
              <Image src="/veil.png" alt="Veil" width={14} height={14} className="rounded-sm" />
              <span className="font-interTight text-xs font-medium text-neutral-600">Veil Dashboard</span>
            </div>
            <h1 className="font-satoshi text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
              Create an <span className="text-neutral-400">anonymous link</span>
            </h1>
            <p className="font-interTight text-neutral-500 text-sm max-w-sm mx-auto">
              Paste your URL below. No account needed.
            </p>
          </div>

          {/* Shortener form */}
          <ShortenerForm />

          {/* Privacy notice */}
          <div className="mt-6 text-center">
            <p className="font-interTight text-[10px] text-neutral-400 max-w-sm mx-auto leading-relaxed">
              Veil does not log your IP address, track clicks, or store any personal data.
              All passwords are hashed with bcrypt. Links can be set to self-destruct.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
