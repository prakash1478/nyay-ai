# AI Legal Assistant — Backend

A production-ready, Python-only backend for a multilingual AI Legal Assistant.
**Backend only** — no frontend/React code is included.

Supports: legal chatbot (English, Tamil, Hindi, Malayalam, Telugu), legal
document analysis (PDF/DOCX/TXT/Images with OCR), Know-Your-Rights content,
voice (STT/TTS), translation, and Google-authenticated user accounts.

---

## Tech Stack

- **FastAPI** — REST API framework
- **Firebase Firestore** — primary database
- **Firebase Authentication / Google OAuth** — identity verification
- **JWT** (python-jose) — access & refresh tokens issued by this backend
- **LangChain + FAISS** — retrieval-augmented legal chatbot
- **Whisper** — speech-to-text
- **EasyOCR** — OCR for scanned documents/images
- **gTTS** — text-to-speech
- **googletrans** — translation
- **PyPDF2 / python-docx / Pillow** — document & image processing
- **slowapi** — rate limiting
- **loguru** — structured logging

---

## Project Structure

```
backend/
├── app/
│   ├── api/                    # Route layer (thin controllers)
│   │   ├── auth/routes.py      # POST /auth/google, /auth/refresh, GET /auth/me
│   │   ├── chat/routes.py      # POST /chat, GET /chat/session/{id}
│   │   ├── document/routes.py  # POST /upload, /ocr, /analyze
│   │   ├── rights/routes.py    # GET /rights/categories, /rights/category/{c}
│   │   ├── voice/routes.py     # POST /stt, /tts
│   │   ├── translate/routes.py # POST /translate
│   │   ├── profile/routes.py   # GET/PUT /profile
│   │   ├── history/routes.py   # GET /history/chats|documents|analyses
│   │   └── feedback/routes.py  # POST/GET /feedback
│   ├── services/                # Business logic
│   │   ├── auth_service.py
│   │   ├── jwt_service.py
│   │   ├── google_oauth_service.py
│   │   ├── chatbot_service.py
│   │   ├── langchain_service.py
│   │   ├── document_service.py
│   │   ├── ocr_service.py
│   │   ├── text_extraction_service.py
│   │   ├── analysis_service.py
│   │   ├── rights_service.py
│   │   ├── translation_service.py
│   │   ├── stt_service.py
│   │   ├── tts_service.py
│   │   ├── feedback_service.py
│   │   ├── user_service.py
│   │   └── history_service.py
│   ├── database/
│   │   ├── firestore_client.py  # Generic Firestore repository (CRUD)
│   │   └── collections.py       # Typed repository instances per collection
│   ├── models/                  # Internal dataclass domain models
│   ├── schemas/                 # Pydantic request/response schemas
│   ├── middleware/
│   │   ├── auth_middleware.py   # JWT bearer auth dependency
│   │   ├── rate_limiter.py      # slowapi limiter
│   │   ├── error_handler.py     # Global exception -> JSON handlers
│   │   └── logging_middleware.py
│   ├── config/
│   │   ├── settings.py          # Pydantic-settings env config
│   │   └── firebase_config.py   # Firebase Admin SDK init
│   ├── utils/
│   │   ├── logger.py, exceptions.py, security.py, validators.py,
│   │   │   file_utils.py, constants.py
│   └── main.py                  # FastAPI app factory
├── run.py                       # `python run.py` entrypoint
├── requirements.txt
├── .env.example
└── README.md
```

---

## Setup

### 1. Clone & create a virtual environment

```bash
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

> **Note:** `openai-whisper` requires `ffmpeg` installed on your system
> (`sudo apt install ffmpeg` / `brew install ffmpeg`). `easyocr` will
> download detection/recognition models on first use — ensure internet
> access on first run.

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in:
- `JWT_SECRET_KEY` — any long random string
- `GOOGLE_CLIENT_ID` — from Google Cloud Console (OAuth 2.0 Client)
- `FIREBASE_CREDENTIALS_PATH` — path to your Firebase service-account JSON
  (download from Firebase Console → Project Settings → Service Accounts →
  Generate new private key). Place the file at
  `app/config/firebase-service-account.json` (or update the path).
- `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`
- `OPENAI_API_KEY` (or `ANTHROPIC_API_KEY` + `LLM_PROVIDER=anthropic`)

### 4. Run the server

```bash
python run.py
# or
uvicorn app.main:app --reload
```

The API will be live at **http://localhost:8000**
Interactive docs: **http://localhost:8000/docs**

---

## Authentication Flow

1. Frontend performs Google Sign-In and obtains a Google **ID token**.
2. Frontend calls `POST /api/v1/auth/google` with `{ "id_token": "..." }`.
3. Backend verifies the token with Google, creates/updates the Firestore
   `users` document, and issues its own **JWT access + refresh tokens**.
4. Frontend sends `Authorization: Bearer <access_token>` on all protected
   requests.
5. When the access token expires, call `POST /api/v1/auth/refresh` with the
   refresh token to get a new access token.

---

## API Overview (prefix: `/api/v1`)

| Module | Endpoints |
|---|---|
| Auth | `POST /auth/google`, `POST /auth/refresh`, `GET /auth/me`, `POST /auth/logout` |
| Chat | `POST /chat`, `GET /chat/session/{session_id}` |
| Document | `POST /upload`, `POST /ocr`, `POST /analyze` |
| Rights | `GET /rights/categories`, `GET /rights/category/{category}`, `GET /rights/search` |
| Voice | `POST /stt`, `POST /tts` |
| Translate | `POST /translate` |
| Profile | `GET /profile`, `PUT /profile` |
| History | `GET /history/chats`, `GET /history/documents`, `GET /history/analyses` |
| Feedback | `POST /feedback`, `GET /feedback` |

All protected routes require a valid `Authorization: Bearer <JWT>` header.

---

## Firestore Collections

`users`, `chat_history`, `rights`, `uploaded_documents`, `document_analysis`,
`notifications`, `feedback`, `sessions` — see `app/utils/constants.py::Collections`.

---

## Security Notes

- JWT secret, Firebase credentials, and LLM API keys must never be committed —
  keep them in `.env` (already gitignored in a real repo).
- Rate limiting is applied per-IP via `slowapi` (configurable via
  `RATE_LIMIT_PER_MINUTE`).
- All uploads are size- and type-validated before processing.
- The chatbot enforces a legal-only scope via a system prompt + heuristic
  keyword pre-filter, and politely declines unrelated questions.
- For multi-instance / production deployments, swap `slowapi`'s in-memory
  store for Redis, and consider Firestore security rules alongside backend
  authorization checks.

---

## Notes on First-Run Model Downloads

- **Whisper** downloads its model weights (e.g. `base` ≈ 140MB) on first
  transcription call.
- **EasyOCR** downloads detection/recognition weights on first OCR call.
- **sentence-transformers** (used for FAISS embeddings) downloads its model
  on first chatbot/analysis call.

These lazy-loading patterns keep API startup fast; expect the *first*
request to each of these features to take longer.
