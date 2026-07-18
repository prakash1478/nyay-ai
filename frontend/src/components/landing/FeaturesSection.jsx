import React from 'react'
import { MessagesSquare, FileSearch, ShieldCheck } from 'lucide-react'
import FeatureCard from './FeatureCard.jsx'
import { ROUTES } from '../../utils/constants.js'

const MODULES = [
  {
    icon: MessagesSquare,
    title: 'AI Legal Chatbot',
    description: 'Ask any legal question in plain language and get grounded, cited guidance instantly.',
    points: ['Voice typing', 'Suggested legal topics'],
    to: ROUTES.CHATBOT,
    accent: 'brass',
  },
  {
    icon: FileSearch,
    title: 'Document Analyzer',
    description: 'Upload contracts and agreements to surface risky clauses before you sign.',
    points: ['PDF, DOCX, TXT, images', 'Risk scoring', 'Plain-language summary'],
    to: ROUTES.DOCUMENT_ANALYZER,
    accent: 'crimson',
  },
  {
    icon: ShieldCheck,
    title: 'Know Your Rights',
    description: 'Browse rights, relevant acts, and emergency contacts across 8 everyday categories.',
    points: ['Women, tenants, workers & more', 'Related Acts', 'Emergency helplines'],
    to: ROUTES.RIGHTS,
    accent: 'emerald',
  },
]

export default function FeaturesSection() {
  return (
    <section className="container-page py-20 lg:py-28">
      <div className="max-w-xl mb-14">
        <span className="eyebrow mb-4">What's inside</span>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink-900 dark:text-parchment-100 mb-4">
          Three ways to get informed, fast.
        </h2>
        <p className="text-ink-500 dark:text-parchment-400 leading-relaxed">
          Each module works independently — start wherever your situation calls for.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODULES.map((mod, i) => (
          <FeatureCard key={mod.title} index={i} {...mod} />
        ))}
      </div>
    </section>
  )
}
