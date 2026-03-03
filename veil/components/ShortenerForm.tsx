/**
 * ShortenerForm Component
 * The core URL shortening form with optional privacy features.
 * Satoshi headings, Inter Tight body, Tabler icons.
 */
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconLink,
  IconLock,
  IconClock,
  IconBomb,
  IconCopy,
  IconCheck,
  IconLoader2,
  IconChevronDown,
  IconExternalLink,
  IconAlertCircle,
} from "@tabler/icons-react";
import DateTimePicker from "./DateTimePicker";

/** Response shape from POST /api/shorten */
interface ShortenResponse {
  shortUrl: string;
  shortCode: string;
  expiresAt: string | null;
  hasPassword: boolean;
  clickLimit: number | null;
}

export default function ShortenerForm() {
  // ─── State ───
  const [url, setUrl] = useState("");
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [clickLimit, setClickLimit] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShortenResponse | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /** Show a temporary toast notification */
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  /** Copy short URL to clipboard */
  const copyToClipboard = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      showToast("Copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Failed to copy. Try manually.", "error");
    }
  };

  /** Submit form to create a new short URL */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const body: Record<string, unknown> = { url };
      if (password) body.password = password;
      if (expiresAt) body.expiresAt = new Date(expiresAt).toISOString();
      if (clickLimit) body.clickLimit = parseInt(clickLimit, 10);

      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        showToast(data.error || "Failed to shorten URL", "error");
        return;
      }

      setResult(data);
      showToast("Link created successfully!", "success");

      // Reset form fields
      setUrl("");
      setPassword("");
      setExpiresAt("");
      setClickLimit("");
      setShowAdvanced(false);
    } catch {
      setError("Network error. Please try again.");
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  /** Minimum date for expiry picker (now + 5 minutes) */
  const minDate = new Date(Date.now() + 5 * 60 * 1000).toISOString().slice(0, 16);

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-md text-xs font-medium ${
              toast.type === "success"
                ? "bg-neutral-900 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main form card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl border border-neutral-200 shadow-lg p-4 sm:p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL input */}
          <div>
            <label className="block font-interTight text-xs font-medium text-neutral-700 mb-1.5">
              Destination URL
            </label>
            <div className="relative">
              <IconLink className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" stroke={1.5} />
              <input
                ref={inputRef}
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/your-long-url"
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all font-interTight text-xs"
              />
            </div>
          </div>

          {/* Advanced options toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 font-interTight text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <IconChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                showAdvanced ? "rotate-180" : ""
              }`}
              stroke={1.5}
            />
            Privacy options
          </button>

          {/* Advanced options */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden space-y-4"
              >
                {/* Password */}
                <div>
                  <label className="flex items-center gap-1.5 font-interTight text-xs font-medium text-neutral-700 mb-1.5">
                    <IconLock className="w-3.5 h-3.5" stroke={1.5} />
                    Password protection
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all font-interTight text-xs"
                  />
                </div>

                {/* Expiry */}
                <div>
                  <label className="flex items-center gap-1.5 font-interTight text-xs font-medium text-neutral-700 mb-1.5">
                    <IconClock className="w-3.5 h-3.5" stroke={1.5} />
                    Expiry date
                  </label>
                  <DateTimePicker
                    value={expiresAt}
                    onChange={setExpiresAt}
                    min={minDate}
                    placeholder="Select expiry date & time"
                  />
                </div>

                {/* Click limit */}
                <div>
                  <label className="flex items-center gap-1.5 font-interTight text-xs font-medium text-neutral-700 mb-1.5">
                    <IconBomb className="w-3.5 h-3.5" stroke={1.5} />
                    Self-destruct after clicks
                  </label>
                  <input
                    type="number"
                    value={clickLimit}
                    onChange={(e) => setClickLimit(e.target.value)}
                    placeholder="Optional"
                    min={1}
                    max={1000000}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all font-interTight text-xs"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 font-interTight text-xs"
            >
              <IconAlertCircle className="w-3.5 h-3.5 flex-shrink-0" stroke={1.5} />
              {error}
            </motion.div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || !url}
            className="w-full py-3 rounded-full bg-neutral-900 text-white font-interTight font-medium text-sm tracking-tight shadow-md shadow-neutral-900/15 hover:shadow-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <IconLoader2 className="w-4 h-4 animate-spin" stroke={1.5} />
                Shortening...
              </>
            ) : (
              "Shorten Link"
            )}
          </button>
        </form>
      </motion.div>

      {/* Result card */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="mt-4 bg-neutral-900 rounded-xl p-5 border border-neutral-800 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-interTight text-xs text-neutral-400 font-medium">Link created</span>
            </div>

            {/* Short URL display */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 bg-neutral-800/50 rounded-lg px-4 py-3 border border-neutral-700/50">
                <span className="text-emerald-400 font-mono text-xs break-all">
                  {result.shortUrl}
                </span>
              </div>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 px-4 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors font-interTight text-xs font-medium"
                title="Copy to clipboard"
              >
                {copied ? (
                  <IconCheck className="w-3.5 h-3.5 text-emerald-400" stroke={2} />
                ) : (
                  <IconCopy className="w-3.5 h-3.5" stroke={1.5} />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            {/* Link metadata */}
            <div className="flex flex-wrap items-center gap-2 font-interTight text-[10px] text-neutral-500">
              {result.hasPassword && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-neutral-400">
                  <IconLock className="w-2.5 h-2.5" stroke={1.5} /> Password
                </span>
              )}
              {result.expiresAt && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-neutral-400">
                  <IconClock className="w-2.5 h-2.5" stroke={1.5} /> Expires {new Date(result.expiresAt).toLocaleDateString()}
                </span>
              )}
              {result.clickLimit && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-neutral-400">
                  <IconBomb className="w-2.5 h-2.5" stroke={1.5} /> {result.clickLimit} clicks
                </span>
              )}
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-neutral-400 hover:bg-white/10 transition-colors"
              >
                <IconExternalLink className="w-2.5 h-2.5" stroke={1.5} /> Open link
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
