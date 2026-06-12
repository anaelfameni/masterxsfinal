import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Skull,
  Loader2,
  Sparkles,
  AlertTriangle,
} from 'lucide-react'
import { QUESTIONS, BLOCK_META } from '@/lib/idea-analyzer/questions'
import { analyzeIdea } from '@/lib/idea-analyzer/heuristic'
import {
  saveDraft,
  loadDraft,
  clearDraft,
  saveReport,
} from '@/lib/idea-analyzer/storage'
import type { Answers, AnswerValue, BlockId } from '@/lib/idea-analyzer/types'

const blockColor: Record<BlockId, { border: string; text: string; bg: string; glow: string }> = {
  A: { border: 'border-info/40', text: 'text-info', bg: 'bg-info/10', glow: 'shadow-info/20' },
  B: { border: 'border-warning/40', text: 'text-warning', bg: 'bg-warning/10', glow: 'shadow-warning/20' },
  C: { border: 'border-danger/40', text: 'text-danger', bg: 'bg-danger/10', glow: 'shadow-danger/20' },
}

export default function IdeaAnalyzerWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [submitting, setSubmitting] = useState(false)

  // Restore draft on mount
  useEffect(() => {
    const draft = loadDraft()
    if (draft) {
      setAnswers(draft.answers)
      setStep(Math.min(draft.currentStep, QUESTIONS.length - 1))
    }
  }, [])

  // Auto-save draft on changes
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      saveDraft(answers, step)
    }
  }, [answers, step])

  const total = QUESTIONS.length
  const current = QUESTIONS[step]
  const progress = ((step + 1) / total) * 100
  const blockMeta = BLOCK_META[current.block]
  const colors = blockColor[current.block]

  // Validation : la valeur courante est-elle "remplie" ?
  const currentValue = answers[current.id]
  const isFilled = useMemo(() => {
    if (current.type === 'select') {
      return currentValue != null && currentValue !== ''
    }
    if (current.type === 'longtext' || current.type === 'text') {
      const min = current.minLength ?? 1
      return typeof currentValue === 'string' && currentValue.trim().length >= min
    }
    return currentValue != null && currentValue !== ''
  }, [current, currentValue])

  const canNext = !current.required || isFilled
  const isLast = step === total - 1

  function setAnswer(value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [current.id]: value }))
  }

  function goNext() {
    if (!canNext) return
    if (isLast) {
      submit()
    } else {
      setStep((s) => Math.min(s + 1, total - 1))
    }
  }

  function goPrev() {
    setStep((s) => Math.max(s - 1, 0))
  }

  async function submit() {
    setSubmitting(true)
    // Petit délai pour montrer l'animation
    await new Promise((r) => setTimeout(r, 600))
    const report = analyzeIdea(answers)
    saveReport(report)
    clearDraft()
    navigate(`/tools/idea-analyzer/result/${report.id}`)
  }

  // Compteur de blocs
  const blockProgress = useMemo(() => {
    const a = QUESTIONS.filter((q) => q.block === 'A')
    const b = QUESTIONS.filter((q) => q.block === 'B')
    const c = QUESTIONS.filter((q) => q.block === 'C')
    return { A: a.length, B: b.length, C: c.length }
  }, [])

  // Calcul de l'étape dans le bloc courant
  const stepInBlock = useMemo(() => {
    return QUESTIONS.slice(0, step).filter((q) => q.block === current.block).length + 1
  }, [step, current.block])

  if (submitting) {
    return (
      <div className="max-w-xl mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 rounded-full border-2 border-accent-500/30 border-t-accent-400 mb-6"
        />
        <h2 className="text-xl font-semibold text-fg">Analyse en cours...</h2>
        <p className="text-fg-muted mt-2 text-sm">
          Scoring 6 dimensions · détection red flags · génération du verdict.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-md border ${colors.border} ${colors.bg} ${colors.text} font-mono text-2xs uppercase tracking-wider`}>
              Bloc {current.block} · {stepInBlock}/{blockProgress[current.block]}
            </span>
            <span className="text-fg-muted">{blockMeta.title}</span>
          </div>
          <div className="text-fg-subtle font-mono">
            {step + 1}/{total} · ~{Math.max(1, Math.ceil((total - step) * 25 / 60))} min restantes
          </div>
        </div>
        <div className="h-1 bg-bg-elevated rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-violet"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-xs text-fg-subtle mt-2">{blockMeta.subtitle}</p>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
          className="card p-6 sm:p-8 border-border"
        >
          <div className="text-2xs uppercase tracking-widest text-accent-300 font-mono mb-3">
            Question {step + 1}
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-fg leading-tight">
            {current.label}
          </h2>
          {current.helper && (
            <p className="mt-3 text-sm text-fg-muted leading-relaxed">{current.helper}</p>
          )}

          <div className="mt-6">
            {(current.type === 'text' || current.type === 'longtext') && (
              <textarea
                value={(currentValue as string) || ''}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={current.placeholder}
                rows={current.type === 'longtext' ? 5 : 2}
                className="w-full px-4 py-3 bg-bg border border-border rounded-lg focus:border-accent-500 focus:outline-none focus:shadow-glow-sm text-sm text-fg placeholder:text-fg-subtle resize-none leading-relaxed"
                autoFocus
              />
            )}

            {current.type === 'select' && current.options && (
              <div className="space-y-2">
                {current.options.map((opt) => {
                  const selected = currentValue === opt.value
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setAnswer(opt.value)}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                        selected
                          ? 'border-accent-500 bg-accent-500/10 text-fg shadow-glow-sm'
                          : 'border-border bg-bg hover:border-accent-500/40 hover:bg-bg-elevated text-fg-muted'
                      }`}
                    >
                      <span className="text-sm">{opt.label}</span>
                      <div
                        className={`shrink-0 w-4 h-4 rounded-full border-2 transition-all ${
                          selected ? 'border-accent-400 bg-accent-500' : 'border-border'
                        }`}
                      />
                    </button>
                  )
                })}
              </div>
            )}

            {/* Counter for longtext */}
            {(current.type === 'longtext' || current.type === 'text') && current.minLength && (
              <div className="mt-2 flex items-center justify-between text-2xs text-fg-subtle">
                <span>
                  Min : {current.minLength} caractères
                </span>
                <span className={isFilled ? 'text-success' : 'text-fg-faint'}>
                  {((currentValue as string) || '').length} / {current.minLength}+
                </span>
              </div>
            )}
          </div>

          {/* Red flag preview pour signaux bloquants */}
          {current.id === 'q4_conversations' && currentValue === '0' && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-danger/10 border border-danger/30 text-xs text-danger"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Red flag critique détecté.</strong> Sans conversation client, ton idée est une hypothèse non vérifiée. L'analyse signalera un Early Kill.
              </div>
            </motion.div>
          )}
          {current.id === 'q14_intrinsic' && currentValue === 'no' && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-danger/10 border border-danger/30 text-xs text-danger"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Motivation extrinsèque détectée.</strong> Risque d'abandon élevé au 1er creux. L'analyse signalera un Early Kill.
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav buttons */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={step === 0}
          className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg text-fg-muted hover:text-fg hover:bg-bg-elevated disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-4 h-4" /> Précédent
        </button>

        <div className="flex items-center gap-3">
          <Link
            to="/tools/idea-analyzer"
            className="text-xs text-fg-subtle hover:text-fg-muted transition"
          >
            Sortir
          </Link>
          <button
            onClick={goNext}
            disabled={!canNext}
            className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium rounded-lg bg-accent-500 hover:bg-accent-400 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-glow-sm transition"
          >
            {isLast ? (
              <>
                <Skull className="w-4 h-4" /> Lancer l'analyse
              </>
            ) : (
              <>
                Continuer <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Helper hint */}
      <div className="mt-4 text-2xs text-fg-faint text-center">
        Brouillon auto-sauvegardé · Tu peux fermer et revenir à tout moment
      </div>
    </div>
  )
}
