import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Quote } from 'lucide-react'
import Hero from '../components/landing/Hero.jsx'
import FeaturesSection from '../components/landing/FeaturesSection.jsx'
import { ROUTES } from '../utils/constants.js'

const TESTIMONIALS = [
  {
    quote: 'I finally understood my rental agreement before signing — the risk highlights caught a clause I would have missed.',
    name: 'Priya S.',
    role: 'Tenant, Bengaluru',
  },
  {
    quote: 'Asked about my termination in Tamil and got a clear, actionable answer within seconds.',
    name: 'Karthik M.',
    role: 'Software Engineer, Chennai',
  },
  {
    quote: 'The Know Your Rights section for senior citizens helped my parents understand maintenance claims.',
    name: 'Fathima R.',
    role: 'Caregiver, Kochi',
  },
]

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <FeaturesSection />

      <section className="bg-ink-fade text-parchment-100 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-brief-lines opacity-[0.05]" />
        <div className="container-page relative">
          <span className="eyebrow text-brass-300 mb-4">Trusted by everyday citizens</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-14 max-w-lg">
            Real questions, resolved in real language.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl2 p-6 backdrop-blur-sm">
                <Quote className="w-5 h-5 text-brass-400 mb-4" />
                <p className="text-sm text-parchment-200 leading-relaxed mb-6">{t.quote}</p>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-parchment-400">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-24 text-center">
        <span className="eyebrow mb-4 justify-center">Ready when you are</span>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink-900 dark:text-parchment-100 mb-6 max-w-xl mx-auto">
          Your first legal question is on us.
        </h2>
        <Link to={ROUTES.SIGNUP} className="btn-primary mx-auto">
          Create your free account <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  )
}
