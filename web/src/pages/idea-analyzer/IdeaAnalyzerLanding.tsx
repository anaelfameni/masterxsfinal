import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Skull,
  ArrowRight,
  Trash2,
  FileSearch,
  Clock,
  Plus,
  Key,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import {
  listReports,
  deleteReport,
  loadDraft,
  clearDraft,
  getGroqKey,
  setGroqKey,
} from '@/lib/idea-analyzer/storage'
import { VERDICT_META } from '@/lib/idea-analyzer/questions'
import type { IdeaReport } from '@/lib/idea-analyzer/types'

const verdictColorClasses = {
  success: 'text-success border-success/40 bg-success/10',
  warning: 'text-warning border-warning/40 bg-warning/10',
  danger: 'text-danger border-danger/40 bg-danger/10',
  info: 'text-info border-info/40 bg-info/10',
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const min = Math.floor(diff / 60000)
  if (min < 1) return "à l'instant"
  if (min < 60) return `il y a ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `il y a ${h}h`
  const d = Math.floor(h / 24)
  return `il y a ${d}j`
}

export default function IdeaAnalyzerLanding() {
  const navigate = useNavigate()
  const [reports, setReports] = useState<IdeaReport[]>([])
  const [showKeyPanel, setShowKeyPanel] = useState(false)
  const [groqKey, setGroqKeyState] = useState('')
  const [keySaved, setKeySaved] = useState(false)

  useEffect(() => {
    setReports(listReports())
    setGroqKeyState(getGroqKey())
  }, [])

  const draft = useMemo(() => loadDraft(), [])

  function handleDelete(id: string) {
    if (!confirm('Supprimer cette analyse ?')) return
    deleteReport(id)
    setReports(listReports())
  }

  function handleStartNew() {
    if (draft && !confirm('Tu as une analyse en cours. Démarrer une nouvelle écrasera le brouillon. Continuer ?')) {
      return
    }
    clearDraft()
    navigate('/tools/idea-analyzer/new')
  }

  function handleSaveKey() {
    setGroqKey(groqKey.trim())
    setKeySaved(true)
    setTimeout(() => setKeySaved(false), 2000)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pb-2"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/30 text-2xs uppercase tracking-widest text-accent-300 font-mono mb-4">
          <Skull className="w-3 h-3" />
          Module L3 · Validation
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-fg tracking-tight">
          Tue ton idée avant qu'elle te tue.
        </h1>
        <p className="mt-3 text-fg-muted text-base sm:text-lg max-w-2xl mx-auto">
          Analyse stratégique en 6 minutes avant de perdre 6 mois sur le mauvais SaaS.
          <br />
          <span className="text-fg-subtle text-sm">15 questions · scoring 6 dimensions · verdict brutal.</span>
        </p>
      </motion.header>

      {/* CTA principal + brouillon */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <button
          onClick={handleStartNew}
          className="group relative p-6 rounded-xl bg-gradient-violet text-white text-left shadow-glow hover:shadow-glow-lg transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/10 group-hover:from-white/5 transition-all" />
          <Plus className="w-6 h-6 mb-3 relative z-10" />
          <div className="font-semibold text-lg relative z-10">Analyser une idée</div>
          <p className="text-sm text-white/80 mt-1 relative z-10">
            Wizard 3 blocs · ~6 min · verdict + plan d'action
          </p>
          <ArrowRight className="absolute top-5 right-5 w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </button>

        {draft ? (
          <Link
            to="/tools/idea-analyzer/new"
            className="group p-6 rounded-xl border border-warning/30 bg-warning/5 hover:bg-warning/10 transition-all"
          >
            <Clock className="w-6 h-6 mb-3 text-warning" />
            <div className="font-semibold text-warning">Reprendre le brouillon</div>
            <p className="text-sm text-fg-muted mt-1">
              Sauvegardé {timeAgo(draft.savedAt)} · étape {draft.currentStep + 1}/15
            </p>
            <ArrowRight className="w-4 h-4 mt-3 text-warning/70 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <button
            onClick={() => setShowKeyPanel((v) => !v)}
            className="group p-6 rounded-xl border border-border bg-bg-elevated/40 hover:bg-bg-elevated text-left transition-all"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-accent-300" />
              {getGroqKey() && <ShieldCheck className="w-4 h-4 text-success" />}
            </div>
            <div className="font-semibold text-fg">Approfondir avec IA</div>
            <p className="text-sm text-fg-muted mt-1">
              {getGroqKey()
                ? 'Clé Groq configurée — disponible sur chaque rapport'
                : 'Configurer ta clé Groq (gratuite, opt-in)'}
            </p>
          </button>
        )}
      </motion.div>

      {/* Groq key panel */}
      {showKeyPanel && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="card p-5 border-accent-500/30 space-y-3"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-fg">
            <Key className="w-4 h-4 text-accent-400" />
            Configurer Groq (analyse IA opt-in)
          </div>
          <p className="text-xs text-fg-muted">
            Récupère une clé gratuite sur{' '}
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-300 underline"
            >
              console.groq.com/keys
            </a>
            . Stockée uniquement dans ton navigateur (localStorage). Jamais envoyée ailleurs que sur l'API Groq.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={groqKey}
              onChange={(e) => setGroqKeyState(e.target.value)}
              placeholder="gsk_..."
              className="flex-1 px-3 py-2 text-sm bg-bg border border-border rounded-lg focus:border-accent-500 focus:outline-none font-mono"
            />
            <button
              onClick={handleSaveKey}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-accent-500 hover:bg-accent-400 text-white transition"
            >
              {keySaved ? 'Sauvegardé' : 'Sauvegarder'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Historique */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg font-semibold text-fg flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-accent-400" />
            Analyses précédentes
            <span className="text-fg-faint text-sm font-mono">({reports.length})</span>
          </h2>
        </div>

        {reports.length === 0 ? (
          <div className="card p-10 text-center border-dashed">
            <Skull className="w-8 h-8 text-fg-faint mx-auto mb-3" />
            <p className="text-fg-muted">Aucune idée analysée pour le moment.</p>
            <p className="text-xs text-fg-subtle mt-1">
              La 1ère analyse est souvent la plus instructive — elle te dit ce que tu refuses de voir.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {reports.map((r) => {
              const meta = VERDICT_META[r.verdict]
              const colorClass = verdictColorClasses[meta.color]
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="group flex items-center gap-3 p-4 rounded-lg border border-border bg-bg-surface/40 hover:bg-bg-elevated hover:border-accent-500/30 transition-all"
                >
                  <div className={`shrink-0 w-14 h-14 rounded-lg border flex flex-col items-center justify-center font-mono ${colorClass}`}>
                    <div className="text-lg font-bold leading-none">{r.globalScore}</div>
                    <div className="text-2xs uppercase tracking-wider mt-0.5">{meta.short}</div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link to={`/tools/idea-analyzer/result/${r.id}`} className="block">
                      <div className="font-medium text-fg truncate group-hover:text-accent-300 transition">
                        {r.title}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-fg-muted">
                        <span className={meta.color === 'success' ? 'text-success' : meta.color === 'danger' ? 'text-danger' : 'text-warning'}>
                          {meta.label}
                        </span>
                        <span className="text-fg-faint">·</span>
                        <span>{timeAgo(r.createdAt)}</span>
                        {r.aiAnalysis && (
                          <>
                            <span className="text-fg-faint">·</span>
                            <span className="inline-flex items-center gap-1 text-accent-300">
                              <Sparkles className="w-3 h-3" /> IA
                            </span>
                          </>
                        )}
                      </div>
                    </Link>
                  </div>

                  <button
                    onClick={() => handleDelete(r.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-md text-fg-muted hover:text-danger hover:bg-danger/10 transition-all"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
