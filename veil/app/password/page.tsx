/**
 * Password Entry Page
 * Shown when a user tries to access a password-protected link.
 * Satoshi headings, Inter Tight body, Tabler icons.
 */
"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { IconLock, IconLoader2, IconAlertCircle } from "@tabler/icons-react";
import Image from "next/image";

/** Wrapper with Suspense boundary (required by Next.js for useSearchParams) */
export default function PasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <IconLoader2 className="w-5 h-5 animate-spin text-neutral-400" stroke={1.5} />
        </div>
      }
    >
      <PasswordForm />
    </Suspense>
  );
}

function PasswordForm() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code) {
      setError("Invalid link. Missing code parameter.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/${code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setError(data.error || "Incorrect password");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 bg-dots">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-100 mb-3 shadow-sm">
            <IconLock className="w-5 h-5 text-neutral-600" stroke={1.5} />
          </div>
          <h1 className="font-satoshi text-xl font-semibold tracking-tight text-neutral-900 mb-1">Password Protected</h1>
          <p className="font-interTight text-neutral-500 text-xs">
            This link requires a password to access.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block font-interTight text-xs font-medium text-neutral-700 mb-1.5">
                Enter password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all font-interTight text-xs"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 border border-red-100 text-red-600 font-interTight text-xs">
                <IconAlertCircle className="w-3.5 h-3.5 flex-shrink-0" stroke={1.5} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-2.5 rounded-full bg-neutral-900 text-white font-interTight font-medium text-xs tracking-tight shadow-md shadow-neutral-900/15 hover:shadow-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <IconLoader2 className="w-3.5 h-3.5 animate-spin" stroke={1.5} />
                  Verifying...
                </>
              ) : (
                "Unlock Link"
              )}
            </button>
          </form>
        </div>

        <div className="mt-5 text-center">
          <div className="inline-flex items-center gap-1 font-interTight text-[10px] text-neutral-400">
            <Image src="/veil.png" alt="Veil" width={10} height={10} className="rounded-sm" />
            Powered by Veil — built by Ashwin Asthana
          </div>
        </div>
      </motion.div>
    </div>
  );
}
