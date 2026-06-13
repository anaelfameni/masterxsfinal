import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, FolderKanban, AlertTriangle } from 'lucide-react'
import { useStore } from '@/lib/store/StoreContext'
import { PageHeader, Card, Btn, PriorityBadge, HealthBadge, StatusBadge, EmptyState, inputCls } from '@/components/ui/primitives'
import { portfolioAlerts, daysSince } from '@/lib/store/rules'
import type { Project, ProjectPriority, ProjectStatus, ProjectHealth } from '@/lib/store/types'
import { t } from '@/lib/i18n'

export default function Projects() {
  const { data, setData, uid } = useStore()
  const [fPriority, setFPriority] = useState<ProjectPriority | 'all'>('all')
  const [fStatus, setFStatus] = useState<ProjectStatus | 'all'>('all')
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')

  const alerts = useMemo(() => portfolioAlerts(data), [data])

  const projects = data.projects
    .filter((p) => (fPriority === 'all' ? true : p.priority === fPriority))
    .filter((p) => (fStatus === 'all' ? true : p.status === fStatus))
    .sort((a, b) => a.priority.localeCompare(b.priority) || b.updatedAt - a.updatedAt)

  function createProject() {
    if (!name.trim()) return
    const now = Date.now()
    const p: Project = {
      id: uid('proj'), name: name.trim(), priority: 'P3', status: 'idea',
      health: 'green', mrr: 0, createdAt: now, updatedAt: now, lastActivityAt: now,
      blockedBy: null, deadline: null, goalId: null,
    }
    setData((prev) => ({ ...prev, projects: [p, ...prev.projects] }))
    setName('')
    setCreating(false)
  }

  return (
    <div>
      <PageHeader
        title={t.nav.projects}
        subtitle="Ton portefeuille. 1 seul P1, 2 P2 maximum."
        actions={
          <Btn variant="primary" onClick={() => setCreating((v) => !v)}>
            <Plus className="w-4 h-4" /> Nouveau projet
          </Btn>
        }
      />

      {creating && (
        <Card className="mb-4 flex gap-2">
          <input
            autoFocus value={name} onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createProject()}
            placeholder="Nom du projet…" className={inputCls}
          />
          <Btn variant="primary" onClick={createProject}>Créer</Btn>
        </Card>
      )}

      {alerts.length > 0 && (
        <Card className="mb-4 border-warning/30">
          <div className="flex items-center gap-2 mb-2 text-warning">
            <AlertTriangle className="w-4 h-4" />
            <h2 className="text-sm font-semibold">Règles du portefeuille</h2>
          </div>
          <ul className="space-y-1">
            {alerts.map((a, i) => (
              <li key={i} className={`text-sm ${a.level === 'danger' ? 'text-danger' : 'text-fg-muted'}`}>• {a.message}</li>
            ))}
          </ul>
        </Card>
      )}

      <div className="flex flex-wrap gap-2 mb-5">
        <select value={fPriority} onChange={(e) => setFPriority(e.target.value as any)} className={`${inputCls} w-auto`}>
          <option value="all">Toutes priorités</option>
          <option value="P1">P1</option><option value="P2">P2</option><option value="P3">P3</option>
        </select>
        <select value={fStatus} onChange={(e) => setFStatus(e.target.value as any)} className={`${inputCls} w-auto`}>
          <option value="all">Tous statuts</option>
          {(['idea', 'validating', 'active', 'paused', 'killed'] as ProjectStatus[]).map((s) => (
            <option key={s} value={s}>{t.status[s]}</option>
          ))}
        </select>
      </div>

      {projects.length === 0 ? (
        <EmptyState icon={FolderKanban} title="Aucun projet" hint="Crée ton premier projet pour commencer à piloter ton portefeuille." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => {
            const openTasks = data.tasks.filter((tk) => tk.projectId === p.id && tk.status !== 'done').length
            return (
              <Link key={p.id} to={`/projects/${p.id}`}>
                <Card className="card-hover h-full flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium text-fg truncate">{p.name}</h3>
                    <PriorityBadge priority={p.priority} />
                  </div>
                  {p.description && <p className="text-sm text-fg-muted line-clamp-2 mb-3">{p.description}</p>}
                  {p.nextAction && (
                    <p className="text-xs text-accent-300 mb-3">→ {p.nextAction}</p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-border-subtle">
                    <div className="flex items-center gap-2">
                      <HealthBadge health={p.health} />
                      <StatusBadge status={p.status} />
                    </div>
                    <span className="text-2xs text-fg-faint">{openTasks} tâche(s)</span>
                  </div>
                  {p.mrr > 0 && <div className="text-2xs text-success mt-2">{p.mrr}€ MRR</div>}
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
