"""
Application-wide constants and enumerations.
"""

SUPPORTED_LANGUAGES = {
    "en": "English",
    "hi": "Hindi",
    "bn": "Bengali",
    "ta": "Tamil",
    "te": "Telugu",
    "mr": "Marathi",
    "gu": "Gujarati",
    "kn": "Kannada",
    "ml": "Malayalam",
    "pa": "Punjabi",
    "or": "Odia",
    "as": "Assamese",
    "ur": "Urdu",
    "sd": "Sindhi",
    "sa": "Sanskrit",
    "kok": "Konkani",
    "ne": "Nepali",
    "doi": "Dogri",
    "mni": "Manipuri",
    "brx": "Bodo",
    "mai": "Maithili",
    "sat": "Santali",
}

RIGHTS_CATEGORIES = [
    "women",
    "employment",
    "consumer",
    "cyber_crime",
    "tenant",
    "students",
    "workers",
    "senior_citizens",
]

ALLOWED_DOCUMENT_EXTENSIONS = {".pdf", ".docx", ".doc", ".txt"}
ALLOWED_IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff"}
ALLOWED_AUDIO_EXTENSIONS = {".wav", ".mp3", ".m4a", ".ogg", ".webm", ".flac"}

ALL_ALLOWED_UPLOAD_EXTENSIONS = ALLOWED_DOCUMENT_EXTENSIONS | ALLOWED_IMAGE_EXTENSIONS

RISK_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

LEGAL_KEYWORDS = [
    "law", "legal", "rights", "court", "contract", "agreement", "lawsuit", "sue",
    "police", "fir", "complaint", "consumer", "tenant", "landlord", "employment",
    "employee", "employer", "salary", "termination", "harassment", "cyber crime",
    "fraud", "divorce", "marriage", "property", "inheritance", "will", "criminal",
    "civil", "constitution", "fundamental rights", "ipc", "crpc", "act", "clause",
    "penalty", "fine", "bail", "arrest", "domestic violence", "dowry", "labour",
    "worker", "minimum wage", "eviction", "rent", "lease", "warranty", "refund",
    "cheating", "defamation", "harassment", "poc so", "rti", "advocate", "lawyer",
    "judge", "tribunal", "notice", "affidavit", "power of attorney", "gst", "tax",
    "senior citizen", "student", "ragging", "scholarship", "visa", "passport",
]

# Firestore collection names
class Collections:
    USERS = "users"
    CHAT_HISTORY = "chat_history"
    RIGHTS = "rights"
    UPLOADED_DOCUMENTS = "uploaded_documents"
    DOCUMENT_ANALYSIS = "document_analysis"
    NOTIFICATIONS = "notifications"
    FEEDBACK = "feedback"
    SESSIONS = "sessions"
