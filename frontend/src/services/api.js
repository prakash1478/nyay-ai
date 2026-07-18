import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 20000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nyaya_jwt')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('nyaya_jwt')
      localStorage.removeItem('nyaya_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export async function sendChatMessage(message, { session_id, signal } = {}) {
  const res = await api.post('/chat', { message, session_id, language: 'en' }, { signal, timeout: 180000 })
  const d = res.data.data
  return {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: d.reply,
    timestamp: new Date().toISOString(),
    _session_id: d.session_id,
  }
}

export async function getChatHistory() {
  const res = await api.get('/history/chats')
  return res.data.data || []
}

export async function deleteChatSession(sessionId) {
  await api.delete(`/chat/session/${sessionId}`)
}

export async function getDocumentHistory() {
  const res = await api.get('/history/documents')
  return res.data.data || []
}

export async function getAnalysisHistory() {
  const res = await api.get('/history/analyses')
  return res.data.data || []
}

export async function analyzeDocument(file, onProgress) {
  const form = new FormData()
  form.append('file', file)
  const upRes = await api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress?.(Math.round((e.loaded / e.total) * 50)),
  })
  const { document_id } = upRes.data.data
  onProgress?.(60)

  const anRes = await api.post('/analyze', { document_id, language: 'en' })
  const a = anRes.data.data
  onProgress?.(100)

  return {
    fileName: file.name,
    summary: a.summary,
    plainLanguageSummary: a.plain_english_summary,
    keyClauses: a.important_clauses.map((c) => ({ title: c, detail: '' })),
    riskScore: a.risk_score,
    highlightedRisks: [
      ...(a.illegal_clauses || []).map((c) => ({ level: 'high', text: c })),
      ...(a.hidden_fees || []).map((f) => ({ level: 'medium', text: f })),
    ],
  }
}
