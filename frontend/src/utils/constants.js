export const APP_NAME = 'Nyay AI'
export const APP_TAGLINE = 'Your intelligent legal companion'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  CHATBOT: '/chatbot',
  DOCUMENT_ANALYZER: '/document-analyzer',
  RIGHTS: '/know-your-rights',
  RIGHTS_CATEGORY: '/know-your-rights/:categoryId',
  VOICE_ASSISTANT: '/voice-assistant',
  LEGAL_AID: '/legal-aid',
  PROFILE: '/profile',
  WOMEN_ASSISTANT: '/women-assistant',
  NOT_FOUND: '*',
}

export const NAV_LINKS = [
  { label: 'AI Chatbot', to: ROUTES.CHATBOT },
  { label: 'Document Analyzer', to: ROUTES.DOCUMENT_ANALYZER },
  { label: 'Know Your Rights', to: ROUTES.RIGHTS },
  { label: 'Voice Assistant', to: ROUTES.VOICE_ASSISTANT },
  { label: 'Legal Aid', to: ROUTES.LEGAL_AID },
  { label: 'Women\'s Assistant', to: ROUTES.WOMEN_ASSISTANT },
]

export const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
}

export const MAX_FILE_SIZE_MB = 15
