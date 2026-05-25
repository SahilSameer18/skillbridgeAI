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
- [🏗️ Architecture](#️-architecture)
- [✨ Core Features](#-core-features)
- [🛠 Tech Stack](#-tech-stack)
- [💾 Database Schema](#-database-schema)
- [🔗 API Reference](#-api-reference)
- [🚀 Local Setup](#-local-setup)
- [💼 Available Scripts](#-available-scripts)
- [📄 License](#-license)

---

## 🎯 What SkillBridge AI Solves

Job seekers often struggle to translate their resume into interview readiness. SkillBridge AI closes this gap by:

- converting resume content and job descriptions into specific AI-driven feedback
- producing a match score, skill gaps, and practice questions
- giving candidates a saved preparation plan with technical and behavioral coaching
- storing reports so users can return to past interview prep anytime

---

## ⚡ Technical Highlights

- **Structured AI Output:** Backend prompts Google Gemini to return a strict JSON payload containing `matchScore`, `technicalQuestions`, `behavioralQuestions`, `skillGaps`, `preparationPlan`, and `title`.
- **Secure Session Management:** JWT-based auth is stored as an HTTP-only cookie and validated with a token blacklist.
- **PDF Resume Parsing:** Uploaded resumes are parsed using `pdf-parse`, then analyzed alongside job descriptions and self-descriptions.
- **Downloadable Resume Export:** Generated resume HTML is converted to PDF through Puppeteer for a polished candidate asset.
- **Protected React Routing:** Authenticated flows use React Router and a `Protected` wrapper for `/generate`, `/dashboard`, and report detail routes.

---

## 🏗️ Architecture

```mermaid
flowchart TD
  Client[React 19 + Vite + Tailwind] -->|HTTPS/CORS| Server[Express 5 API]
  Server -->|Mongoose| MongoDB[(MongoDB)]
  Server -->|Gemini API| Gemini[Google Gemini AI]
  Server -->|Puppeteer| PDF[Resume PDF Generation]
  Client --> Auth[JWT Cookie Auth]
  Client --> Reports[Saved Interview Reports]
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

## 🛠 Tech Stack

### Frontend

- React 19
- Vite 7
- Tailwind CSS v4
- React Router DOM 7
- Axios

### Backend

- Node.js
- Express 5
- MongoDB
- Mongoose
- @google/genai
- Puppeteer
- pdf-parse
- bcryptjs
- jsonwebtoken
- multer

---

## 💾 Database Schema

### User

- `username` (String, unique)
- `email` (String, unique)
- `password` (String, hashed)
- timestamps

### InterviewReport

- `jobDescription` (String)
- `resume` (String)
- `selfDescription` (String)
- `matchScore` (Number)
- `technicalQuestions` (Array of question/intention/answer)
- `behavioralQuestions` (Array of question/intention/answer)
- `skillGaps` (Array of skill/severity)
- `preparationPlan` (Array of day/focus/tasks)
- `title` (String)
- `user` (ObjectId ref)
- timestamps

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
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/skillbridgeai
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_google_genai_key
```

### 3. Frontend setup

```bash
cd ../client
npm install
```

### 4. Start both apps

Open two terminal windows:

```bash
cd server
npm run dev
```

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
