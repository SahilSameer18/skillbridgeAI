# SkillBridge AI

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![React Version](https://img.shields.io/badge/React-19.2-61dafb.svg?logo=react&style=for-the-badge)](https://react.dev/)
[![Tailwind Version](https://img.shields.io/badge/Tailwind-4.2-38bdf8.svg?logo=tailwindcss&style=for-the-badge)](https://tailwindcss.com/)
[![Express Version](https://img.shields.io/badge/Express-5.2-000000.svg?logo=express&style=for-the-badge)](https://expressjs.com/)
[![Redis Version](https://img.shields.io/badge/Redis-Cloud-DC382D.svg?logo=redis&style=for-the-badge)](https://redis.io/)
[![Google OAuth](https://img.shields.io/badge/OAuth-Google-4285F4.svg?logo=google&style=for-the-badge)](https://developers.google.com/identity)
[![AI Integration](https://img.shields.io/badge/Gemini--AI-Structured-red.svg?logo=googlegemini&style=for-the-badge)](https://ai.google.dev/)

SkillBridge AI is a full-stack interview preparation platform that transforms a resume and job description into a structured, AI-powered career readiness report.

It combines secure account management, **Google OAuth 2.0 Single Sign-On**, **User Profile Workspace with DiceBear Avatars**, PDF resume parsing, Google Gemini AI analysis, and a modern React dashboard to help candidates prepare for technical and behavioral interviews.

---

## 📋 Table of Contents

- [🎯 What SkillBridge AI Solves](#-what-skillbridge-ai-solves)
- [⚡ Technical Highlights](#-technical-highlights)
- [🏗️ Architecture](#-architecture)
- [✨ Core Features](#-core-features)
- [🛠 Tech Stack](#-tech-stack)
- [💾 Database Schema](#-database-schema)
- [🔗 API Reference](#-api-reference)
- [⚙️ Prerequisites](#️-prerequisites)
- [🚀 Local Setup](#-local-setup)
- [💼 Available Scripts](#-available-scripts)
- [📄 License](#-license)

---

## 🎯 What SkillBridge AI Solves

Job seekers often struggle to translate their resume into interview readiness. SkillBridge AI closes this gap by analyzing your resume and job description with Google Gemini AI — delivering a match score, ranked skill gaps with curated learning resources, practice questions with model answers, and a multi-day preparation roadmap, all saved to your account for future reference.

---

## ⚡ Technical Highlights

- **Structured AI Output:** Backend prompts Google Gemini to return a strict JSON payload containing `matchScore`, `technicalQuestions`, `behavioralQuestions`, `skillGaps`, `preparationPlan`, and `title`.
- **Deterministic Skill-Resource Matching:** Each AI-generated skill gap is resolved server-side against a seeded, normalized `Skill` catalog — using bounded keyword matching (with a word-boundary check that prevents false positives like "Java" matching inside "JavaScript") and a Levenshtein-based fuzzy fallback for typos. No prompt changes, no AI-generated URLs — every resource link is pre-curated and verified.
- **Google OAuth & Secure Account Linking:** Integrated Google OAuth 2.0 using `@react-oauth/google` (`useGoogleLogin` implicit flow) with a fully custom-styled button. Access tokens are verified server-side via Google's `/oauth2/v3/userinfo` endpoint. Features a 409 conflict detection flow — Register redirects to Login with the pending token stored in `sessionStorage` so candidates can link Google to an existing credential account without losing context. Google profile pictures are always synced on login, including removal (reverts to DiceBear).
- **Dynamic DiceBear Avatar Generation:** Automatically renders custom vector robot avatars (`https://api.dicebear.com/7.x/bottts/svg?seed=${username}`) as a **frontend-only display fallback** whenever a profile image is absent or fails to load. DiceBear URLs are never stored in the database — the server always stores the real Google picture URL or `null`.
- **User Profile Console:** Dedicated `/profile` workspace featuring candidate preparation analytics (Total Audited Roles, Average Compatibility Score, Top Match Score), profile field updates (with space restrictions), and password security.
- **High-Performance Redis Caching:** Integrated Redis Cloud to handle rate limiting, lightning-fast user profile caching, and a self-expiring JWT token blacklist, improving security and database read performance.
- **Dynamic On-Demand PDF Engine & Vendor Chunking:** Client-side PDF export powered by `@react-pdf/renderer` is dynamically loaded via asynchronous `import()`. The ~1.29 MB layout engine is never downloaded during standard browsing — it is fetched strictly when the user clicks "Download PDF". Configured Vite Rollup `manualChunks` (`vendor-react`, `vendor-icons`, `vendor-toast`, `vendor-zod`) for optimal HTTP caching.
- **Database Compound Indexing ($O(\log N)$ Queries):** Optimized `InterviewReport` queries with a compound PostgreSQL index `@@index([userId, createdAt(sort: Desc)])`, enabling single-scan sorted reads and instant dashboard pagination.
- **Unified API Response Schema & Sanitized Error Logging:** Enforces a consistent `{ success, message, data / errors }` JSON contract. In production, database internals and sensitive stack traces are masked, and unauthenticated guest 401 pings are silenced to maintain clean diagnostic logs.
- **Targeted React Component Memoization:** Key interactive components (`ReportCard`, `QuestionCard`, `SkillGapCard`, `RoadmapDay`, `ScoreRing`) are wrapped in `React.memo` with memoized handlers (`useCallback`), preventing unnecessary re-renders during tab switches and dashboard search filtering.
- **Responsive Sticky Layout Architecture:** Desktop viewport features a sticky in-container sidebar with live badge counts and animated match rating ring, paired with a touch-friendly horizontal scroll pill navigation on mobile (`overflow-x: clip`).
- **PostgreSQL + Prisma ORM:** Type-safe database layer using Prisma ORM with PostgreSQL hosted on Neon, enabling efficient relational queries and schema migrations.

---

```mermaid
flowchart LR

    User([User])

    subgraph Frontend["Frontend (React 19 + Vite)"]
        UI[React Components]
        Router[React Router]
        Context[Context API]
        OAuth[Google OAuth Provider]
        Forms[React Hook Form + Zod]
        PDF[Client-Side PDF Engine<br/>@react-pdf/renderer]
    end

    subgraph Backend["Express 5 API"]
        API[REST Controllers]
        Auth[JWT + OAuth Middleware]
        Middleware[Zod Validation<br/>Rate Limiter]
        Services[Business Services]
        Matcher[Skill Matcher Service]
    end

    subgraph Database["Database"]
        Prisma[Prisma ORM]
        DB[(PostgreSQL · Neon)]
        RedisCache[(Redis Cloud)]
    end

    subgraph External["External Services"]
        GoogleOAuth[Google Identity Services]
        Gemini[Google Gemini AI]
        DiceBear[DiceBear Avatar API]
        Parser[pdf-parse]
    end

    User --> UI
    UI --> Router
    UI --> Context
    UI --> OAuth
    UI --> Forms

    OAuth -->|Google Access Token| GoogleOAuth
    Forms -->|HTTPS / REST| API
    Context -->|HTTP-only JWT Cookie| Auth

    API --> Middleware
    Middleware --> Services
    
    Auth --> RedisCache
    Middleware --> RedisCache

    Services --> Gemini
    Services --> Parser
    Services --> Matcher
    Services --> DiceBear

    Matcher --> Prisma
    Services --> Prisma
    Prisma --> DB
```

---

## ⚠️ Known Trade-off: Redis Fail-Open Behavior

Rate limiting, the token blacklist, and the user cache are all backed by Redis. If Redis becomes unreachable, all three fail **open** rather than closed — meaning the app keeps functioning normally instead of blocking every request. Practically, this means:

- Rate limits are not enforced during a Redis outage.
- A logged-out token could remain valid until it naturally expires.
- User revalidation falls back to a direct database read on every request.

This is intentional: keeping the core application available takes priority over strict enforcement of these secondary security and performance layers, since the primary auth mechanism (JWT signature verification) remains unaffected either way.

---

## 📁 Project Structure

```text
skillBridgeAI/
├── client/
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── assets/
│       ├── components/
│       │   ├── auth/
│       │   ├── layout/
│       │   └── ui/
│       ├── context/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       │   ├── auth/
│       │   ├── dashboard/
│       │   ├── form/
│       │   ├── home/
│       │   ├── interviewReports/
│       │   └── profile/
│       ├── routes/
│       ├── schemas/
│       │   ├── auth.schema.js
│       │   └── profile.schema.js
│       ├── services/
│       │   ├── auth.api.js
│       │   ├── interview.api.js
│       │   └── user.api.js
│       └── styles/
└── server/
    ├── package.json
    ├── prisma/
    │   ├── schema.prisma
    │   ├── seed.js
    │   └── migrations/
    ├── prisma.config.ts
    ├── server.js
    └── src/
        ├── app.js
        ├── config/
        │   └── redis.constants.js
        ├── controllers/
        │   ├── auth.controller.js
        │   ├── interview.controller.js
        │   └── user.controller.js
        ├── lib/
        │   ├── redis.js
        │   └── safeRedis.js
        ├── middlewares/
        ├── routes/
        │   ├── auth.routes.js
        │   ├── interview.routes.js
        │   └── user.routes.js
        ├── schemas/
        │   ├── auth.schema.js
        │   ├── interview.schema.js
        │   └── user.schema.js
        ├── services/
        │   ├── blacklist.service.js
        │   └── userCache.service.js
        └── utils/
```

---

## ✨ Core Features

### 🔑 Google OAuth & Account Security

- **Google Single Sign-On:** Instant one-click authentication with Google.
- **Account Linking:** Prevents automatic merging on email collisions — prompts users to sign in with their password to link their Google account securely.
- **Multi-Provider Architecture:** Relational groundwork for expanding to GitHub and other OAuth providers.

### 👤 Profile Workspace & Avatar Management

- **User Profile Dashboard (`/profile`):** View identity details, joined date, connected providers, and candidate prep analytics.
- **DiceBear SVG Avatar Generator:** Dynamic vector bot avatars generated automatically for password accounts or image load errors.
- **Profile Customization:** Edit username (with no-spaces validation) and custom avatar URL.
- **Password Controls:** Change password for credential accounts with bcrypt hashing.

### 🤖 AI Interview Analyzer & Interactive Strategy Console

- Upload a resume PDF or paste candidate skills
- Paste the target job description
- Generate a tailored, multi-section interview report featuring:
  - **Dynamic Match Score Ring:** Animated SVG circular progress indicator evaluating candidate alignment.
  - **Technical Interview Questions:** Deep-dive technical questions with recruiter intent breakdown and STAR model answers.
  - **Behavioral Questions:** Leadership & situational scenarios with 1-click answer copy functionality.
  - **Ranked Skill Gaps:** Priority-tagged gaps (High, Medium, Low) enriched with verified YouTube guides and official documentation links.
  - **10-Day Action Plan:** Structured day-by-day checklist with milestone timeline visualization.
  - **Client-Side Vector PDF:** Instant, high-resolution downloadable PDF report with zero server latency.

### 🧭 Responsive Navigation & Viewport Architecture

- **Sticky Sidebar on Desktop:** Pinned in-container sidebar with section badges and persistent match score rating widget.
- **Touch-Friendly Mobile Tabs:** Horizontal scrollable pills with active indicators and item count badges.
- **Hardware-Accelerated Fluid Layout:** Uses `overflow-x: clip` to ensure smooth CSS `position: sticky` behavior across all devices.

### 📚 Curated Learning Resources

- every identified skill gap is matched server-side against a seeded, normalized skill catalog
- word-boundary-aware matching avoids false positives (e.g. "Go" inside "Django")
- matched gaps are enriched with one official documentation link and one video tutorial
- unmatched gaps are simply left without resources — no guessed or AI-generated links
- resource data lives in dedicated `Skill` / `LearningResource` tables, fully decoupled from the AI provider

### 🔐 Authentication & Security

- register, login, and logout flows with Google OAuth 2.0 integration
- HTTP-only auth cookie stored by the backend
- authenticated route guard for protected app sections
- Redis-backed token blacklist support on logout for maximum security
- sanitized production error logging with masked database internals

### 📂 Report Management

- save generated reports automatically with compound database indexing
- view all past reports in a search-enabled dashboard with memoized report cards
- open detailed report pages for each saved analysis
- delete reports with instant optimistic feedback

### 📄 Resume & Job Compatibility

- parse candidate resumes from PDF uploads (`pdf-parse`)
- compare resume content to the posted job description

---

## 🛠️ Tech Stack

### Frontend

- React 19
- Vite 7 (with Rollup `manualChunks` vendor splitting)
- Tailwind CSS v4
- `@react-pdf/renderer` (Dynamic on-demand client-side PDF engine)
- `@react-oauth/google`
- React Router DOM 7
- Zod (client validation)
- Axios

### Backend

- Node.js
- Express 5
- PostgreSQL (via Neon)
- Redis Cloud (Caching, Rate Limiting, Blacklisting)
- Prisma ORM (with compound `@@index([userId, createdAt(sort: Desc)])`)
- Google OAuth2 (`/oauth2/v3/userinfo` — no extra library needed)
- Zod (request validation)
- @google/genai
- pdf-parse
- express-rate-limit
- bcryptjs
- jsonwebtoken
- multer

---

## 💾 Database Schema

Managed with **Prisma ORM** on **PostgreSQL (Neon)**. Full schema at [`server/prisma/schema.prisma`](server/prisma/schema.prisma).

| Model                | Key Fields                                                                                              | Indexing & Optimization |
| --------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------- |
| `User`                | `id`, `username`, `email`, optional `password`, optional `avatar` → has many `OAuthProvider`, `InterviewReport` | `id` (PK), `email` (Unique) |
| `OAuthProvider`       | `id`, `userId`, `providerName`, `providerId` → `@unique([providerName, providerId])`, belongs to `User`  | `@@index([providerName, providerId])`, `@@index([userId])` |
| `InterviewReport`     | `matchScore`, `title`, `jobDescription`, `resume` → belongs to `User`                                    | **`@@index([userId, createdAt(sort: Desc)])`** (Compound Index) |
| `TechnicalQuestion`   | `question`, `intention`, `answer` → belongs to `InterviewReport`                                          | `interviewReportId` (FK) |
| `BehavioralQuestion`  | `question`, `intention`, `answer` → belongs to `InterviewReport`                                          | `interviewReportId` (FK) |
| `SkillGap`            | `skill`, `severity` (`low \| medium \| high`), optional `skillRef` → belongs to `InterviewReport`, optionally links to a `Skill` | `interviewReportId` (FK), `skillId` (FK) |
| `Skill`               | `name` (unique), `aliases` → has many `LearningResource`, has many `SkillGap`                              | `name` (Unique) |
| `LearningResource`    | `type` (`DOCUMENTATION \| VIDEO`), `title`, `url` → belongs to `Skill`                                     | `skillId` (FK) |
| `PreparationPlan`     | `day`, `focus`, `tasks` (JSON array) → belongs to `InterviewReport`                                        | `interviewReportId` (FK) |
| `TokenBlacklist`      | `token`, `expiresAt` (auto-expires after 1 day)                                                            | `token` (PK / Unique) |

All relations use `onDelete: Cascade`, except `SkillGap.skillRef → Skill`, which uses `onDelete: SetNull` — deleting a seeded skill never deletes historical skill gap records, it just clears the link. IDs are `cuid()`.

---

## 🔗 API Reference

### Auth Endpoints

- `POST /api/auth/register` - create a new user
- `POST /api/auth/login` - sign in and receive secure auth cookie
- `POST /api/auth/google` - Google OAuth authentication & account creation
- `POST /api/auth/link-google` - Link Google account to existing user account
- `POST /api/auth/logout` - revoke session and blacklist token (**requires auth cookie**)
- `GET /api/auth/get-me` - return current user profile

### User Profile Endpoints

- `GET /api/user/profile` - fetch current user profile & candidate preparation analytics
- `PUT /api/user/profile` - update username, email, and avatar URL
- `PUT /api/user/change-password` - change account password (credential accounts)

### Interview Endpoints

- `POST /api/interview/` - generate a new AI interview report (`multipart/form-data`, optional `resume` file). Each returned skill gap includes a `skillRef` object (with `resources`) when a match is found, or `null` when it isn't.
- `GET /api/interview/` - list all saved reports for the authenticated user
- `GET /api/interview/report/:interviewId` - fetch a single report detail, including skill gap resources
- `DELETE /api/interview/:interviewId` - delete a saved report

---

## ⚙️ Prerequisites

Make sure you have the following installed before running the project:

| Tool    | Minimum Version    |
| ------- | ------------------ |
| Node.js | 18.x or higher     |
| npm     | 9.x or higher      |
| Git     | any recent version |

> A [Neon](https://neon.tech/) account is also required for the PostgreSQL database, a [Redis Cloud](https://redis.io/) account for caching, and a [Google AI Studio](https://aistudio.google.com/) account for the Gemini API key.

---

## 🚀 Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/SahilSameer18/skillbridgeAI.git
cd skillbridgeAI
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file in `server/` with:

```env
DATABASE_URL=postgresql://user:password@host/database
DIRECT_URL=postgresql://user:password@host/database
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_google_genai_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
REDIS_URL=rediss://default:password@host:port
```

> Note: the backend currently listens on port `3000` in [`server/server.js`](server/server.js), so `PORT` is not used yet.

### 3. Setup Prisma & Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the skill resource catalog (documentation + video links for common skills)
npx prisma db seed
```

> The seed step populates the `Skill` and `LearningResource` tables used to attach learning resources to matched skill gaps. Without it, skill gaps will still generate normally, just without any attached resources.

### 4. Frontend setup

```bash
cd ../client
npm install
```

Create a `.env.development` file in `client/` with:

```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### 5. Start both apps

Open two terminal windows:

```bash
cd server
npm run dev
```

The API will run on `http://localhost:3000`.

```bash
cd client
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## 💼 Available Scripts

### Backend (`server/`)

- `npm run dev` - start Express with Nodemon
- `npm start` - run production server with Node
- `npx prisma db seed` - seed/refresh the `Skill` and `LearningResource` catalog

### Frontend (`client/`)

- `npm run dev` - start Vite dev server
- `npm run build` - build the production bundle
- `npm run lint` - run ESLint
- `npm run preview` - preview the production build

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">Built by Sahil Sameer Siddique.</p>

