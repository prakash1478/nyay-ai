import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Mail, FileText, Clock, AlertTriangle, Sparkles, ShieldCheck, BookOpen, Scale, KeyRound, ChevronRight } from 'lucide-react'
import Breadcrumb from '../../components/common/Breadcrumb.jsx'
import Button from '../../components/common/Button.jsx'
import useAuth from '../../hooks/useAuth.js'
import { getAnalysisHistory, getDocumentHistory } from '../../services/api.js'
import { ROUTES } from '../../utils/constants.js'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function daysAgo(dateStr) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
}

const PROMOS = [
  {
    icon: ShieldCheck,
    title: 'Know Your Rights',
    desc: 'Browse 8 categories of legal rights with related acts and emergency helplines.',
    link: ROUTES.RIGHTS,
    color: 'emerald',
  },
  {
    icon: BookOpen,
    title: 'Legal Aid Directory',
    desc: 'Find NALSA clinics, Nyaya Bandhu advocates, and pro bono lawyers near you.',
    link: ROUTES.LEGAL_AID,
    color: 'brass',
  },
  {
    icon: Scale,
    title: 'AI Chatbot',
    desc: 'Ask any legal question in plain English and get instant guidance.',
    link: ROUTES.CHATBOT,
    color: 'crimson',
  },
]

const PROMO_COLORS = {
  emerald: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  brass: 'bg-brass-500/10 text-brass-700 dark:text-brass-300',
  crimson: 'bg-crimson-500/10 text-crimson-700 dark:text-crimson-300',
}

export default function ProfilePage() {
  const { user, resetPassword } = useAuth()
  const [sending, setSending] = useState(false)
  const [recentDocs, setRecentDocs] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const [docs, analyses] = await Promise.all([getDocumentHistory(), getAnalysisHistory()])
        const enriched = analyses.slice(0, 5).map(a => ({
          ...a,
          docName: docs.find(d => d.id === a.document_id)?.filename || a.document_name || 'Document',
        }))
        setRecentDocs(enriched)
      } catch { /* ignore */ }
    })()
  }, [])

  const handleResetPassword = async () => {
    if (!user?.email) {
      toast.error('No email associated with this account.')
      return
    }
    setSending(true)
    try {
      await resetPassword(user.email)
      toast.success(`Password reset link sent to ${user.email}`)
    } catch (err) {
      toast.error(err?.message || 'Could not send reset link.')
    } finally {
      setSending(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Breadcrumb items={[{ label: 'My Profile' }]} />

      <div className="max-w-2xl">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-full bg-ink-fade text-parchment-100 flex items-center justify-center text-xl font-semibold overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
            ) : (
              (user?.displayName || user?.email || 'U').charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-parchment-100">
              {user?.displayName || 'Counsel'}
            </h1>
            <p className="text-sm text-ink-500 dark:text-parchment-400">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-parchment-200 dark:bg-ink-800/50 border border-ink-900/5 dark:border-parchment-100/10">
            <Mail className="w-4 h-4 text-ink-400 shrink-0" />
            <div>
              <p className="text-xs text-ink-400 dark:text-parchment-400">Email</p>
              <p className="text-sm font-medium text-ink-900 dark:text-parchment-100">{user?.email || '—'}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-parchment-100">
              Recent Documents
            </h2>
            <Link
              to={ROUTES.DOCUMENT_ANALYZER}
              className="text-xs font-semibold text-brass-600 dark:text-brass-400 hover:underline"
            >
              View all
            </Link>
          </div>
          {recentDocs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-ink-900/15 dark:border-parchment-100/15 px-4 py-6 text-center">
              <FileText className="w-8 h-8 mx-auto text-ink-300 dark:text-parchment-600 mb-2" />
              <p className="text-xs text-ink-400 dark:text-parchment-500">No documents analyzed yet.</p>
              <Link
                to={ROUTES.DOCUMENT_ANALYZER}
                className="inline-block mt-2 text-xs font-semibold text-brass-600 dark:text-brass-400 hover:underline"
              >
                Analyze your first document
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentDocs.map((doc) => {
                const risk = doc.risk_score ?? null
                const color = risk >= 70 ? 'text-crimson-600 dark:text-crimson-400' : risk >= 40 ? 'text-brass-600 dark:text-brass-400' : 'text-emerald-600 dark:text-emerald-400'
                return (
                  <Link
                    key={doc.id}
                    to={ROUTES.DOCUMENT_ANALYZER}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-parchment-200 dark:bg-ink-800/50 border border-ink-900/5 dark:border-parchment-100/10 hover:bg-parchment-200/80 dark:hover:bg-ink-800/70 transition-colors"
                  >
                    <span className="w-9 h-9 rounded-lg bg-brass-500/10 flex items-center justify-center shrink-0">
                      <FileText className="w-4.5 h-4.5 text-brass-600 dark:text-brass-400" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink-900 dark:text-parchment-100 truncate">
                        {doc.docName}
                      </p>
                      <p className="text-xs text-ink-400 dark:text-parchment-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {formatDate(doc.created_at)} &middot; {daysAgo(doc.created_at)} days ago
                      </p>
                    </div>
                    {risk !== null && (
                      <span className={`shrink-0 text-xs font-semibold ${color}`}>
                        {risk}/100
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-ink-300 dark:text-parchment-600 shrink-0" />
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-parchment-100 mb-3">
            Explore More
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {PROMOS.map(p => (
              <Link
                key={p.title}
                to={p.link}
                className="flex flex-col gap-2 rounded-xl border border-ink-900/8 dark:border-parchment-100/10 px-4 py-4 hover:bg-ink-900/5 dark:hover:bg-parchment-100/5 transition-colors group"
              >
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${PROMO_COLORS[p.color]}`}>
                  <p.icon className="w-4.5 h-4.5" />
                </span>
                <p className="text-sm font-semibold text-ink-900 dark:text-parchment-100 group-hover:text-brass-600 dark:group-hover:text-brass-400 transition-colors">
                  {p.title}
                </p>
                <p className="text-xs text-ink-500 dark:text-parchment-400 leading-relaxed">
                  {p.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-ink-900/10 dark:border-parchment-100/10 pt-6">
          <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-parchment-100 mb-3">
            Password
          </h2>
          <p className="text-sm text-ink-500 dark:text-parchment-400 mb-4">
            We'll send a password reset link to your registered email.
          </p>
          <Button
            variant="secondary"
            icon={KeyRound}
            isLoading={sending}
            onClick={handleResetPassword}
          >
            Send reset link
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
