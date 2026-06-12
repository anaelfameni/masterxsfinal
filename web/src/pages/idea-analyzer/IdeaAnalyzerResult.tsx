import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  Sparkles,
  Download,
  FileDown,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Loader2,
  AlertCircle,
  TrendingUp,
  Lightbulb,
  Target,
  Key,
} from 'lucide-react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'
import {
  getReport,
  saveReport,
  exportReportToFile,
  reportToMarkdown,
  getGroqKey,
  setGroqKey,
} from '@/lib/idea-analyzer/storage'
import { runGroqAnalysis } from '@/lib/idea-analyzer/groq'
import {
  DIMENSIONS,
  DIMENSIONS_BY_ID,
  VERDICT_META,
  QUESTIONS,
} from '@/lib/idea-analyzer/questions'
import type { IdeaReport } from '@/lib/idea-analyzer/types'

const verdictBg: Record<string, string> = {
  success: 'from-success/20 via-success/10 to-transparent border-success/40',
  warning: 'from-warning/20 via-warning/10 to-transparent border-warning/40',
  danger: 'from-danger/20 via-danger/10 to-transparent border-danger/40',
  info: 'from-info/20 via-info/10 to-transparent border-info/40',
}

const verdictText: Record<string, string> = {
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  info: 'text-info',
}

export default function IdeaAnalyzerResult() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState<IdeaReport | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<{ msg: string; hint?: string } | null>(null)
  const [exporting, setExporting] = useState(false)
  const [exportResult, setExportResult] = useState<string | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)
  const [showKeyPrompt, setShowKeyPrompt] = useState(false)
  const [tempKey, setTempKey] = useState('')

  useEffect(() => {
    const r = getReport(id)
    if (!r) {
      navigate('/tools/idea-analyzer')
      return
    }
    setReport(r)
  }, [id, navigate])

  const radarData = useMemo(() => {
    if (!report) return []
    return report.scores.map((s) => ({
      dimension: DIMENSIONS_BY_ID[s.id]?.shortLabel ?? s.id,
      score: s.score,
      fullMark: 100,
    }))
  }, [report])

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-fg-muted" />
      </div>
    )
  }

  const meta = VERDICT_META[report.verdict]

  async function runAi() {
    if (!report) return
    let key = getGroqKey()
    if (!key) {
      setShowKeyPrompt(true)
      return
    }
    setAiLoading(true)
    setAiError(null)
    const res = await runGroqAnalysis(report, key)
    setAiLoading(false)
    if (!res.ok) {
      setAiError({ msg: res.error, hint: res.hint })
      return
    }
    const updated: IdeaReport = { ...report, aiAnalysis: res.analysis, updatedAt: Date.now() }
    setReport(updated)
    saveReport(updated)
  }

  function handleSaveKey() {
    setGroqKey(tempKey.trim())
    setShowKeyPrompt(false)
    setTempKey('')
    // Auto-run after key save
    runAi()
  }

  async function handleExportToProject() {
    if (!report) return
    setExporting(true)
    setExportResult(null)
    setExportError(null)
    const res = await exportReportToFile(report)
    setExporting(false)
    if (res.ok) {
      setExportResult(res.path)
    } else {
      setExportError(res.error)
    }
  }

  function handleDownloadMd() {
    if (!report) return
    const md = reportToMarkdown(report)
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${report.slug}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          to="/tools/idea-analyzer"
          className="text-fg-muted hover:text-accent-300 transition flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> SaaS Idea Analyzer
        </Link>
        <span className="text-fg-faint">/</span>
        <span className="text-fg truncate">{report.title}</span>
      </div>

      {/* Verdict hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative card p-6 sm:p-8 border bg-gradient-to-br ${verdictBg[meta.color]}`}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-[260px]">
            <div className={`text-2xs uppercase tracking-widest font-mono ${verdictText[meta.color]} mb-2`}>
              Verdict MasterXS
            </div>
            <div className={`text-3xl sm:text-4xl font-bold ${verdictText[meta.color]} tracking-tight`}>
              {meta.label}
            </div>
            <p className="mt-2 text-fg-muted max-w-xl">{meta.description}</p>
            <h1 className="mt-4 text-lg font-semibold text-fg">{report.title}</h1>
          </div>
          <div className="text-right">
            <div className={`text-5xl sm:text-6xl font-bold ${verdictText[meta.color]} font-mono`}>
              {report.globalScore}
              <span className="text-2xl text-fg-faint">/100</span>
            </div>
            <div className="text-xs text-fg-subtle mt-1">Score global pondéré</div>
          </div>
        </div>
      </motion.div>

      {/* Early Kill if any */}
      {report.earlyKill && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-5 border-danger/40 bg-danger/5"
        >
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-danger/15 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-danger" />
            </div>
            <div>
              <div className="font-semibold text-danger">Signal bloquant — Early Kill</div>
              <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">{report.earlyKill.reason}</p>
              <div className="mt-3 p-3 rounded-lg bg-bg/40 border border-danger/20">
                <div className="text-2xs uppercase tracking-widest text-danger mb-1 font-mono">
                  Action recommandée
                </div>
                <p className="text-sm text-fg">{report.earlyKill.action}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main grid : Radar + dimensions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Radar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-5 lg:col-span-1"
        >
          <h3 className="text-sm font-semibold text-fg mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent-400" />
            Radar 6 dimensions
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(168, 85, 247, 0.15)" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: '#a78bfa', fontSize: 11 }}
                />
                <PolarRadiusAxis
                  domain={[0, 100]}
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
                  tickCount={5}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#a855f7"
                  fill="#a855f7"
                  fillOpacity={0.35}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Dimensions list */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card p-5 lg:col-span-2"
        >
          <h3 className="text-sm font-semibold text-fg mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-accent-400" />
            Breakdown par dimension
          </h3>
          <div className="space-y-3">
            {report.scores.map((s) => {
              const dim = DIMENSIONS_BY_ID[s.id]
              const colorClass =
                s.score >= 75 ? 'text-success' : s.score >= 50 ? 'text-warning' : 'text-danger'
              const bgClass =
                s.score >= 75 ? 'bg-success' : s.score >= 50 ? 'bg-warning' : 'bg-danger'
              return (
                <div key={s.id}>
                  <div className="flex items-baseline justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-fg">{dim?.label}</span>
                      <span className="text-2xs text-fg-faint font-mono">
                        weight {(dim?.weight ?? 0) * 100}%
                      </span>
                    </div>
                    <span className={`text-sm font-mono font-bold ${colorClass}`}>
                      {s.score}/100
                    </span>
                  </div>
                  <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${bgClass}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${s.score}%` }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    />
                  </div>
                  <p className="mt-1 text-2xs text-fg-subtle">{s.reasoning}</p>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Strengths + Red flags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-5 border-success/20 bg-success/5"
        >
          <h3 className="text-sm font-semibold text-success mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Points forts ({report.strengths.length})
          </h3>
          {report.strengths.length === 0 ? (
            <p className="text-sm text-fg-subtle">Aucun signal positif fort détecté.</p>
          ) : (
            <ul className="space-y-2">
              {report.strengths.map((s, i) => (
                <li key={i} className="text-sm text-fg-muted flex gap-2">
                  <span className="text-success mt-0.5">+</span>
                  <span>{s.message}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-5 border-danger/20 bg-danger/5"
        >
          <h3 className="text-sm font-semibold text-danger mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Red flags ({report.redFlags.length})
          </h3>
          {report.redFlags.length === 0 ? (
            <p className="text-sm text-fg-subtle">Aucun red flag majeur.</p>
          ) : (
            <ul className="space-y-2">
              {report.redFlags.map((f, i) => (
                <li key={i} className="text-sm text-fg-muted flex gap-2">
                  <span
                    className={`text-2xs font-mono uppercase shrink-0 mt-0.5 ${
                      f.severity === 'critical'
                        ? 'text-danger'
                        : f.severity === 'major'
                        ? 'text-warning'
                        : 'text-fg-faint'
                    }`}
                  >
                    [{f.severity[0]}]
                  </span>
                  <span>{f.message}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>

      {/* Pivots */}
      {report.pivots.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card p-5 border-warning/20"
        >
          <h3 className="text-sm font-semibold text-warning mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Pivots suggérés
          </h3>
          <ul className="space-y-2">
            {report.pivots.map((p, i) => (
              <li key={i} className="text-sm text-fg-muted">
                <span className="text-warning font-mono mr-2">{i + 1}.</span>
                {p}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Next actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-5 border-accent-500/30"
      >
        <h3 className="text-sm font-semibold text-accent-300 mb-3 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Prochaines actions
        </h3>
        <ul className="space-y-2">
          {report.nextActions.map((a, i) => (
            <li key={i} className="text-sm text-fg flex gap-3">
              <span className="shrink-0 w-5 h-5 rounded-full bg-accent-500/15 text-accent-300 text-2xs font-mono flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* IA opt-in panel */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="card p-5 border-accent-500/30 bg-gradient-to-br from-accent-500/5 to-transparent"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-sm font-semibold text-fg flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-400" />
              Approfondir avec l'IA (Groq · gratuit)
            </h3>
            <p className="mt-1 text-xs text-fg-muted">
              Analyse complémentaire qui challenge le scoring heuristique. Verdict argumenté, risques majeurs, next steps.
            </p>
          </div>
          {!report.aiAnalysis && !aiLoading && (
            <button
              onClick={runAi}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-accent-500 hover:bg-accent-400 text-white shadow-glow-sm transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Lancer l'analyse IA
            </button>
          )}
          {aiLoading && (
            <div className="flex items-center gap-2 text-sm text-accent-300">
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyse en cours...
            </div>
          )}
          {report.aiAnalysis && (
            <button
              onClick={runAi}
              className="px-3 py-1.5 text-xs rounded-md bg-bg-elevated hover:bg-bg-surface text-fg-muted border border-border transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" /> Re-analyser
            </button>
          )}
        </div>

        {/* Key prompt */}
        <AnimatePresence>
          {showKeyPrompt && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 rounded-lg border border-accent-500/30 bg-bg-elevated/50 overflow-hidden"
            >
              <div className="flex items-center gap-2 text-xs text-fg-muted mb-2">
                <Key className="w-3.5 h-3.5 text-accent-400" />
                Clé API Groq requise (gratuite sur{' '}
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-300 underline"
                >
                  console.groq.com/keys
                </a>
                )
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="gsk_..."
                  className="flex-1 px-3 py-1.5 text-sm bg-bg border border-border rounded-md focus:border-accent-500 focus:outline-none font-mono"
                  autoFocus
                />
                <button
                  onClick={handleSaveKey}
                  disabled={!tempKey.trim()}
                  className="px-3 py-1.5 text-xs font-medium rounded-md bg-accent-500 hover:bg-accent-400 disabled:opacity-40 text-white transition"
                >
                  Sauvegarder & analyser
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {aiError && (
          <div className="mt-4 p-3 rounded-lg bg-danger/10 border border-danger/30 text-sm text-danger flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <div>{aiError.msg}</div>
              {aiError.hint && <div className="text-xs text-fg-muted mt-1">{aiError.hint}</div>}
            </div>
          </div>
        )}

        {/* AI analysis output */}
        {report.aiAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 space-y-4"
          >
            <div className="p-4 rounded-lg bg-bg-elevated/40 border border-border">
              <div className="text-2xs uppercase tracking-widest text-accent-300 font-mono mb-2">
                Résumé IA
              </div>
              <p className="text-sm text-fg leading-relaxed">{report.aiAnalysis.summary}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ScoreBox label="Faisabilité" score={report.aiAnalysis.feasibilityScore} />
              <ScoreBox label="Rentabilité" score={report.aiAnalysis.profitabilityScore} />
            </div>

            {report.aiAnalysis.topRisks.length > 0 && (
              <ListBox
                title="Risques majeurs"
                items={report.aiAnalysis.topRisks}
                tone="danger"
              />
            )}
            {report.aiAnalysis.topStrengths.length > 0 && (
              <ListBox
                title="Forces clés"
                items={report.aiAnalysis.topStrengths}
                tone="success"
              />
            )}
            {report.aiAnalysis.nextSteps.length > 0 && (
              <ListBox
                title="Next steps IA"
                items={report.aiAnalysis.nextSteps}
                tone="accent"
              />
            )}

            <div className="p-4 rounded-lg bg-gradient-to-br from-accent-500/10 to-transparent border border-accent-500/30">
              <div className="text-2xs uppercase tracking-widest text-accent-300 font-mono mb-2">
                Verdict final IA
              </div>
              <p className="text-base text-fg font-medium leading-relaxed">
                {report.aiAnalysis.finalVerdict}
              </p>
              <div className="mt-2 text-2xs text-fg-faint font-mono">
                {report.aiAnalysis.model} · {new Date(report.aiAnalysis.generatedAt).toLocaleString('fr-FR')}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Export actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-5"
      >
        <h3 className="text-sm font-semibold text-fg mb-3">Export</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportToProject}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-accent-500 hover:bg-accent-400 disabled:opacity-50 text-white transition"
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4" />
            )}
            Sauvegarder dans 02-discovery/ideas/
          </button>
          <button
            onClick={handleDownloadMd}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-bg-elevated hover:bg-bg-surface text-fg border border-border transition"
          >
            <Download className="w-4 h-4" />
            Télécharger .md
          </button>
          <Link
            to="/tools/idea-analyzer"
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg text-fg-muted hover:text-fg hover:bg-bg-elevated transition ml-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Historique
          </Link>
        </div>
        {exportResult && (
          <div className="mt-3 p-3 rounded-lg bg-success/10 border border-success/30 text-sm text-success flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Sauvegardé dans <code className="font-mono">{exportResult}</code>
          </div>
        )}
        {exportError && (
          <div className="mt-3 p-3 rounded-lg bg-danger/10 border border-danger/30 text-sm text-danger flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Erreur : {exportError}
          </div>
        )}
      </motion.div>
    </div>
  )
}

function ScoreBox({ label, score }: { label: string; score: number }) {
  const color = score >= 7 ? 'text-success' : score >= 4 ? 'text-warning' : 'text-danger'
  return (
    <div className="p-3 rounded-lg bg-bg-elevated/40 border border-border text-center">
      <div className="text-2xs uppercase tracking-widest text-fg-subtle font-mono">{label}</div>
      <div className={`text-2xl font-bold ${color} font-mono mt-1`}>
        {score}
        <span className="text-sm text-fg-faint">/10</span>
      </div>
    </div>
  )
}

function ListBox({
  title,
  items,
  tone,
}: {
  title: string
  items: string[]
  tone: 'danger' | 'success' | 'accent'
}) {
  const colors =
    tone === 'danger'
      ? 'border-danger/30 text-danger'
      : tone === 'success'
      ? 'border-success/30 text-success'
      : 'border-accent-500/30 text-accent-300'
  return (
    <div className={`p-4 rounded-lg bg-bg-elevated/30 border ${colors}`}>
      <div className="text-2xs uppercase tracking-widest font-mono mb-2">{title}</div>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="text-sm text-fg-muted flex gap-2">
            <span className="opacity-60 font-mono">·</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
