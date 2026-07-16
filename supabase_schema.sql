-- ============================================================================
-- AI Legal Assistant — Supabase (PostgreSQL) Schema
-- ============================================================================
-- Run this in the Supabase SQL Editor to create all tables,
-- indexes, and Row-Level Security (RLS) policies.
-- ============================================================================

-- 0. Extensions
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. USERS
-- Mirrors app/models/user.py :: UserModel
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uid             TEXT NOT NULL UNIQUE,              -- Firebase / OAuth UID
    email           TEXT NOT NULL UNIQUE,
    name            TEXT NOT NULL,
    picture         TEXT,
    provider        TEXT NOT NULL DEFAULT 'google',
    preferred_language TEXT NOT NULL DEFAULT 'en',
    phone           TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP INDEX IF EXISTS idx_users_uid;
CREATE INDEX idx_users_uid ON users (uid);
DROP INDEX IF EXISTS idx_users_email;
CREATE INDEX idx_users_email ON users (email);

-- ============================================================================
-- 2. SESSIONS
-- Logical chat sessions owned by a user
-- ============================================================================
CREATE TABLE IF NOT EXISTS sessions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           TEXT,
    language        TEXT NOT NULL DEFAULT 'en',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP INDEX IF EXISTS idx_sessions_user_id;
CREATE INDEX idx_sessions_user_id ON sessions (user_id);
DROP INDEX IF EXISTS idx_sessions_created_at;
CREATE INDEX idx_sessions_created_at ON sessions (created_at DESC);

-- ============================================================================
-- 3. CHAT HISTORY
-- Mirrors app/models/chat.py :: ChatMessageModel
-- ============================================================================
CREATE TABLE IF NOT EXISTS chat_history (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id      UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    role            TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    message         TEXT NOT NULL,
    language        TEXT NOT NULL DEFAULT 'en',
    is_legal        BOOLEAN NOT NULL DEFAULT TRUE,
    metadata        JSONB DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP INDEX IF EXISTS idx_chat_history_session_id;
CREATE INDEX idx_chat_history_session_id ON chat_history (session_id);
DROP INDEX IF EXISTS idx_chat_history_user_id;
CREATE INDEX idx_chat_history_user_id ON chat_history (user_id);
DROP INDEX IF EXISTS idx_chat_history_created_at;
CREATE INDEX idx_chat_history_created_at ON chat_history (created_at ASC);

-- ============================================================================
-- 4. UPLOADED DOCUMENTS
-- Mirrors app/models/document.py :: UploadedDocumentModel
-- ============================================================================
CREATE TABLE IF NOT EXISTS uploaded_documents (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename        TEXT NOT NULL,
    file_path       TEXT NOT NULL,
    file_type       TEXT NOT NULL,
    file_size_bytes BIGINT DEFAULT 0,
    extracted_text  TEXT DEFAULT '',
    page_count      INT DEFAULT 0,
    language        TEXT DEFAULT 'en',
    metadata        JSONB DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP INDEX IF EXISTS idx_uploaded_documents_user_id;
CREATE INDEX idx_uploaded_documents_user_id ON uploaded_documents (user_id);
DROP INDEX IF EXISTS idx_uploaded_documents_created_at;
CREATE INDEX idx_uploaded_documents_created_at ON uploaded_documents (created_at DESC);

-- ============================================================================
-- 5. DOCUMENT ANALYSIS
-- Mirrors app/models/document.py :: DocumentAnalysisModel
-- ============================================================================
CREATE TABLE IF NOT EXISTS document_analysis (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id         UUID NOT NULL REFERENCES uploaded_documents(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    summary             TEXT NOT NULL,
    plain_english_summary TEXT NOT NULL,
    important_clauses   TEXT[] NOT NULL DEFAULT '{}',
    hidden_fees         TEXT[] NOT NULL DEFAULT '{}',
    illegal_clauses     TEXT[] NOT NULL DEFAULT '{}',
    risk_score          INT NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level          TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    metadata            JSONB DEFAULT '{}'::jsonb,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP INDEX IF EXISTS idx_document_analysis_document_id;
CREATE INDEX idx_document_analysis_document_id ON document_analysis (document_id);
DROP INDEX IF EXISTS idx_document_analysis_user_id;
CREATE INDEX idx_document_analysis_user_id ON document_analysis (user_id);
DROP INDEX IF EXISTS idx_document_analysis_risk_score;
CREATE INDEX idx_document_analysis_risk_score ON document_analysis (risk_score DESC);

-- ============================================================================
-- 6. RIGHTS (Know Your Rights entries)
-- Mirrors app/models/rights.py :: RightsEntryModel
-- ============================================================================
CREATE TABLE IF NOT EXISTS rights (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category        TEXT NOT NULL,
    title           TEXT NOT NULL,
    description     TEXT NOT NULL,
    key_points      TEXT[] NOT NULL DEFAULT '{}',
    relevant_laws   TEXT[] NOT NULL DEFAULT '{}',
    language        TEXT NOT NULL DEFAULT 'en',
    tags            TEXT[] DEFAULT '{}',
    is_published    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP INDEX IF EXISTS idx_rights_category;
CREATE INDEX idx_rights_category ON rights (category);
DROP INDEX IF EXISTS idx_rights_language;
CREATE INDEX idx_rights_language ON rights (language);
DROP INDEX IF EXISTS idx_rights_category_language;
CREATE INDEX idx_rights_category_language ON rights (category, language);

-- ============================================================================
-- 7. FEEDBACK
-- Mirrors app/models/feedback.py :: FeedbackModel
-- ============================================================================
CREATE TABLE IF NOT EXISTS feedback (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category        TEXT NOT NULL,
    message         TEXT NOT NULL,
    rating          INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    metadata        JSONB DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP INDEX IF EXISTS idx_feedback_user_id;
CREATE INDEX idx_feedback_user_id ON feedback (user_id);
DROP INDEX IF EXISTS idx_feedback_rating;
CREATE INDEX idx_feedback_rating ON feedback (rating);
DROP INDEX IF EXISTS idx_feedback_category;
CREATE INDEX idx_feedback_category ON feedback (category);

-- ============================================================================
-- 8. NOTIFICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,
    body            TEXT NOT NULL,
    type            TEXT NOT NULL DEFAULT 'info',
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    metadata        JSONB DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP INDEX IF EXISTS idx_notifications_user_id;
CREATE INDEX idx_notifications_user_id ON notifications (user_id);
DROP INDEX IF EXISTS idx_notifications_is_read;
CREATE INDEX idx_notifications_is_read ON notifications (is_read);
DROP INDEX IF EXISTS idx_notifications_created_at;
CREATE INDEX idx_notifications_created_at ON notifications (created_at DESC);

-- ============================================================================
-- 9. AUTO-UPDATE updated_at TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_sessions_updated_at ON sessions;
CREATE TRIGGER trg_sessions_updated_at
    BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_uploaded_documents_updated_at ON uploaded_documents;
CREATE TRIGGER trg_uploaded_documents_updated_at
    BEFORE UPDATE ON uploaded_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_rights_updated_at ON rights;
CREATE TRIGGER trg_rights_updated_at
    BEFORE UPDATE ON rights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 10. ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- Enable RLS on all user-data tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE rights ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
DROP POLICY IF EXISTS users_own ON users;
CREATE POLICY users_own ON users
    FOR ALL
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Sessions: users can CRUD only their own sessions
DROP POLICY IF EXISTS sessions_own ON sessions;
CREATE POLICY sessions_own ON sessions
    FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Chat history: users can CRUD messages in their own sessions
DROP POLICY IF EXISTS chat_history_own ON chat_history;
CREATE POLICY chat_history_own ON chat_history
    FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Documents: users can CRUD only their own documents
DROP POLICY IF EXISTS uploaded_documents_own ON uploaded_documents;
CREATE POLICY uploaded_documents_own ON uploaded_documents
    FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Analysis: users can read analysis for their own documents
DROP POLICY IF EXISTS document_analysis_own ON document_analysis;
CREATE POLICY document_analysis_own ON document_analysis
    FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Feedback: users can CRUD only their own feedback
DROP POLICY IF EXISTS feedback_own ON feedback;
CREATE POLICY feedback_own ON feedback
    FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Notifications: users can read/update their own notifications
DROP POLICY IF EXISTS notifications_own ON notifications;
CREATE POLICY notifications_own ON notifications
    FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Rights: public read-only for published entries
DROP POLICY IF EXISTS rights_read_public ON rights;
CREATE POLICY rights_read_public ON rights
    FOR SELECT
    USING (is_published = TRUE);

-- ============================================================================
-- 11. FULL-TEXT SEARCH (optional)
-- ============================================================================
ALTER TABLE rights ADD COLUMN IF NOT EXISTS search_vector tsvector
    GENERATED ALWAYS AS (
        to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
    ) STORED;

DROP INDEX IF EXISTS idx_rights_search;
CREATE INDEX idx_rights_search ON rights USING GIN (search_vector);
