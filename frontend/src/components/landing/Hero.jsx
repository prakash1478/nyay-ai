import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Scale, Sparkles } from 'lucide-react'
import { ROUTES } from '../../utils/constants.js'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-brief-lines opacity-[0.035] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brass-400/10 blur-3xl" />
      <div className="absolute top-40 -left-40 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="container-page pt-16 pb-20 lg:pt-24 lg:pb-28 relative">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="eyebrow mb-6">
              <Sparkles className="w-3.5 h-3.5" /> AI-Powered Legal Guidance
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.08] text-ink-900 dark:text-parchment-100 mb-6">
              Understand the law,
              <br />
              <span className="italic text-brass-600 dark:text-brass-400">before you sign anything.</span>
            </h1>
            <p className="text-base sm:text-lg text-ink-500 dark:text-parchment-300 max-w-lg mb-9 leading-relaxed">
              Nyaya AI reads your documents, answers your legal questions in five Indian languages, and
              breaks down your rights — so you walk into every situation informed.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to={ROUTES.SIGNUP} className="btn-primary">
                Get started free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to={ROUTES.CHATBOT} className="btn-secondary">
                Try the chatbot
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-10 text-xs text-ink-400 dark:text-parchment-400">
              <span>5 languages supported</span>
              <span className="w-1 h-1 rounded-full bg-ink-300 dark:bg-parchment-600" />
              <span>8 rights categories</span>
              <span className="w-1 h-1 rounded-full bg-ink-300 dark:bg-parchment-600" />
              <span>Free to start</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
            className="relative hidden lg:block"
          >
            <div className="relative bg-white dark:bg-ink-800 rounded-2xl shadow-soft border border-ink-900/5 dark:border-parchment-100/10 p-6 rotate-2">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-8 h-8 rounded-full bg-ink-fade flex items-center justify-center">
                  <Scale className="w-4 h-4 text-brass-400" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-900 dark:text-parchment-100">Nyaya AI</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-parchment-200 dark:bg-ink-700 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-ink-700 dark:text-parchment-200 max-w-[85%]">
                  My landlord won't return my security deposit. What can I do?
                </div>
                <div className="bg-ink-900 dark:bg-brass-500 text-parchment-100 dark:text-ink-950 rounded-2xl rounded-tr-sm px-4 py-3 text-sm ml-auto max-w-[85%]">
                  You can send a legal notice citing the Model Tenancy Act, then approach the Rent
                  Authority if unresolved within 30 days. Want a notice template?
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-ink-900/8 dark:border-parchment-100/10 flex items-center justify-between">
                <span className="text-[11px] text-ink-400 dark:text-parchment-400">Risk detected: Deposit Clause</span>
                <span className="text-[11px] font-semibold text-crimson-600 dark:text-crimson-400">High</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
