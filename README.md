# NyayAI — AI Legal Assistant

A multilingual AI-powered legal assistant platform for Indian users. Features a legal chatbot, document analysis with OCR, voice-based interaction (STT/TTS), Know Your Rights content, and AI-driven legal document review — all with support for English, Tamil, Hindi, Malayalam, Telugu, and more.

## Architecture

```
nyay-ai/
├── backend/          # Python FastAPI backend (Render)
│   ├── app/
│   │   ├── api/          # Route handlers
│   │   │   ├── auth/         # Google OAuth, JWT
│   │   │   ├── chat/         # Legal chatbot
│   │   │   ├── document/     # Upload, OCR, analyze
│   │   │   ├── rights/       # Know Your Rights
│   │   │   ├── voice/        # STT / TTS
│   │   │   ├── translate/    # Translation
│   │   │   ├── profile/      # User profile
│   │   │   ├── history/      # Chat & document history
│   │   │   └── feedback/     # User feedback
│   │   ├── services/     # Business logic
│   │   ├── database/     # Firestore + Supabase repositories
│   │   ├── models/       # Domain models
│   │   ├── schemas/      # Pydantic request/response schemas
│   │   ├── middleware/    # Auth, rate limiting, error handling
│   │   ├── config/       # Settings, Firebase init
│   │   └── utils/        # Logging, validation, exceptions
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/         # React + Vite frontend (Vercel)
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── services/      # API client (Axios), Firebase
│   │   ├── contexts/      # Auth context
│   │   ├── hooks/         # Custom hooks
│   │   ├── layouts/       # Dashboard layout
│   │   ├── routes/        # App routing
│   │   └── utils/         # Constants, helpers
│   └── package.json
└── supabase_schema.sql    # PostgreSQL schema (Supabase)
```

## Tech Stack

### Backend
- **FastAPI** — REST API framework
- **Firebase Admin SDK** — Authentication & Firestore database
- **Supabase** — PostgreSQL database (optional, for extended storage)
- **LangChain** — LLM orchestration
- **Groq** / **OpenAI** / **Gemini** / **Anthropic** — LLM providers
- **FAISS** — Vector search for RAG-based legal chatbot
- **sentence-transformers** — Text embeddings
- **Whisper** — Speech-to-text
- **EasyOCR** — OCR for scanned documents
- **gTTS** — Text-to-speech
- **SlowAPI** — Rate limiting
- **JWT** (python-jose) — Access & refresh tokens

### Frontend
- **React 18** — UI framework
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **Firebase SDK** — Google Sign-In authentication
- **Axios** — HTTP client with JWT interceptor
- **Framer Motion** — Animations
- **React Hot Toast** — Notifications
- **React Router DOM** — Client-side routing

## Features

| Feature | Description |
|---|---|
| **Legal Chatbot** | Multilingual RAG chatbot answering legal questions using Indian law context |
| **Document Analysis** | Upload PDF, DOCX, TXT, or images; extract text (OCR for images); AI-powered risk analysis |
| **Voice Assistant** | Speech-to-text (Whisper) and text-to-speech (gTTS) in multiple Indian languages |
| **Translation** | Translate legal content between English, Tamil, Hindi, Malayalam, Telugu |
| **Know Your Rights** | Browse legal rights by category (consumer, tenant, women, cyber crime, etc.) |
| **Legal Aid** | Directory of legal aid resources and contacts |
| **Women's Assistant** | Specialized legal help for women's safety and rights |
| **Google Sign-In** | Authentication via Google OAuth + Firebase |

## Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- Firebase project with Authentication & Firestore enabled
- Google Cloud OAuth 2.0 credentials
- LLM API key (Groq, OpenAI, Gemini, or Anthropic)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\Activate
pip install -r requirements.txt
cp .env.example .env
# Fill in your env vars (see below)
python run.py
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Fill in your env vars
npm run dev
```

### Environment Variables

#### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_CREDENTIALS_PATH` | Path to Firebase service account JSON |
| `FIREBASE_SERVICE_ACCOUNT_B64` | Base64-encoded service account JSON (for Render) |
| `JWT_SECRET_KEY` | Secret key for JWT signing |
| `LLM_PROVIDER` | `groq`, `openai`, `gemini`, or `anthropic` |
| `GROQ_API_KEY` | Groq API key (if using Groq) |
| `OPENAI_API_KEY` | OpenAI API key (if using OpenAI) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins |

#### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_API_BASE_URL` | Backend API URL (e.g., `http://localhost:8000/api/v1`) |

## API Endpoints

All endpoints are prefixed with `/api/v1`.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/google` | Google OAuth login |
| `POST` | `/auth/firebase` | Firebase ID token login |
| `POST` | `/auth/refresh` | Refresh JWT access token |
| `GET` | `/auth/me` | Get current user profile |
| `POST` | `/chat` | Send chat message |
| `GET` | `/chat/session/{id}` | Get chat session history |
| `POST` | `/upload` | Upload a document |
| `POST` | `/analyze` | Analyze uploaded document |
| `POST` | `/ocr` | OCR an image |
| `POST` | `/stt` | Speech-to-text |
| `POST` | `/tts` | Text-to-speech |
| `POST` | `/translate` | Translate text |
| `GET` | `/rights/categories` | List rights categories |
| `GET` | `/rights/category/{category}` | Get rights by category |
| `GET` | `/profile` | Get user profile |
| `PUT` | `/profile` | Update user profile |
| `GET` | `/history/chats` | Get chat history |
| `GET` | `/history/documents` | Get document history |
| `GET` | `/history/analyses` | Get analysis history |
| `POST` | `/feedback` | Submit feedback |

## Deployment

### Backend (Render)

1. Connect your GitHub repo to Render
2. Set **Runtime** to **Docker**
3. Set **Dockerfile Path** to `backend/Dockerfile`
4. Add all environment variables from `backend/.env`
5. Deploy

### Frontend (Vercel)

1. Connect your GitHub repo to Vercel
2. Set **Root Directory** to `frontend`
3. Add all environment variables from `frontend/.env`
4. Set `VITE_API_BASE_URL` to your Render backend URL + `/api/v1`
5. Deploy

### Important

- Add your Vercel domain to **Firebase Console** → Authentication → Settings → Authorized domains
- Add your Vercel domain to **Google Cloud Console** → OAuth consent screen → Authorized JavaScript origins
- Set `ALLOWED_ORIGINS` on Render to include your Vercel domain

## License

MIT
