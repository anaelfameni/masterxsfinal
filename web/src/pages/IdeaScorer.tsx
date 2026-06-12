import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calculator, RefreshCcw, Sparkles, Target, AlertTriangle } from 'lucide-react'
import { scoringRubric, getScoreVerdict, computeMaxScore } from '@/lib/playbook-data'
import { cn } from '@/lib/utils'

export default function IdeaScorer() {
  const [ideaName, setIdeaName] = useState('')
  const [scores, setScores] = useState<Record<number, number>>({})

  const totalScore = useMemo(
    () => scoringRubric.reduce((sum, d) => sum + (scores[d.id] || 0) * d.weight, 0),
    [scores]
  )

  const maxScore = computeMaxScore()
  const percent = Math.round((totalScore / maxScore) * 100)
  const verdict = getScoreVerdict(totalScore)
  const allFilled = scoringRubric.every((d) => scores[d.id] !== undefined)

  const setScore = (id: number, value: number) => {
    setScores((prev) => ({ ...prev, [id]: value }))
  }

  const reset = () => {
    setIdeaName('')
    setScores({})
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <header>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/30 text-2xs text-accent-300 font-mono">
          <Calculator className="w-3 h-3" />
          Outil interactif
        </div>
        <h1 className="mt-4 text-4xl lg:text-5xl font-semibold tracking-tighter gradient-text">
          Idea Scorer
        </h1>
        <p className="mt-3 max-w-2xl text-fg-muted">
          Score une idée selon les 12 dimensions du playbook (pondérées).
          Verdict instantané : kill, hopper, validate, pre-sell ou commit 90j.
        </p>
      </header>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Form */}
        <div className="space-y-6 min-w-0">
          {/* Idea name */}
          <div className="card p-5">
            <label className="block text-2xs uppercase tracking-widest text-fg-faint font-semibold mb-2">
              Nom de l'idée
            </label>
            <input
              type="text"
              value={ideaName}
              onChange={(e) => setIdeaName(e.target.value)}
              placeholder="Ex: Invoicing for indie psychotherapists"
              className="w-full px-3 py-2 rounded-lg bg-bg-elevated border border-border text-fg placeholder:text-fg-faint focus:border-accent-500/60 focus:outline-none transition-colors"
            />
          </div>

          {/* Dimensions */}
          <div className="space-y-3">
            {scoringRubric.map((d, idx) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                className="card p-4"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-2xs font-mono text-fg-faint">#{d.id}</span>
                      <span className="font-medium text-fg">{d.name}</span>
                      <span className="pill-violet text-2xs">×{d.weight}</span>
                    </div>
                    <p className="mt-1 text-xs text-fg-subtle">{d.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-2xs text-fg-faint font-mono">Score</div>
                    <div className="text-lg font-semibold tabular-nums text-accent-300">
                      {scores[d.id] !== undefined ? scores[d.id] * d.weight : '—'}
                    </div>
                  </div>
                </div>

                {/* Score buttons 0-5 */}
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setScore(d.id, n)}
                      className={cn(
                        'flex-1 h-10 rounded-md border transition-all font-mono text-sm',
                        scores[d.id] === n
                          ? 'border-accent-500 bg-accent-500/15 text-accent-200 shadow-glow-sm'
                          : 'border-border bg-bg-elevated text-fg-subtle hover:border-border-strong hover:text-fg-muted'
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Score sidebar */}
        <aside className="space-y-4">
          <div className="sticky top-24 space-y-4">
            {/* Score card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-6 relative overflow-hidden"
            >
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-violet-subtle opacity-50 pointer-events-none"
              />
              <div className="relative">
                <div className="flex items-center gap-2 text-2xs uppercase tracking-widest text-fg-faint font-semibold">
                  <Target className="w-3 h-3" />
                  Score total
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-5xl font-semibold tabular-nums tracking-tight gradient-text-violet">
                    {totalScore}
                  </span>
                  <span className="text-fg-subtle text-sm pb-1">/ {maxScore}</span>
                </div>
                <div className="text-xs text-fg-faint font-mono mt-1">{percent}%</div>

                {/* Progress bar */}
                <div className="mt-4 h-1.5 rounded-full bg-bg-overlay overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-violet shadow-glow-sm"
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                {/* Verdict */}
                {allFilled && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 pt-6 border-t border-border"
                  >
                    <div className="flex items-center gap-2 text-2xs uppercase tracking-widest text-fg-faint font-semibold mb-2">
                      <Sparkles className="w-3 h-3" />
                      Verdict
                    </div>
                    <div className={cn('text-2xl font-semibold tracking-tight', verdict.color)}>
                      {verdict.label}
                    </div>
                    <p className="mt-2 text-xs text-fg-muted leading-relaxed">
                      {verdict.description}
                    </p>
                  </motion.div>
                )}

                {!allFilled && (
                  <div className="mt-6 pt-6 border-t border-border flex items-start gap-2 text-2xs text-fg-subtle">
                    <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
                    <span>
                      Remplis les {scoringRubric.length - Object.keys(scores).length} dimensions
                      restantes pour le verdict.
                    </span>
                  </div>
                )}

                <button
                  onClick={reset}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-bg-elevated border border-border text-xs text-fg-muted hover:border-accent-500/40 hover:text-fg transition-all"
                >
                  <RefreshCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>
            </motion.div>

            {/* Verdicts legend */}
            <div className="card p-4 text-2xs space-y-1.5">
              <div className="text-fg-faint font-semibold uppercase tracking-widest mb-2">
                Échelle
              </div>
              <div className="flex justify-between text-fg-muted">
                <span>&lt; 50</span>
                <span className="text-danger font-medium">KILL</span>
              </div>
              <div className="flex justify-between text-fg-muted">
                <span>50-69</span>
                <span className="text-warning font-medium">HOPPER</span>
              </div>
              <div className="flex justify-between text-fg-muted">
                <span>70-84</span>
                <span className="text-info font-medium">VALIDATE</span>
              </div>
              <div className="flex justify-between text-fg-muted">
                <span>85-99</span>
                <span className="text-accent-400 font-medium">PRE-SELL</span>
              </div>
              <div className="flex justify-between text-fg-muted">
                <span>100+</span>
                <span className="text-success font-medium">COMMIT 90J</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
