import React, { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { FileSearch, ListChecks, AlertTriangle, Languages, Download, Sparkles, Volume2, VolumeX, History, Clock, ArrowLeft, FileText } from 'lucide-react'
import Breadcrumb from '../../components/common/Breadcrumb.jsx'
import FileUpload from '../../components/documentAnalyzer/FileUpload.jsx'
import FilePreview from '../../components/documentAnalyzer/FilePreview.jsx'
import ResultCard from '../../components/documentAnalyzer/ResultCard.jsx'
import RiskMeter from '../../components/documentAnalyzer/RiskMeter.jsx'

import { SkeletonCard } from '../../components/common/LoadingSkeleton.jsx'
import Button from '../../components/common/Button.jsx'
import { analyzeDocument, getDocumentHistory, getAnalysisHistory } from '../../services/api.js'
import useTextToSpeech from '../../hooks/useTextToSpeech.js'
import { riskLevelMeta } from '../../utils/helpers.js'

const RISK_STYLES = {
  high: 'border-crimson-500/30 bg-crimson-500/5 text-crimson-700 dark:text-crimson-400',
  medium: 'border-brass-500/30 bg-brass-500/5 text-brass-700 dark:text-brass-400',
  low: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400',
}

const TABS = [
  { key: 'new', label: 'New Analysis', icon: Sparkles },
  { key: 'saved', label: 'Saved Documents', icon: History },
]

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function DocumentAnalyzerPage() {
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)

  const [activeTab, setActiveTab] = useState('new')
  const [savedDocs, setSavedDocs] = useState([])
  const [savedAnalyses, setSavedAnalyses] = useState([])
  const [savedLoading, setSavedLoading] = useState(false)
  const [selectedSavedResult, setSelectedSavedResult] = useState(null)
  const { speak, stop, isPlaying } = useTextToSpeech()

  const fetchSaved = useCallback(async () => {
    setSavedLoading(true)
    try {
      const [docs, analyses] = await Promise.all([getDocumentHistory(), getAnalysisHistory()])
      setSavedDocs(docs)
      setSavedAnalyses(analyses)
    } catch {
      toast.error('Could not load saved documents')
    } finally {
      setSavedLoading(false)
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'saved') fetchSaved()
  }, [activeTab, fetchSaved])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSelectedSavedResult(null)
  }

  const handleFileSelected = (selected) => {
    setFile(selected)
    setResult(null)
    setProgress(0)
    setActiveTab('new')
  }

  const handleAnalyze = async () => {
    if (!file) return
    setIsAnalyzing(true)
    setResult(null)
    try {
      const data = await analyzeDocument(file, setProgress)
      setResult(data)
      toast.success('Analysis complete')
    } catch (err) {
      toast.error('Could not analyze this document. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDelete = () => {
    setFile(null)
    setResult(null)
    setProgress(0)
  }

  const handleViewSavedAnalysis = (analysis) => {
    const doc = savedDocs.find((d) => d.id === analysis.document_id)
    setSelectedSavedResult({
      fileName: doc?.filename || 'Unknown document',
      summary: analysis.summary || '',
      plainLanguageSummary: analysis.plain_english_summary || '',
      keyClauses: (analysis.important_clauses || []).map((c) => ({ title: c, detail: '' })),
      riskScore: analysis.risk_score ?? 0,
      highlightedRisks: [
        ...(analysis.illegal_clauses || []).map((c) => ({ level: 'high', text: c })),
        ...(analysis.hidden_fees || []).map((f) => ({ level: 'medium', text: f })),
      ],
    })
  }

  const handleDownload = () => {
    const r = selectedSavedResult || result
    if (!r) return
    const blob = new Blob(
      [
        `Nyay AI — Document Summary\n\nFile: ${r.fileName}\n\nSummary:\n${r.summary}\n\nPlain Language Summary:\n${r.plainLanguageSummary}\n\nRisk Score: ${r.riskScore}/100\n\nKey Clauses:\n${r.keyClauses
          .map((c) => `- ${c.title}: ${c.detail}`)
          .join('\n')}\n\nHighlighted Risks:\n${r.highlightedRisks.map((r) => `- [${r.level.toUpperCase()}] ${r.text}`).join('\n')}\n`,
      ],
      { type: 'text/plain' }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${r.fileName.split('.')[0]}-summary.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const renderResult = (r) => (
    <div className="max-w-3xl mt-10 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {selectedSavedResult && (
            <button
              onClick={() => setSelectedSavedResult(null)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-400 hover:text-brass-600 hover:bg-brass-500/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-parchment-100">Analysis Results</h2>
            <p className="text-xs text-ink-500 dark:text-parchment-400 mt-0.5">{r.fileName}</p>
          </div>
        </div>
        <Button variant="secondary" onClick={handleDownload} icon={Download}>
          Download summary
        </Button>
      </div>

      <ResultCard title="Risk Assessment" icon={AlertTriangle}>
        <RiskMeter score={r.riskScore} />
      </ResultCard>

      <ResultCard title="Summary" icon={FileSearch}>
        <p className="text-sm text-ink-600 dark:text-parchment-300 leading-relaxed">{r.summary}</p>
      </ResultCard>

      <ResultCard title="Plain Language Summary" icon={Languages}>
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-ink-600 dark:text-parchment-300 leading-relaxed">
            {r.plainLanguageSummary}
          </p>
          <button
            onClick={() => (isPlaying ? stop() : speak(r.plainLanguageSummary).catch(() => {}))}
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-ink-400 hover:text-brass-600 dark:hover:text-brass-400 hover:bg-brass-500/10 transition-colors"
            aria-label={isPlaying ? 'Stop reading' : 'Read aloud'}
          >
            {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </ResultCard>

      <ResultCard title="Key Clauses" icon={ListChecks}>
        <ul className="space-y-3">
          {r.keyClauses.map((clause) => (
            <li key={clause.title} className="pb-3 border-b border-ink-900/8 dark:border-parchment-100/10 last:border-0 last:pb-0">
              <p className="text-sm font-semibold text-ink-800 dark:text-parchment-100">{clause.title}</p>
              <p className="text-xs text-ink-500 dark:text-parchment-400 mt-1">{clause.detail}</p>
            </li>
          ))}
        </ul>
      </ResultCard>

      <ResultCard title="Highlighted Risks" icon={AlertTriangle}>
        <ul className="space-y-2.5">
          {r.highlightedRisks.map((risk, i) => (
            <li key={i} className={`text-sm rounded-lg border px-3.5 py-2.5 ${RISK_STYLES[risk.level]}`}>
              <span className="font-semibold uppercase text-[10px] tracking-wide mr-2">{risk.level}</span>
              {risk.text}
            </li>
          ))}
        </ul>
      </ResultCard>
    </div>
  )

  return (
    <div>
      <Breadcrumb items={[{ label: 'Document Analyzer' }]} />

      <div className="flex items-center gap-3 mb-4">
        <span className="w-11 h-11 rounded-xl bg-crimson-500/10 flex items-center justify-center">
          <FileSearch className="w-5.5 h-5.5 text-crimson-600 dark:text-crimson-400" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-parchment-100">
            Document Analyzer
          </h1>
          <p className="text-sm text-ink-500 dark:text-parchment-400">
            Upload a contract or agreement to surface risks in plain language.
          </p>
        </div>
      </div>

      <div className="flex gap-1 mb-6 p-1 rounded-xl bg-ink-900/5 dark:bg-parchment-100/5 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-parchment-50 dark:bg-ink-800 text-ink-900 dark:text-parchment-100 shadow-sm'
                : 'text-ink-500 dark:text-parchment-400 hover:text-ink-700 dark:hover:text-parchment-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'new' && (
        <>
          <div className="max-w-3xl space-y-4">
            {!file && (
              <FileUpload onFileSelected={handleFileSelected} />
            )}

            {file && (
              <FilePreview file={file} progress={progress} isAnalyzing={isAnalyzing} onDelete={handleDelete} />
            )}

            {file && !isAnalyzing && !result && (
              <Button onClick={handleAnalyze} icon={Sparkles} className="w-full sm:w-auto">
                Analyze document
              </Button>
            )}
          </div>

          {isAnalyzing && (
            <div className="max-w-3xl mt-8 grid gap-5">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {result && !isAnalyzing && renderResult(result)}
        </>
      )}

      {activeTab === 'saved' && (
        <div className="max-w-3xl">
          {selectedSavedResult ? (
            renderResult(selectedSavedResult)
          ) : savedLoading ? (
            <div className="grid gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : savedAnalyses.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 mx-auto text-ink-300 dark:text-parchment-600 mb-4" />
              <p className="text-ink-500 dark:text-parchment-400 text-sm">No saved analyses yet.</p>
              <p className="text-ink-400 dark:text-parchment-500 text-xs mt-1">Upload and analyze a document to see it here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedAnalyses.map((analysis) => {
                const doc = savedDocs.find((d) => d.id === analysis.document_id)
                const meta = riskLevelMeta(analysis.risk_score ?? 0)
                return (
                  <button
                    key={analysis.id}
                    onClick={() => handleViewSavedAnalysis(analysis)}
                    className="w-full text-left card p-4 hover:bg-ink-900/5 dark:hover:bg-parchment-100/5 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-ink-900 dark:text-parchment-100 truncate">
                          {doc?.filename || 'Unknown document'}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-ink-500 dark:text-parchment-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(analysis.created_at)}
                          </span>
                          {doc?.file_type && (
                            <span className="uppercase">{doc.file_type}</span>
                          )}
                        </div>
                      </div>
                      <div className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${
                        meta.color === 'crimson' ? 'bg-crimson-500/10 text-crimson-600 dark:text-crimson-400' :
                        meta.color === 'brass' ? 'bg-brass-500/10 text-brass-600 dark:text-brass-400' :
                        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {analysis.risk_score ?? '?'}/100
                      </div>
                    </div>
                    {analysis.summary && (
                      <p className="text-xs text-ink-500 dark:text-parchment-400 mt-2 line-clamp-2">
                        {analysis.summary}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
