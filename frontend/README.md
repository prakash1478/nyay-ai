# Nyaya AI — Legal Assistant (Frontend)

A production-ready **frontend-only** React application for an AI-powered legal assistant, covering an AI chatbot, a document risk analyzer, and a "Know Your Rights" library. No backend, Python, or Firebase Functions are included — this is UI only, wired to mock services that are easy to swap for real endpoints.

## Tech Stack

- React 18 (Vite)
- Tailwind CSS (custom "legal brief" design system — ink navy, parchment, brass gold, emerald, crimson)
- React Router DOM v6
- Axios (service layer, mocked)
- React Icons + Lucide Icons
- Framer Motion
- Firebase Authentication (Google Sign-In + email/password)
- React Hook Form
- React Hot Toast

## Getting Started

```bash
npm install
cp .env.example .env   # add your Firebase config (optional — app runs in demo mode without it)
npm run dev
```

If `.env` is left empty, authentication automatically falls back to a **local demo mode** (stored in `localStorage`) so the entire UI can be explored without a live Firebase project.

## Folder Structure

```
src/
  components/   # Reusable UI, grouped by domain (common, auth, landing, chatbot, documentAnalyzer, rights)
  pages/        # Route-level views
  layouts/      # Shell layouts (Main, Auth, Dashboard, Chat)
  hooks/        # Custom hooks (useAuth, useTheme, useLanguage, useSpeechToText, …)
  contexts/     # Context API providers (Auth, Theme, Language)
  services/     # Axios instance + firebase.js + mocked API calls
  utils/        # Constants, helpers, validators
  routes/       # AppRoutes.jsx (React Router config)
  data/         # Static content (rights categories, suggested questions)
  styles/       # Tailwind entrypoint + component classes
```

## Modules

1. **AI Legal Chatbot** (`/chatbot`) — chat bubbles, typing indicator, voice typing (Web Speech API), 5-language selector, suggested questions, sidebar chat history, stop generation, copy response, clear chat.
2. **Document Analyzer** (`/document-analyzer`) — drag & drop upload (PDF/DOCX/TXT/image), progress bar, risk score meter, key clauses, highlighted risks, plain-language summary, downloadable `.txt` summary.
3. **Know Your Rights** (`/know-your-rights`) — 8 categories (Women, Consumer, Employment, Tenant, Cyber Crime, Senior Citizens, Students, Workers), each with rights, related Acts, emergency contacts, and FAQs.

## Connecting a Real Backend

Replace the mocked functions in `src/services/api.js` (`sendChatMessage`, `analyzeDocument`) with real Axios calls against your backend, and set `VITE_API_BASE_URL` in `.env`.

## Notes

- All authentication runs through `src/contexts/AuthContext.jsx`, which wraps Firebase Auth (`src/services/firebase.js`). Google Sign-In, email/password sign up & login, and password reset are implemented.
- Dark mode is a `class`-based Tailwind strategy, toggled via `ThemeContext` and persisted to `localStorage`.
- The app is fully responsive down to small mobile viewports.
