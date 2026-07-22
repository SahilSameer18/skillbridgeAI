# SkillBridge AI

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![React Version](https://img.shields.io/badge/React-19.2-61dafb.svg?logo=react&style=for-the-badge)](https://react.dev/)
[![Tailwind Version](https://img.shields.io/badge/Tailwind-4.2-38bdf8.svg?logo=tailwindcss&style=for-the-badge)](https://tailwindcss.com/)
[![Express Version](https://img.shields.io/badge/Express-5.2-000000.svg?logo=express&style=for-the-badge)](https://expressjs.com/)
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
- **Google OAuth & Secure Account Linking:** Integrated Google Identity Services (GIS) using `@react-oauth/google` and `google-auth-library`. Features a 409 account linking flow that prevents unauthorized automatic account merging while letting candidates link Google to existing accounts.
- **Dynamic DiceBear Avatar Generation:** Automatically assigns custom vector robot avatars (`https://api.dicebear.com/7.x/bottts/svg?seed=${username}`) as a default or fallback whenever a profile image is missing or fails to load.
- **User Profile Console:** Dedicated `/profile` workspace featuring candidate preparation analytics (Total Audited Roles, Average Compatibility Score, Top Match Score), profile field updates (with space restrictions), and password security.
- **Secure Session Management:** JWT-based auth is stored as an HTTP-only cookie and validated with a token blacklist.
- **API Rate Limiting:** Express rate-limit middleware protects the login endpoint, account linking, and AI generation calls from abuse.
- **Input Validation:** Zod schemas validate auth, profile, and interview payloads on both client (`profile.schema.js`) and server (`user.schema.js`), ensuring consistent request data, no spaces in usernames, and user form validation.
- **PDF Resume Parsing:** Uploaded resumes are parsed using `pdf-parse`, then analyzed alongside job descriptions.
- **Downloadable Resume Export:** Generated resume HTML is converted to PDF through Puppeteer for a polished candidate asset.
- **Protected React Routing:** Authenticated flows use React Router and a `Protected` wrapper for `/generate`, `/dashboard`, `/profile`, and report detail routes.
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
    end

    subgraph External["External Services"]
        GoogleOAuth[Google Identity Services]
        Gemini[Google Gemini AI]
        DiceBear[DiceBear Avatar API]
        Parser[pdf-parse]
        PDF[Puppeteer PDF Generator]
    end

    User --> UI
    UI --> Router
    UI --> Context
    UI --> OAuth
    UI --> Forms

    OAuth -->|Google ID Token| GoogleOAuth
    Forms -->|HTTPS / REST| API
    Context -->|HTTP-only JWT Cookie| Auth

    API --> Middleware
    Middleware --> Services

    Services --> Gemini
    Services --> Parser
    Services --> PDF
    Services --> Matcher
    Services --> DiceBear

    Matcher --> Prisma
    Services --> Prisma
    Prisma --> DB
```

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
        ├── controllers/
        │   ├── auth.controller.js
        │   ├── interview.controller.js
        │   └── user.controller.js
        ├── lib/
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

### 🤖 AI Interview Analyzer

- Upload a resume PDF
- Paste the target job description
- Generate a tailored report with:
  - match score
  - technical interview questions + model answers
  - behavioral interview questions + intent guidance
  - skill gaps ranked by severity, each enriched with curated learning resources
  - multi-day preparation roadmap
  - downloadable resume PDF

### 📚 Curated Learning Resources

- every identified skill gap is matched server-side against a seeded, normalized skill catalog
- word-boundary-aware matching avoids false positives (e.g. "Go" inside "Django")
- matched gaps are enriched with one official documentation link and one video tutorial
- unmatched gaps are simply left without resources — no guessed or AI-generated links
- resource data lives in dedicated `Skill` / `LearningResource` tables, fully decoupled from the AI provider

### 🔐 Authentication & Security

- register, login, and logout flows
- HTTP-only auth cookie stored by the backend
- authenticated route guard for protected app sections
- token blacklist support on logout

### 📂 Report Management

- save generated reports automatically
- view all past reports in a dashboard
- open detailed report pages for each saved analysis
- delete reports when no longer needed

### 📄 Resume & Job Compatibility

- parse candidate resumes from PDF uploads
- compare resume content to the posted job description

---

## 🛠️ Tech Stack

### Frontend

- React 19
- Vite 7
- Tailwind CSS v4
- `@react-oauth/google`
- React Router DOM 7
- Zod (client validation)
- Axios

### Backend

- Node.js
- Express 5
- PostgreSQL (via Neon)
- Prisma ORM
- `google-auth-library`
- Zod (request validation)
- @google/genai
- Puppeteer
- pdf-parse
- express-rate-limit
- bcryptjs
- jsonwebtoken
- multer

---

## 💾 Database Schema

Managed with **Prisma ORM** on **PostgreSQL (Neon)**. Full schema at [`server/prisma/schema.prisma`](server/prisma/schema.prisma).

| Model                | Key Fields                                                                                              |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| `User`                | `id`, `username`, `email`, optional `password`, optional `avatar` → has many `OAuthProvider`, `InterviewReport` |
| `OAuthProvider`       | `id`, `userId`, `providerName`, `providerId` → `@unique([providerName, providerId])`, belongs to `User`  |
| `InterviewReport`     | `matchScore`, `title`, `jobDescription`, `resume` → belongs to `User`                                    |
| `TechnicalQuestion`   | `question`, `intention`, `answer` → belongs to `InterviewReport`                                          |
| `BehavioralQuestion`  | `question`, `intention`, `answer` → belongs to `InterviewReport`                                          |
| `SkillGap`            | `skill`, `severity` (`low \| medium \| high`), optional `skillRef` → belongs to `InterviewReport`, optionally links to a `Skill` |
| `Skill`               | `name` (unique), `aliases` → has many `LearningResource`, has many `SkillGap`                              |
| `LearningResource`    | `type` (`DOCUMENTATION \| VIDEO`), `title`, `url` → belongs to `Skill`                                     |
| `PreparationPlan`     | `day`, `focus`, `tasks` (JSON array) → belongs to `InterviewReport`                                        |
| `TokenBlacklist`      | `token`, `expiresAt` (auto-expires after 1 day)                                                            |

All relations use `onDelete: Cascade`, except `SkillGap.skillRef → Skill`, which uses `onDelete: SetNull` — deleting a seeded skill never deletes historical skill gap records, it just clears the link. IDs are `cuid()`.

---

## 🔗 API Reference

### Auth Endpoints

- `POST /api/auth/register` - create a new user
- `POST /api/auth/login` - sign in and receive secure auth cookie
- `POST /api/auth/google` - Google OAuth authentication & account creation
- `POST /api/auth/link-google` - Link Google account to existing user account
- `POST /api/auth/logout` - revoke session and blacklist token
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
- `POST /api/interview/resume/pdf/:interviewReportId` - generate and download resume PDF from saved report

---

## ⚙️ Prerequisites

Make sure you have the following installed before running the project:

| Tool    | Minimum Version    |
| ------- | ------------------ |
| Node.js | 18.x or higher     |
| npm     | 9.x or higher      |
| Git     | any recent version |

> A [Neon](https://neon.tech/) account is also required for the PostgreSQL database, and a [Google AI Studio](https://aistudio.google.com/) account for the Gemini API key.

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
