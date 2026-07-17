import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FileSearch, ListChecks, AlertTriangle, Languages, Download, Sparkles, Camera, Volume2, VolumeX } from 'lucide-react'
import Breadcrumb from '../../components/common/Breadcrumb.jsx'
import FileUpload from '../../components/documentAnalyzer/FileUpload.jsx'
import FilePreview from '../../components/documentAnalyzer/FilePreview.jsx'
import ResultCard from '../../components/documentAnalyzer/ResultCard.jsx'
import RiskMeter from '../../components/documentAnalyzer/RiskMeter.jsx'
import DocumentScanner from '../../components/documentAnalyzer/DocumentScanner.jsx'
import { SkeletonCard } from '../../components/common/LoadingSkeleton.jsx'
import Button from '../../components/common/Button.jsx'
import { analyzeDocument } from '../../services/api.js'
import useTextToSpeech from '../../hooks/useTextToSpeech.js'

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
  const [showScanner, setShowScanner] = useState(false)
  const { speak, stop, isPlaying } = useTextToSpeech()

  const handleFileSelected = (selected) => {
    setFile(selected)
    setResult(null)
    setProgress(0)
    setShowScanner(false)
  }

  const handleScanComplete = (scannedFile) => {
    handleFileSelected(scannedFile)
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
        {!file && !showScanner && (
          <>
            <FileUpload onFileSelected={handleFileSelected} />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full h-px bg-ink-900/10 dark:bg-parchment-100/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-parchment-50 dark:bg-ink-950 px-3 text-xs text-ink-400 dark:text-parchment-500">or</span>
              </div>
            </div>
            <button
              onClick={() => setShowScanner(true)}
              className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl border-2 border-dashed border-ink-900/15 dark:border-parchment-100/15 hover:border-brass-400 hover:bg-brass-500/5 transition-all text-left"
            >
              <span className="w-12 h-12 rounded-2xl bg-brass-500/10 flex items-center justify-center shrink-0">
                <Camera className="w-6 h-6 text-brass-500" />
              </span>
              <div>
                <p className="font-display text-base font-semibold text-ink-900 dark:text-parchment-100">
                  Scan with Camera
                </p>
                <p className="text-sm text-ink-500 dark:text-parchment-400">
                  Use your phone or webcam to capture a document
                </p>
              </div>
            </button>
          </>
        )}

        {!file && showScanner && (
          <DocumentScanner onScanComplete={handleScanComplete} onClose={() => setShowScanner(false)} />
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
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-ink-600 dark:text-parchment-300 leading-relaxed">
                {result.plainLanguageSummary}
              </p>
              <button
                onClick={() => (isPlaying ? stop() : speak(result.plainLanguageSummary).catch(() => {}))}
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-ink-400 hover:text-brass-600 dark:hover:text-brass-400 hover:bg-brass-500/10 transition-colors"
                aria-label={isPlaying ? 'Stop reading' : 'Read aloud'}
              >
                {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
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
