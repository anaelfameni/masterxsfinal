import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertTriangle, ArrowRight, Brain, Loader2, TrendingUp, Trophy, Zap, Target,
} from 'lucide-react'
import {
  LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar,
} from 'recharts'
import { useStore } from '@/lib/store/StoreContext'
import { Card, Btn, PriorityBadge, HealthBadge } from '@/components/ui/primitives'
import {
  portfolioAlerts, recentWins, blockingTasks, isStagnant, daysUntil,
} from '@/lib/store/rules'
import { serializePortfolio, offlineCosReport } from '@/lib/businessgpt/offline-cos'
import { chiefOfStaffAnalysis } from '@/lib/businessgpt/client'
import MarkdownRenderer from '@/components/MarkdownRenderer'

export default function NowDashboard() {
  const { data, settings, setData, uid } = useStore()
  const [cosLoading, setCosLoading] = useState(false)
  const [cosError, setCosError] = useState<string | null>(null)

  const active = data.projects.filter((p) => p.status !== 'killed')
  const p1 = active.find((p) => p.priority === 'P1')
  const alerts = useMemo(() => portfolioAlerts(data), [data])
  const wins = useMemo(() => recentWins(data), [data])
  const blockers = useMemo(() => blockingTasks(data), [data])
  const atRisk = active.filter(
    (p) => p.health !== 'green' || isStagnant(p) || (daysUntil(p.deadline) ?? 99) <= 14
  )
  const totalMrr = data.projects.reduce((s, p) => s + (p.mrr || 0), 0)
  const openTasks = data.tasks.filter((t) => t.status !== 'done').length
  const lastCos = data.cosReports[0]

  const mrrChart = useMemo(() => {
    const byMonth = new Map<string, number>()
    for (const f of data.finances) {
      byMonth.set(f.month, (byMonth.get(f.month) || 0) + f.mrr)
    }
    return [...byMonth.entries()].sort().map(([month, mrr]) => ({ month, mrr }))
  }, [data.finances])

  const goalChart = useMemo(
    () =>
      data.objectives.flatMap((o) =>
        o.keyResults.map((k) => ({
          name: k.label.length > 18 ? k.label.slice(0, 18) + '…' : k.label,
          pct: k.target > 0 ? Math.round((k.current / k.target) * 100) : 0,
        }))
      ),
    [data.objectives]
  )

  async function runCos() {
    setCosError(null)
    setCosLoading(true)
    const summary = serializePortfolio(data)
    let content: string
    let mode: 'ai' | 'offline' = 'offline'
    if (settings.groqApiKey) {
      const res = await chiefOfStaffAnalysis(settings.groqApiKey, summary)
      if (res.ok) {
        content = res.content
        mode = 'ai'
      } else {
        setCosError(`${res.error}${res.hint ? ' — ' + res.hint : ''}`)
        content = offlineCosReport(data)
      }
    } else {
      content = offlineCosReport(data)
    }
    setData((prev) => ({
      ...prev,
      cosReports: [{ id: uid('cos'), createdAt: Date.now(), mode, content }, ...prev.cosReports].slice(0, 20),
    }))
    setCosLoading(false)
  }

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-fg-subtle capitalize">{today}</p>
          <h1 className="text-3xl font-semibold gradient-text-violet tracking-tight">Briefing du matin</h1>
        </div>
        <Btn variant="primary" onClick={runCos} disabled={cosLoading}>
          {cosLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
          Analyse Chief of Staff
        </Btn>
      </div>

      {/* Métriques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric icon={TrendingUp} label="MRR total" value={`${totalMrr.toLocaleString('fr-FR')}€`} />
        <Metric icon={Target} label="Projets actifs" value={String(active.length)} />
        <Metric icon={Zap} label="Tâches en cours" value={String(openTasks)} />
        <Metric icon={AlertTriangle} label="Alertes" value={String(alerts.length)} accent={alerts.length > 0} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bloquants */}
        <Card>
          <SectionTitle icon={AlertTriangle} title="Bloquant aujourd'hui" tone="danger" />
          {blockers.length === 0 && alerts.filter((a) => a.level === 'danger').length === 0 ? (
            <p className="text-sm text-fg-subtle">Rien ne bloque. Exécute ta prochaine action.</p>
          ) : (
            <ul className="space-y-2">
              {alerts.filter((a) => a.level === 'danger').map((a, i) => (
                <li key={`a-${i}`} className="text-sm text-danger flex gap-2">
                  <span>•</span>{a.message}
                </li>
              ))}
              {blockers.slice(0, 5).map((tk) => (
                <li key={tk.id} className="text-sm text-fg-muted flex gap-2">
                  <span className="text-danger">•</span>{tk.title}
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Next action P1 */}
        <Card className="glow-border">
          <SectionTitle icon={Zap} title="Prochaine action (P1)" tone="accent" />
          {p1 ? (
            <div>
              <Link to={`/projects/${p1.id}`} className="text-lg font-medium text-fg hover:text-accent-300 transition-colors">
                {p1.name}
              </Link>
              <p className="text-sm text-fg-muted mt-2">
                {p1.nextAction || '⚠️ Aucune prochaine action définie pour ton projet focus.'}
              </p>
            </div>
          ) : (
            <p className="text-sm text-warning">Aucun projet en P1. Définis ton focus de la semaine.</p>
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Projets à risque */}
        <Card>
          <SectionTitle icon={AlertTriangle} title="Projets à risque" tone="warning" />
          {atRisk.length === 0 ? (
            <p className="text-sm text-fg-subtle">Aucun projet à risque. 🟢</p>
          ) : (
            <ul className="space-y-3">
              {atRisk.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3">
                  <Link to={`/projects/${p.id}`} className="text-sm text-fg hover:text-accent-300 truncate">
                    {p.name}
                  </Link>
                  <div className="flex items-center gap-2 shrink-0">
                    <HealthBadge health={p.health} />
                    <PriorityBadge priority={p.priority} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Victoires */}
        <Card>
          <SectionTitle icon={Trophy} title="Victoires (7 jours)" tone="success" />
          {wins.length === 0 ? (
            <p className="text-sm text-fg-subtle">Pas encore de victoire cette semaine. Termine une tâche.</p>
          ) : (
            <ul className="space-y-2">
              {wins.map((w, i) => (
                <li key={i} className="text-sm text-fg-muted flex gap-2">
                  <span className="text-success">✓</span>{w}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <SectionTitle icon={TrendingUp} title="MRR dans le temps" />
          {mrrChart.length === 0 ? (
            <p className="text-sm text-fg-subtle">Renseigne tes finances pour visualiser le MRR.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={mrrChart} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip contentStyle={{ background: '#111', border: '1px solid #262626', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="mrr" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
        <Card>
          <SectionTitle icon={Target} title="Progression des objectifs" />
          {goalChart.length === 0 ? (
            <p className="text-sm text-fg-subtle">Aucun objectif défini.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={goalChart} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#71717a" fontSize={10} />
                <YAxis stroke="#71717a" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#111', border: '1px solid #262626', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="pct" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Rapport Chief of Staff */}
      {(lastCos || cosError) && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <SectionTitle icon={Brain} title="Analyse Chief of Staff" tone="accent" />
            {cosError && (
              <p className="text-xs text-warning mb-3">{cosError} (repli hors ligne utilisé)</p>
            )}
            {lastCos && (
              <>
                <p className="text-2xs text-fg-faint mb-3">
                  {lastCos.mode === 'ai' ? 'Généré par BusinessGPT' : 'Mode hors ligne (déterministe)'} ·{' '}
                  {new Date(lastCos.createdAt).toLocaleString('fr-FR')}
                </p>
                <div className="prose-md">
                  <MarkdownRenderer content={lastCos.content} />
                </div>
              </>
            )}
          </Card>
        </motion.div>
      )}

      <div className="flex justify-center pt-2">
        <Link to="/projects" className="text-sm text-fg-muted hover:text-accent-300 inline-flex items-center gap-1.5">
          Voir tous les projets <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}

function Metric({
  icon: Icon, label, value, accent,
}: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; accent?: boolean }) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent ? 'bg-danger/10 text-danger' : 'bg-accent-500/10 text-accent-400'}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <div className="text-xl font-semibold text-fg leading-none">{value}</div>
        <div className="text-2xs text-fg-subtle mt-1">{label}</div>
      </div>
    </Card>
  )
}

function SectionTitle({
  icon: Icon, title, tone = 'default',
}: { icon: React.ComponentType<{ className?: string }>; title: string; tone?: 'default' | 'danger' | 'warning' | 'success' | 'accent' }) {
  const tones = {
    default: 'text-fg-muted', danger: 'text-danger', warning: 'text-warning',
    success: 'text-success', accent: 'text-accent-400',
  }
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className={`w-4 h-4 ${tones[tone]}`} />
      <h2 className="text-sm font-semibold text-fg">{title}</h2>
    </div>
  )
}
