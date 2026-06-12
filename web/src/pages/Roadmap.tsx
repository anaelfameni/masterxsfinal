import { motion } from 'framer-motion'
import { Calendar, TrendingUp, CheckCircle2, Circle, Flag, Video } from 'lucide-react'
import { roadmap6Weeks, arrRoadmap } from '@/lib/playbook-data'
import { cn } from '@/lib/utils'

const currentWeek = 1

export default function Roadmap() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <header>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/30 text-2xs text-accent-300 font-mono">
          <Calendar className="w-3 h-3" />
          Roadmap MasterXS
        </div>
        <h1 className="mt-4 text-4xl lg:text-5xl font-semibold tracking-tighter gradient-text">
          Du playbook au $1M ARR
        </h1>
        <p className="mt-3 max-w-2xl text-fg-muted">
          Deux roadmaps complémentaires : <strong className="text-fg">6 semaines de boot</strong> pour activer le playbook, puis <strong className="text-fg">Phase 0 → 5</strong> pour le scaling du SaaS.
        </p>
      </header>

      {/* Section 1 — 6 weeks roadmap */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <span className="w-1 h-6 rounded-full bg-accent-500" />
          <h2 className="text-2xl font-semibold text-fg tracking-tight">
            Boot 6 semaines
          </h2>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-4">
            {roadmap6Weeks.map((w, idx) => {
              const isPast = w.week < currentWeek
              const isCurrent = w.week === currentWeek
              return (
                <motion.div
                  key={w.week}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="relative pl-16"
                >
                  {/* Dot */}
                  <div
                    className={cn(
                      'absolute left-3 top-3 w-6 h-6 rounded-full border-2 flex items-center justify-center text-2xs font-mono font-semibold',
                      isPast && 'bg-success border-success text-bg',
                      isCurrent && 'bg-gradient-violet border-accent-400 text-white shadow-glow',
                      !isPast && !isCurrent && 'bg-bg-surface border-border text-fg-subtle'
                    )}
                  >
                    {isPast ? <CheckCircle2 className="w-3 h-3" /> : w.week}
                  </div>

                  {/* Card */}
                  <div
                    className={cn(
                      'card p-5',
                      isCurrent && 'border-accent-500/40 shadow-glow-sm'
                    )}
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 text-2xs font-mono">
                          <span className="text-accent-400 font-semibold">{w.cluster}</span>
                          <span className="text-fg-faint">·</span>
                          <span className="text-fg-faint">Semaine {w.week}</span>
                          {w.videosCount > 0 && (
                            <>
                              <span className="text-fg-faint">·</span>
                              <span className="text-fg-subtle flex items-center gap-1">
                                <Video className="w-3 h-3" />
                                {w.videosCount} vidéos
                              </span>
                            </>
                          )}
                        </div>
                        <h3 className="mt-1.5 text-lg font-semibold text-fg">{w.title}</h3>
                      </div>
                      {isCurrent && (
                        <span className="pill-violet">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-glow-pulse" />
                          EN COURS
                        </span>
                      )}
                      {isPast && (
                        <span className="pill-success">
                          <CheckCircle2 className="w-3 h-3" />
                          TERMINÉ
                        </span>
                      )}
                    </div>

                    {/* Deliverables */}
                    <ul className="mt-4 space-y-1.5">
                      {w.deliverables.map((d, didx) => (
                        <li key={didx} className="flex items-start gap-2 text-sm text-fg-muted">
                          <Circle className="w-3 h-3 mt-1 text-fg-faint shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Section 2 — Phase 0-5 ARR Roadmap */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <span className="w-1 h-6 rounded-full bg-accent-500" />
          <h2 className="text-2xl font-semibold text-fg tracking-tight flex items-center gap-2">
            Roadmap Phase 0 → 5
            <TrendingUp className="w-5 h-5 text-accent-400" />
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {arrRoadmap.map((p, idx) => (
            <motion.div
              key={p.phase}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="card p-5 relative overflow-hidden"
            >
              <div
                aria-hidden
                className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-accent-500/10 blur-2xl"
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="text-2xs uppercase tracking-widest font-mono text-accent-300">
                    {p.phase}
                  </span>
                  <span className="text-2xs font-mono text-fg-faint">{p.duration}</span>
                </div>
                <h3 className="mt-2 text-xl font-semibold text-fg tracking-tight">
                  {p.title}
                </h3>
                <div className="mt-4">
                  <div className="text-2xs uppercase tracking-widest text-fg-faint font-semibold mb-1.5 flex items-center gap-1.5">
                    <Flag className="w-3 h-3" />
                    Goal
                  </div>
                  <p className="text-sm text-fg-muted leading-relaxed">{p.goal}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-2xs uppercase tracking-widest text-fg-faint font-semibold mb-1.5">
                    Decision gate
                  </div>
                  <p className="text-xs text-accent-300 leading-relaxed font-medium">
                    {p.decisionGate}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
