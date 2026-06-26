# SkillBridge AI 🚀

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![React Version](https://img.shields.io/badge/React-19.2-61dafb.svg?logo=react&style=for-the-badge)](https://react.dev/)
[![Tailwind Version](https://img.shields.io/badge/Tailwind-4.2-38bdf8.svg?logo=tailwindcss&style=for-the-badge)](https://tailwindcss.com/)
[![Express Version](https://img.shields.io/badge/Express-5.2-000000.svg?logo=express&style=for-the-badge)](https://expressjs.com/)
[![AI Integration](https://img.shields.io/badge/Gemini--AI-Structured-red.svg?logo=googlegemini&style=for-the-badge)](https://ai.google.dev/)

SkillBridge AI is a full-stack interview preparation platform that transforms a resume and job description into a structured, AI-powered career readiness report.

It combines secure account management, PDF resume parsing, Google Gemini AI analysis, and a modern React dashboard to help candidates prepare for technical and behavioral interviews.

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

Job seekers often struggle to translate their resume into interview readiness. SkillBridge AI closes this gap by analyzing your resume and job description with Google Gemini AI — delivering a match score, ranked skill gaps, practice questions with model answers, and a multi-day preparation roadmap, all saved to your account for future reference.

---

## ⚡ Technical Highlights

- **Structured AI Output:** Backend prompts Google Gemini to return a strict JSON payload containing `matchScore`, `technicalQuestions`, `behavioralQuestions`, `skillGaps`, `preparationPlan`, and `title`.
- **Secure Session Management:** JWT-based auth is stored as an HTTP-only cookie and validated with a token blacklist.
- **API Rate Limiting:** Express rate-limit middleware protects the login endpoint and AI generation calls from abuse.
- **Input Validation:** Zod schemas validate auth and interview payloads on both client and server, ensuring consistent request data and user form validation.
- **PDF Resume Parsing:** Uploaded resumes are parsed using `pdf-parse`, then analyzed alongside job descriptions and self-descriptions.
- **Downloadable Resume Export:** Generated resume HTML is converted to PDF through Puppeteer for a polished candidate asset.
- **Protected React Routing:** Authenticated flows use React Router and a `Protected` wrapper for `/generate`, `/dashboard`, and report detail routes.
- **PostgreSQL + Prisma ORM:** Type-safe database layer using Prisma ORM with PostgreSQL hosted on Neon, enabling efficient relational queries and schema migrations.

---

## 🏗️ Architecture

```mermaid
flowchart TD
  Client[React 19 + Vite + Tailwind] -->|REST API / HTTPS| Server[Express 5 API]
  Server -->|JWT Cookie Auth| Client
  Server -->|Prisma ORM| Database[(PostgreSQL · Neon)]
  Server -->|Gemini API| Gemini[Google Gemini AI]
  Server -->|Puppeteer| PDF[Resume PDF]
  Server -->|Rate Limiting · Zod| Middleware[Request Validation]
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
│       ├── context/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── schemas/
│       ├── services/
│       └── styles/
└── server/
    ├── package.json
    ├── prisma/
    │   ├── schema.prisma
    │   └── migrations/
    ├── prisma.config.ts
    ├── server.js
    └── src/
        ├── app.js
        ├── config/
        ├── controllers/
        ├── lib/
        ├── middlewares/
        ├── routes/
        ├── schemas/
        └── services/
```

---

## ✨ Core Features

### 🤖 AI Interview Analyzer

- Upload a resume PDF or enter a self-description
- Paste the target job description
- Generate a tailored report with:
  - match score
  - technical interview questions + model answers
  - behavioral interview questions + intent guidance
  - skill gaps ranked by severity
  - multi-day preparation roadmap
  - downloadable resume PDF

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
- include optional self-description to supplement missing resume text

---

## 🛠️ Tech Stack

### Frontend

- React 19
- Vite 7
- Tailwind CSS v4
- React Router DOM 7
- Axios

### Backend

- Node.js
- Express 5
- PostgreSQL (via Neon)
- Prisma ORM
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

| Model                | Key Fields                                                                               |
| -------------------- | ---------------------------------------------------------------------------------------- |
| `User`               | `id`, `username`, `email`, `password` → has many `InterviewReport`                       |
| `InterviewReport`    | `matchScore`, `title`, `jobDescription`, `resume`, `selfDescription` → belongs to `User` |
| `TechnicalQuestion`  | `question`, `intention`, `answer` → belongs to `InterviewReport`                         |
| `BehavioralQuestion` | `question`, `intention`, `answer` → belongs to `InterviewReport`                         |
| `SkillGap`           | `skill`, `severity` (`low \| medium \| high`) → belongs to `InterviewReport`             |
| `PreparationPlan`    | `day`, `focus`, `tasks` (JSON array) → belongs to `InterviewReport`                      |
| `TokenBlacklist`     | `token`, `expiresAt` (auto-expires after 1 day)                                          |

All relations use `onDelete: Cascade`. IDs are `cuid()`.

---

## 🔗 API Reference

### Auth Endpoints

- `POST /api/auth/register` - create a new user
- `POST /api/auth/login` - sign in and receive secure auth cookie
- `POST /api/auth/logout` - revoke session and blacklist token
- `GET /api/auth/get-me` - return current user profile

### Interview Endpoints

- `POST /api/interview/` - generate a new AI interview report (`multipart/form-data`, optional `resume` file)
- `GET /api/interview/` - list all saved reports for the authenticated user
- `GET /api/interview/report/:interviewId` - fetch a single report detail
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
```

> Note: the backend currently listens on port `3000` in [`server/server.js`](server/server.js), so `PORT` is not used yet.

### 3. Setup Prisma & Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### 4. Frontend setup

```bash
cd ../client
npm install
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

### Frontend (`client/`)

- `npm run dev` - start Vite dev server
- `npm run build` - build the production bundle
- `npm run lint` - run ESLint
- `npm run preview` - preview the production build

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">Built by Sahil Sameer to help candidates turn resumes into interview-ready AI reports.</p>
