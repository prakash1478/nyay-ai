import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FileSearch, ListChecks, AlertTriangle, Languages, Download, Sparkles } from 'lucide-react'
import Breadcrumb from '../../components/common/Breadcrumb.jsx'
import FileUpload from '../../components/documentAnalyzer/FileUpload.jsx'
import FilePreview from '../../components/documentAnalyzer/FilePreview.jsx'
import ResultCard from '../../components/documentAnalyzer/ResultCard.jsx'
import RiskMeter from '../../components/documentAnalyzer/RiskMeter.jsx'
import { SkeletonCard } from '../../components/common/LoadingSkeleton.jsx'
import Button from '../../components/common/Button.jsx'
import { analyzeDocument } from '../../services/api.js'

const RISK_STYLES = {
  high: 'border-crimson-500/30 bg-crimson-500/5 text-crimson-700 dark:text-crimson-400',
  medium: 'border-brass-500/30 bg-brass-500/5 text-brass-700 dark:text-brass-400',
  low: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400',
}

export default function DocumentAnalyzerPage() {
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)

  const handleFileSelected = (selected) => {
    setFile(selected)
    setResult(null)
    setProgress(0)
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

  const handleDownload = () => {
    if (!result) return
    const blob = new Blob(
      [
        `Nyaya AI — Document Summary\n\nFile: ${result.fileName}\n\nSummary:\n${result.summary}\n\nPlain Language Summary:\n${result.plainLanguageSummary}\n\nRisk Score: ${result.riskScore}/100\n\nKey Clauses:\n${result.keyClauses
          .map((c) => `- ${c.title}: ${c.detail}`)
          .join('\n')}\n\nHighlighted Risks:\n${result.highlightedRisks.map((r) => `- [${r.level.toUpperCase()}] ${r.text}`).join('\n')}\n`,
      ],
      { type: 'text/plain' }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${result.fileName.split('.')[0]}-summary.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Document Analyzer' }]} />

      <div className="flex items-center gap-3 mb-2">
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

      <div className="max-w-3xl mt-8 space-y-4">
        {!file && <FileUpload onFileSelected={handleFileSelected} />}

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

      {result && !isAnalyzing && (
        <div className="max-w-3xl mt-10 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-parchment-100">Analysis Results</h2>
            <Button variant="secondary" onClick={handleDownload} icon={Download}>
              Download summary
            </Button>
          </div>

          <ResultCard title="Risk Assessment" icon={AlertTriangle}>
            <RiskMeter score={result.riskScore} />
          </ResultCard>

          <ResultCard title="Summary" icon={FileSearch}>
            <p className="text-sm text-ink-600 dark:text-parchment-300 leading-relaxed">{result.summary}</p>
          </ResultCard>

          <ResultCard title="Plain Language Summary" icon={Languages}>
            <p className="text-sm text-ink-600 dark:text-parchment-300 leading-relaxed">
              {result.plainLanguageSummary}
            </p>
          </ResultCard>

          <ResultCard title="Key Clauses" icon={ListChecks}>
            <ul className="space-y-3">
              {result.keyClauses.map((clause) => (
                <li key={clause.title} className="pb-3 border-b border-ink-900/8 dark:border-parchment-100/10 last:border-0 last:pb-0">
                  <p className="text-sm font-semibold text-ink-800 dark:text-parchment-100">{clause.title}</p>
                  <p className="text-xs text-ink-500 dark:text-parchment-400 mt-1">{clause.detail}</p>
                </li>
              ))}
            </ul>
          </ResultCard>

          <ResultCard title="Highlighted Risks" icon={AlertTriangle}>
            <ul className="space-y-2.5">
              {result.highlightedRisks.map((risk, i) => (
                <li key={i} className={`text-sm rounded-lg border px-3.5 py-2.5 ${RISK_STYLES[risk.level]}`}>
                  <span className="font-semibold uppercase text-[10px] tracking-wide mr-2">{risk.level}</span>
                  {risk.text}
                </li>
              ))}
            </ul>
          </ResultCard>
        </div>
      )}
    </div>
  )
}
