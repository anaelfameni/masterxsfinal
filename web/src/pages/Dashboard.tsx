import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  Calendar,
  CheckCircle2,
  Circle,
  Zap,
  BookOpen,
  Map,
  Calculator,
  ScrollText,
} from 'lucide-react'
import { stats, allFiles } from '@/lib/content'
import { modules, roadmap6Weeks, commandments } from '@/lib/playbook-data'
import { cn } from '@/lib/utils'

const heroStats = [
  { label: 'Modules L0-L7', valueKey: 'modulesCount', icon: Target },
  { label: 'Fichiers .md', valueKey: 'totalFiles', icon: BookOpen },
  { label: 'Fichiers remplis', valueKey: 'filledFiles', icon: CheckCircle2 },
  { label: 'À enrichir', valueKey: 'stubFiles', icon: Circle },
]

export default function Dashboard() {
  const filledPercent = Math.round((stats.filledFiles / stats.totalFiles) * 100)
  const currentWeek = 1 // S1 — Skeleton + OS personnel

  const nextActions = [
    {
      title: 'Compléter ton OS personnel',
      description: 'Remplir cadence.md, decision-frameworks.md et energy-protocol.md',
      to: '/modules/00-os-personnel',
      effort: '~2h',
      priority: 'high' as const,
    },
    {
      title: 'Démarrer Cluster C1 — Mindset',
      description: '4 vidéos Hormozi à extraire selon protocole EXTRACT-CODE',
      to: '/playbook#4-extraction',
      effort: '~10h',
      priority: 'medium' as const,
    },
    {
      title: 'Tester le scoring sur 5 idées',
      description: 'Utilise l\'Idea Scorer pour filtrer ton hopper actuel',
      to: '/tools/idea-scorer',
      effort: '~1h',
      priority: 'medium' as const,
    },
  ]

  const recentFiles = allFiles
    .filter((f) => !f.isStub && f.module)
    .slice(0, 5)

  return (
    <div className="space-y-10">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative card overflow-hidden p-8 lg:p-12"
      >
        <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
        <div
          aria-hidden
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.15), transparent 60%)' }}
        />

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/30 text-2xs text-accent-300 font-mono mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-glow-pulse" />
            Phase 1 — Playbook personnel actif
          </div>

          <h1 className="text-4xl lg:text-6xl font-semibold tracking-tighter leading-[1.05]">
            <span className="gradient-text-violet">MasterXS</span>
            <br />
            <span className="text-fg-muted text-2xl lg:text-3xl font-normal">
              Le système d'exploitation du solo founder.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-fg-muted leading-relaxed">
            Un playbook vivant qui transforme idées → revenus récurrents.
            8 modules. 6 semaines de boot. 0€ de stack. <br />
            <span className="text-fg">Build → mesure → itère. Sans bullshit.</span>
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/playbook"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-violet text-white text-sm font-medium shadow-glow hover:shadow-glow-lg transition-all"
            >
              <BookOpen className="w-4 h-4" />
              Lire le playbook
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/roadmap"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-bg-elevated border border-border text-fg text-sm font-medium hover:border-accent-500/50 hover:bg-bg-overlay transition-all"
            >
              <Map className="w-4 h-4" />
              Voir la roadmap
            </Link>
            <Link
              to="/tools/idea-scorer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-bg-elevated border border-border text-fg-muted text-sm font-medium hover:border-accent-500/50 hover:text-fg transition-all"
            >
              <Calculator className="w-4 h-4" />
              Idea Scorer
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Stats grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {heroStats.map((s, idx) => {
          const value = stats[s.valueKey as keyof typeof stats] as number
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="card card-hover p-5"
            >
              <div className="flex items-start justify-between">
                <div className="text-2xs uppercase tracking-widest text-fg-subtle font-semibold">
                  {s.label}
                </div>
                <s.icon className="w-4 h-4 text-accent-400/60" />
              </div>
              <div className="mt-3 text-3xl font-semibold tabular-nums tracking-tight">
                {value}
              </div>
            </motion.div>
          )
        })}
      </section>

      {/* Progress + Next actions */}
      <section className="grid lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Progress card */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="card p-6 lg:col-span-1"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-fg-muted">
            <TrendingUp className="w-4 h-4 text-accent-400" />
            Progression playbook
          </div>
          <div className="mt-5 flex items-end gap-2">
            <span className="text-5xl font-semibold tabular-nums tracking-tight gradient-text-violet">
              {filledPercent}
            </span>
            <span className="text-fg-subtle text-sm pb-1.5">%</span>
          </div>
          <p className="mt-1 text-xs text-fg-subtle">
            {stats.filledFiles} / {stats.totalFiles} fichiers remplis
          </p>

          {/* Bar */}
          <div className="mt-4 h-2 rounded-full bg-bg-overlay overflow-hidden">
            <motion.div
              className="h-full bg-gradient-violet shadow-glow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${filledPercent}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>

          <div className="mt-6 pt-6 border-t border-border space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-fg-subtle">Semaine actuelle</span>
              <span className="font-mono text-accent-300">S{currentWeek} / 6</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-fg-subtle">Phase</span>
              <span className="text-fg">1 — Playbook perso</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-fg-subtle">Goal Y1</span>
              <span className="text-fg font-mono">3-5K MRR</span>
            </div>
          </div>
        </motion.div>

        {/* Next actions */}
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-fg-muted">
              <Zap className="w-4 h-4 text-accent-400" />
              Prochaines actions
            </div>
            <span className="text-2xs font-mono text-fg-faint">
              Décide. Exécute. Itère.
            </span>
          </div>

          <div className="mt-4 space-y-2">
            {nextActions.map((a, idx) => (
              <Link
                key={idx}
                to={a.to}
                className="group flex items-start gap-3 p-3 -mx-1 rounded-lg hover:bg-bg-elevated transition-colors"
              >
                <span
                  className={cn(
                    'mt-1 w-1.5 h-1.5 rounded-full shrink-0',
                    a.priority === 'high' ? 'bg-accent-400 shadow-glow-sm' : 'bg-fg-subtle'
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-fg group-hover:text-accent-300 transition-colors">
                      {a.title}
                    </span>
                    <span className="text-2xs text-fg-faint font-mono">· {a.effort}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-fg-subtle">{a.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-fg-faint group-hover:text-accent-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
              </Link>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Modules grid + 6-week roadmap */}
      <section className="grid lg:grid-cols-5 gap-4 lg:gap-6">
        {/* Modules */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-fg flex items-center gap-2">
              <Target className="w-4 h-4 text-accent-400" />
              Modules L0-L7
            </h2>
            <Link to="/modules" className="text-xs text-fg-muted hover:text-accent-300 transition-colors">
              Tout voir →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {modules.slice(0, 6).map((m, idx) => (
              <motion.div
                key={m.slug}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
              >
                <Link
                  to={`/modules/${m.slug}`}
                  className="group card card-hover p-4 flex items-start gap-3 h-full"
                >
                  <div
                    className={cn(
                      'w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br shrink-0 shadow-glow-sm',
                      m.color
                    )}
                  >
                    <m.icon className="w-4 h-4 text-white" strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-2xs font-mono text-fg-faint">
                      <span>{m.layer}</span>
                      <span>·</span>
                      <span>{m.slug}</span>
                    </div>
                    <h3 className="mt-1 font-medium text-fg group-hover:text-accent-300 transition-colors leading-tight">
                      {m.title}
                    </h3>
                    <p className="mt-1 text-2xs text-fg-subtle line-clamp-2 leading-relaxed">
                      {m.purpose}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Roadmap 6 weeks compact */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-fg flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent-400" />
              Roadmap 6 semaines
            </h2>
            <Link to="/roadmap" className="text-xs text-fg-muted hover:text-accent-300 transition-colors">
              Détails →
            </Link>
          </div>

          <div className="card p-4 space-y-2.5">
            {roadmap6Weeks.map((w) => {
              const isPast = w.week < currentWeek
              const isCurrent = w.week === currentWeek
              return (
                <div
                  key={w.week}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                    isCurrent && 'bg-accent-500/10 border border-accent-500/30'
                  )}
                >
                  <span
                    className={cn(
                      'shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-2xs font-mono font-semibold',
                      isPast && 'bg-success/20 text-success',
                      isCurrent && 'bg-gradient-violet text-white shadow-glow-sm',
                      !isPast && !isCurrent && 'bg-bg-elevated text-fg-subtle'
                    )}
                  >
                    {w.cluster}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className={cn('text-sm font-medium truncate', isCurrent ? 'text-fg' : 'text-fg-muted')}>
                      {w.title}
                    </div>
                    {w.videosCount > 0 && (
                      <div className="text-2xs text-fg-faint">{w.videosCount} vidéos</div>
                    )}
                  </div>
                  {isPast && <CheckCircle2 className="w-4 h-4 text-success shrink-0" />}
                  {isCurrent && (
                    <span className="text-2xs font-mono text-accent-300 shrink-0">EN COURS</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured commandment + recent files */}
      <section className="grid lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Random commandment */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card p-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-violet-subtle opacity-40 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 text-sm font-medium text-fg-muted">
              <ScrollText className="w-4 h-4 text-accent-400" />
              Commandement #{Math.min(commandments.length, 1)}
            </div>
            <blockquote className="mt-4 text-2xl lg:text-3xl font-semibold tracking-tight gradient-text leading-tight">
              "{commandments[0].text.replace(/\.$/, '')}"
            </blockquote>
            <Link
              to="/commandments"
              className="mt-6 inline-flex items-center gap-2 text-sm text-accent-300 hover:text-accent-200 transition-colors"
            >
              Les 20 commandements
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>

        {/* Recent files */}
        <div className="card p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-fg-muted">
            <Sparkles className="w-4 h-4 text-accent-400" />
            Fichiers remplis récemment
          </div>
          <div className="mt-4 space-y-1">
            {recentFiles.length > 0 ? (
              recentFiles.map((f) => (
                <Link
                  key={f.path}
                  to={`/file/${f.path}`}
                  className="group flex items-center gap-3 px-3 py-2 -mx-1 rounded-lg hover:bg-bg-elevated transition-colors"
                >
                  <div className="w-1 h-1 rounded-full bg-accent-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-fg group-hover:text-accent-300 transition-colors truncate">
                      {f.title}
                    </div>
                    <div className="text-2xs text-fg-faint font-mono truncate">{f.path}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-fg-faint group-hover:text-accent-400 transition-colors shrink-0" />
                </Link>
              ))
            ) : (
              <p className="text-sm text-fg-subtle py-3">
                Aucun fichier rempli pour l'instant. Commence par <Link to="/modules/00-os-personnel" className="text-accent-300 hover:underline">ton OS personnel</Link>.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
