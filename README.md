<div align="center">

# 🕶️ Veil

**Anonymous URL Shortener — Privacy-First, Zero Tracking**

Shorten links without sign-ups, cookies, or logs. Built for the privacy-conscious.

[**Live Demo →**](https://veils.dev) · [**Dashboard →**](https://veils.dev/dashboard)

---

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel)

</div>

---

## What is Veil?

Veil is an anonymous URL shortener that doesn't track you. No accounts, no analytics, no cookies — just short links that respect your privacy.

- **No sign-up required** — paste a URL, get a short link
- **No tracking** — zero analytics, no click counting for users, no referrer logging
- **No data stored** — IPs are never persisted, passwords are bcrypt-hashed

---

## Features

| Feature | Description |
|---|---|
| 🔗 **Instant Shortening** | Paste a URL → get a short link in milliseconds |
| 🔒 **Password Protection** | Protect links with bcrypt-hashed passwords |
| ⏰ **Expiring Links** | Set custom expiration dates — expired links are auto-deleted |
| 💣 **Self-Destruct** | Links auto-delete after a set number of clicks (1–1,000,000) |
| 🚫 **Zero Analytics** | No click tracking, no referrer logging, no cookies |
| 🌍 **Tor Compatible** | Server-side redirects, no JavaScript required for resolution |
| ⚡ **Edge Redirects** | Sub-100ms redirects via Vercel edge infrastructure |
| 🛡️ **Rate Limiting** | 10 requests/min per IP via Upstash Redis (IP never stored) |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org) | Full-stack React framework (App Router) |
| [TypeScript](https://typescriptlang.org) | Type-safe codebase |
| [Prisma](https://prisma.io) | ORM + PostgreSQL on Neon |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [Framer Motion](https://framer.com/motion) | Smooth animations |
| [Upstash Redis](https://upstash.com) | Serverless rate limiting |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |
| [nanoid](https://github.com/ai/nanoid) | Short code generation |
| [Vercel](https://vercel.com) | Deployment + edge network |

---

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│   Browser    │────▶│  Middleware   │────▶│  API Routes   │
│              │     │  (route      │     │  /api/shorten  │
│  veils.dev/  │     │   short      │     │  /api/[code]   │
│  dashboard   │     │   codes)     │     │                │
└─────────────┘     └──────────────┘     └───────┬───────┘
                                                  │
                          ┌───────────────────────┼───────────────┐
                          │                       │               │
                    ┌─────▼─────┐          ┌──────▼──────┐  ┌────▼────┐
                    │  Prisma   │          │  Upstash    │  │ bcrypt  │
                    │  + Neon   │          │  Redis      │  │ hashing │
                    │  (PostgreSQL)        │  (rate      │  │         │
                    └───────────┘          │   limit)    │  └─────────┘
                                           └─────────────┘
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database ([Neon](https://neon.tech) free tier recommended)
- Upstash Redis (optional, for rate limiting)

### Installation

```bash
# Clone the repo
git clone https://github.com/ashwinasthana/Veil.git
cd Veil/veil

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL

# Push database schema
npx prisma db push

# Start development server
npm run dev
```

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `UPSTASH_REDIS_REST_URL` | ❌ | Upstash Redis URL (for rate limiting) |
| `UPSTASH_REDIS_REST_TOKEN` | ❌ | Upstash Redis token |
| `NEXT_PUBLIC_BASE_URL` | ❌ | Custom base URL (default: auto-detect) |

---

## API Reference

### `POST /api/shorten`

Create a shortened URL.

```json
{
  "url": "https://example.com/very-long-url",
  "password": "optional-password",
  "expiresAt": "2026-04-01T00:00:00.000Z",
  "clickLimit": 100
}
```

**Response** `201`

```json
{
  "shortUrl": "https://veils.dev/x7Kp2mQ",
  "shortCode": "x7Kp2mQ",
  "expiresAt": "2026-04-01T00:00:00.000Z",
  "hasPassword": false,
  "clickLimit": 100
}
```

### `GET /:code`

Redirects to the original URL (302). Returns password prompt page if protected.

---

## Design

Typography: **Satoshi** (headings) + **Inter Tight** (body)  
Colors: Monochrome neutrals — no flashy gradients  
Animations: Subtle fade-ups via Framer Motion  
Icons: [Tabler Icons](https://tabler.io/icons)

---

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ashwinasthana/Veil)

1. Click deploy
2. Add `DATABASE_URL` environment variable
3. Done — Prisma generates on build automatically

---

## License

MIT © [Ashwin Asthana](https://github.com/ashwinasthana)

---

<div align="center">

**[veils.dev](https://veils.dev)** — Shorten links. Stay invisible.

Built by [Ashwin Asthana](https://ashwinasthana.me)

</div>
