<div align="center">

# ₿ CryptoIQ
### Real-Time Crypto Market Intelligence Platform

A production-grade SaaS platform for live cryptocurrency tracking, intelligent price alerts, portfolio management, and market analytics.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-crypto--eye--nine.vercel.app-black?style=for-the-badge&logo=vercel)](https://crypto-eye-nine.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Tabishhaider72/CryptoIQ-Real-Time-Crypto-Market-Intelligence)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

</div>

---

## Overview

CryptoIQ is a full-stack real-time crypto intelligence platform that fetches live prices for 10+ cryptocurrencies from CoinGecko API every 10 seconds via a background worker, processes data through a WebSocket server, and delivers insights through a polished dark-themed interface. It features end-to-end price alerts with instant notifications, a portfolio tracker with live P&L calculation, and an analytics dashboard with volatility and correlation analysis — all running with a single `docker compose up` command.

---

## Screenshots

## Screenshots

### 🏠 Home
<img width="1873" height="903" alt="image" src="https://github.com/user-attachments/assets/67794f11-c5c3-41cf-983e-78577c3e8d30" />


---

### 📊 Live Market Dashboard
![Dashboard](https://github.com/user-attachments/assets/58b2a347-05e4-4a05-8543-e6b8c7df0a61)
*Real-time price table with WebSocket updates every 10 seconds*

---

### 🪙 Coin Detail View
![Coin Detail](https://github.com/user-attachments/assets/1d75a439-21cf-498a-969f-1d83be13130b)
*7-day interactive price chart with statistics*

---

### 🔔 Price Alerts
![Alerts](https://github.com/user-attachments/assets/493e1f85-25ff-4a8a-a47b-2f021eee1938)
*Create alerts and get real-time toast notifications when triggered*


| Portfolio | Analytics |
|-----------|-----------|
| Holdings with live P&L <img width="1724" height="883" alt="image" src="https://github.com/user-attachments/assets/3372f384-e9d6-4de0-aad0-66c88209a271" />
 | Volatility & correlation heatmap <img width="1717" height="930" alt="image" src="https://github.com/user-attachments/assets/e8096e49-ffb8-4460-a06c-3955dbce646f" />
 |

---

## Tech Stack & Justification

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Framework** | Next.js 16 + TypeScript | App Router, SSR, API routes in one codebase — no separate Express server needed |
| **Styling** | Tailwind CSS v4 | Utility-first, consistent design tokens, no runtime CSS overhead |
| **Database** | PostgreSQL (Supabase) | Relational integrity for user data + time-series friendly for price snapshots |
| **ORM** | Prisma 7 | Type-safe DB queries, auto-generated client, migration support |
| **Cache** | Redis | API response caching prevents hitting CoinGecko's 30 req/min rate limit |
| **Real-time** | Socket.io | WebSocket with auto-reconnect, room broadcasting, 100+ concurrent connections |
| **Auth** | NextAuth.js | JWT sessions, credentials provider, bcrypt password hashing |
| **Charts** | Recharts | Composable React-native charting, SSR-compatible |
| **Worker** | tsx + node-cron | Lightweight TypeScript runner for background price fetching |
| **Container** | Docker + Compose | One-command production setup with service isolation |

---

## Architecture

## Architecture

\`\`\`
<img width="438" height="650" alt="image_2026-05-22_094150525" src="https://github.com/user-attachments/assets/5eadfd42-7bd2-471a-b1b0-a68267347afe" />

\`\`\`

---

## Features

### ✅ Live Market Dashboard
- Real-time price table for 10+ cryptocurrencies
- Sparkline charts showing 24h price movement
- Color-coded changes — green up ↑, pink down ↓
- Auto-updates every 10 seconds without page refresh
- Price trend indicators with animations

### ✅ Detailed Coin View
- Interactive 7-day price chart
- High, low, volatility statistics
- Market cap, volume, circulating supply
- "Set Alert" button linking to alerts page

### ✅ Price Alerts (End-to-End)
- Create alerts: coin + above/below + target price
- Worker checks thresholds every 10 seconds
- Real-time toast notification when triggered via WebSocket
- Alert history tracking — active vs triggered
- Filter by All / Active / Triggered

### ✅ Portfolio Tracker
- Add positions: coin, quantity, purchase price
- Auto-calculate current value using live prices
- P&L in dollars and percentage per position
- Total portfolio value, cost basis, overall return

### ✅ Analytics Dashboard
- 7-day volatility comparison bar chart
- Correlation heatmap (which coins move together)
- Top movers with visual progress bars
- Market overview stats (total cap, avg 24h change)

### ✅ Production Ready
- JWT authentication with bcrypt password hashing
- Redis caching — avoids CoinGecko rate limits
- Database indexes on frequently queried fields
- Graceful degradation if CoinGecko API is down
- WebSocket auto-reconnect with polling fallback
- Docker Compose — one command startup

---

## Quick Start

### Prerequisites
- Docker Desktop installed and running
- Git

### One-Command Setup

```bash
# 1. Clone the repository
git clone https://github.com/Tabishhaider72/CryptoIQ-Real-Time-Crypto-Market-Intelligence.git
cd CryptoIQ-Real-Time-Crypto-Market-Intelligence

# 2. Copy environment variables
cp .env.example .env
# Edit .env with your values (database URL, API keys, etc.)

# 3. Start everything
docker compose up

# Application is now running at:
# → Frontend:       http://localhost:3000
# → Socket Server:  http://localhost:4001
# → Redis:          localhost:6379
```

### Local Development

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma generate

# Start all services concurrently
pnpm dev

# This starts:
# [0] Next.js dev server    → http://localhost:3000
# [1] Socket.io server      → http://localhost:4001
# [2] Background worker     → fetches every 10 seconds
```

---

## Demo Credentials

Email:    demo@kuvaka.io
Password: demo123

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ✅ | Register new user |
| `POST` | `/api/auth/login` | ✅ | Login with credentials |
| `GET` | `/api/prices/live` | ✅ | Live prices for 10 coins |
| `GET` | `/api/prices/history/:coinId` | ✅ | 7-day price history |
| `POST` | `/api/alerts` | ✅ | Create price alert |
| `GET` | `/api/alerts` | ✅ | Get user's alerts |
| `DELETE` | `/api/alerts` | ✅ | Delete alert |
| `POST` | `/api/portfolio` | ✅ | Add portfolio position |
| `GET` | `/api/portfolio` | ✅ | Portfolio with P&L |
| `DELETE` | `/api/portfolio` | ✅ | Remove position |
| `GET` | `/api/admin/health` | ❌ | System health check |

---

## Environment Variables

See `.env.example` for all required variables.

```bash
# Database (Supabase PostgreSQL)
DATABASE_URL=
DIRECT_URL=

# Authentication
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Cache
REDIS_URL=redis://redis:6379

# CoinGecko API
COINGECKO_API_URL=https://api.coingecko.com/api/v3
COINGECKO_API_KEY=

# WebSocket
NEXT_PUBLIC_SOCKET_URL=http://localhost:4001
```

---

## Project Structure

```
crypto-market/
├── app/                          # Next.js App Router pages
│   ├── api/                      # REST API routes
│   │   ├── alerts/               # Alert CRUD
│   │   ├── portfolio/            # Portfolio CRUD + P&L
│   │   ├── prices/               # Live + history endpoints
│   │   └── auth/                 # NextAuth + register
│   ├── dashboard/                # Live market page
│   ├── alerts/                   # Alerts management page
│   ├── portfolio/                # Portfolio tracker page
│   └── analytics/                # Analytics dashboard page
├── backend/
│   ├── socketServer.ts           # Socket.io server (:4001)
│   └── workers/
│       └── priceWorker.ts        # Background price fetcher
├── components/
│   ├── dashboard/                # CryptoTable, CoinRow, Sparkline
│   ├── layout/                   # Navbar, DashboardLayout
│   └── ui/                       # Reusable UI components
├── hooks/
│   ├── useLivePrices.ts          # WebSocket + polling fallback
│   └── useAlertListener.ts       # Alert toast notifications
├── lib/
│   ├── coingecko.ts              # CoinGecko API + Redis cache
│   ├── prisma.ts                 # Prisma client singleton
│   ├── redis.ts                  # Redis client
│   └── auth.ts                   # NextAuth config
├── prisma/
│   └── schema.prisma             # Database schema
├── Dockerfile                    # Multi-stage production build
├── docker-compose.yml            # 3-service orchestration
└── .env.example                  # Environment template
```

---

## WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `prices:update` | Server → Browser | Live price data every 10s |
| `alert:trigger` | Server → Browser | Alert threshold crossed |

---

## Known Limitations & Future Improvements

- **WebSocket on Vercel**: The live demo uses polling fallback since Vercel serverless cannot run persistent Socket.io processes. Real-time WebSocket works fully in Docker and local development.
- **No email notifications**: Alerts notify via WebSocket toast only — email/SMS would be added with more time using services like Resend or Twilio.
- **Single database**: For scale, price snapshots would move to a time-series database like TimescaleDB.
- **No test coverage**: Critical path tests would be added with Vitest — alert triggering logic, price fetch retry, auth flows.

---

## Time Breakdown

| Area | Time |
|------|------|
| Backend + API + Worker | ~10h |
| Frontend + UI/UX | ~14h |
| Docker + DevOps | ~4h |
| Real-time + WebSocket | ~4h |
| Documentation | ~2h |
| **Total** | **~34h** |

---


<div align="center">

Built with ❤️ by **Tabish Haider**

[Live Demo](https://crypto-eye-nine.vercel.app) · [GitHub](https://github.com/Tabishhaider72/CryptoIQ-Real-Time-Crypto-Market-Intelligence)

</div>
