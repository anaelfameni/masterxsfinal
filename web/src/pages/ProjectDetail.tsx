import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { useStore } from '@/lib/store/StoreContext'
import { Card, Btn, PriorityBadge, HealthBadge, StatusBadge, inputCls, Field, EmptyState } from '@/components/ui/primitives'
import TaskBoard from '@/components/TaskBoard'
import type { Project, ProjectPriority, ProjectStatus, ProjectHealth, Decision, FinanceEntry } from '@/lib/store/types'
import { t } from '@/lib/i18n'

type Tab = 'overview' | 'tasks' | 'decisions' | 'journal' | 'finances'

export default function ProjectDetail() {
  const { id = '' } = useParams()
  const { data, setData, uid, touchProject } = useStore()
  const [tab, setTab] = useState<Tab>('overview')
  const project = data.projects.find((p) => p.id === id)

  if (!project) {
    return <EmptyState title="Projet introuvable" action={<Link to="/projects"><Btn>Retour</Btn></Link>} />
  }

  function patch(updates: Partial<Project>) {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: Date.now(), lastActivityAt: Date.now() } : p
      ),
    }))
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Aperçu' },
    { id: 'tasks', label: t.nav.tasks },
    { id: 'decisions', label: t.nav.decisions },
    { id: 'journal', label: 'Journal' },
    { id: 'finances', label: t.nav.finances },
  ]

  return (
    <div>
      <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg mb-4">
        <ArrowLeft className="w-4 h-4" /> Projets
      </Link>

      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <input
            value={project.name}
            onChange={(e) => patch({ name: e.target.value })}
            className="text-2xl font-semibold bg-transparent text-fg w-full focus:outline-none"
          />
          <div className="flex items-center gap-2 mt-2">
            <PriorityBadge priority={project.priority} />
            <HealthBadge health={project.health} />
            <StatusBadge status={project.status} />
          </div>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
        {tabs.map((tb) => (
          <button
            key={tb.id} onClick={() => setTab(tb.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
              tab === tb.id ? 'border-accent-500 text-fg' : 'border-transparent text-fg-muted hover:text-fg'
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && <Overview project={project} patch={patch} />}
      {tab === 'tasks' && <TaskBoard projectId={id} onChange={() => touchProject(id)} />}
      {tab === 'decisions' && <ProjectDecisions projectId={id} />}
      {tab === 'journal' && <ProjectJournal projectId={id} />}
      {tab === 'finances' && <ProjectFinances projectId={id} />}
    </div>
  )
}

function Overview({ project, patch }: { project: Project; patch: (u: Partial<Project>) => void }) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card className="space-y-4">
        <Field label="Description">
          <textarea value={project.description || ''} onChange={(e) => patch({ description: e.target.value })}
            className={`${inputCls} min-h-[80px]`} placeholder="De quoi s'agit-il ?" />
        </Field>
        <Field label="Prochaine action">
          <input value={project.nextAction || ''} onChange={(e) => patch({ nextAction: e.target.value })}
            className={inputCls} placeholder="La seule chose à faire ensuite…" />
        </Field>
        <Field label="Bloqué par">
          <input value={project.blockedBy || ''} onChange={(e) => patch({ blockedBy: e.target.value || null })}
            className={inputCls} placeholder="Rien, ou la cause du blocage" />
        </Field>
      </Card>
      <Card className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Priorité">
            <select value={project.priority} onChange={(e) => patch({ priority: e.target.value as ProjectPriority })} className={inputCls}>
              <option value="P1">P1 · Focus</option><option value="P2">P2 · Maintenance</option><option value="P3">P3 · Veille</option>
            </select>
          </Field>
          <Field label="Statut">
            <select value={project.status} onChange={(e) => patch({ status: e.target.value as ProjectStatus })} className={inputCls}>
              {(['idea', 'validating', 'active', 'paused', 'killed'] as ProjectStatus[]).map((s) => (
                <option key={s} value={s}>{t.status[s]}</option>
              ))}
            </select>
          </Field>
          <Field label="Santé">
            <select value={project.health} onChange={(e) => patch({ health: e.target.value as ProjectHealth })} className={inputCls}>
              {(['green', 'yellow', 'red'] as ProjectHealth[]).map((h) => (
                <option key={h} value={h}>{t.health[h]}</option>
              ))}
            </select>
          </Field>
          <Field label="MRR (€)">
            <input type="number" value={project.mrr} onChange={(e) => patch({ mrr: Number(e.target.value) || 0 })} className={inputCls} />
          </Field>
        </div>
        <Field label="Échéance">
          <input type="date" value={project.deadline || ''} onChange={(e) => patch({ deadline: e.target.value || null })} className={inputCls} />
        </Field>
      </Card>
    </div>
  )
}

function ProjectDecisions({ projectId }: { projectId: string }) {
  const { data, setData, uid } = useStore()
  const decisions = data.decisions.filter((d) => d.projectId === projectId)

  function add() {
    const now = Date.now()
    const d: Decision = {
      id: uid('dec'), title: 'Nouvelle décision', projectId, context: '', options: '',
      decision: '', consequences: '', status: 'proposed', createdAt: now, updatedAt: now,
    }
    setData((prev) => ({ ...prev, decisions: [d, ...prev.decisions] }))
  }
  function patch(idd: string, u: Partial<Decision>) {
    setData((prev) => ({ ...prev, decisions: prev.decisions.map((d) => d.id === idd ? { ...d, ...u, updatedAt: Date.now() } : d) }))
  }
  function remove(idd: string) {
    setData((prev) => ({ ...prev, decisions: prev.decisions.filter((d) => d.id !== idd) }))
  }

  return (
    <div className="space-y-4">
      <Btn variant="primary" onClick={add}><Plus className="w-4 h-4" /> Décision (ADR)</Btn>
      {decisions.length === 0 ? (
        <EmptyState title="Aucune décision enregistrée" hint="Documente tes arbitrages : contexte, options, décision, conséquences." />
      ) : decisions.map((d) => (
        <Card key={d.id} className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <input value={d.title} onChange={(e) => patch(d.id, { title: e.target.value })} className="font-medium bg-transparent text-fg flex-1 focus:outline-none" />
            <select value={d.status} onChange={(e) => patch(d.id, { status: e.target.value as Decision['status'] })} className={`${inputCls} w-auto`}>
              <option value="proposed">Proposée</option><option value="accepted">Acceptée</option><option value="superseded">Remplacée</option>
            </select>
            <button onClick={() => remove(d.id)} className="p-1.5 text-fg-faint hover:text-danger"><Trash2 className="w-4 h-4" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Contexte"><textarea value={d.context} onChange={(e) => patch(d.id, { context: e.target.value })} className={`${inputCls} min-h-[60px]`} /></Field>
            <Field label="Options"><textarea value={d.options} onChange={(e) => patch(d.id, { options: e.target.value })} className={`${inputCls} min-h-[60px]`} /></Field>
            <Field label="Décision"><textarea value={d.decision} onChange={(e) => patch(d.id, { decision: e.target.value })} className={`${inputCls} min-h-[60px]`} /></Field>
            <Field label="Conséquences"><textarea value={d.consequences} onChange={(e) => patch(d.id, { consequences: e.target.value })} className={`${inputCls} min-h-[60px]`} /></Field>
          </div>
        </Card>
      ))}
    </div>
  )
}

function ProjectJournal({ projectId }: { projectId: string }) {
  const { data, setData, uid } = useStore()
  const [text, setText] = useState('')
  const notes = data.notes.filter((n) => n.projectId === projectId).sort((a, b) => b.createdAt - a.createdAt)

  function add() {
    if (!text.trim()) return
    const now = Date.now()
    setData((prev) => ({
      ...prev,
      notes: [{ id: uid('log'), title: new Date().toLocaleDateString('fr-FR'), content: text.trim(), tags: ['log'], projectId, createdAt: now, updatedAt: now }, ...prev.notes],
    }))
    setText('')
  }

  return (
    <div className="space-y-4">
      <Card className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Une ligne de journal (ce qui a avancé aujourd'hui)…" className={inputCls} />
        <Btn variant="primary" onClick={add}>Ajouter</Btn>
      </Card>
      {notes.length === 0 ? (
        <EmptyState title="Journal vide" hint="Note chaque jour ce qui a avancé. 2 lignes suffisent." />
      ) : notes.map((n) => (
        <Card key={n.id} className="py-3">
          <div className="text-2xs text-fg-faint mb-1">{n.title}</div>
          <div className="text-sm text-fg-muted whitespace-pre-wrap">{n.content}</div>
        </Card>
      ))}
    </div>
  )
}

function ProjectFinances({ projectId }: { projectId: string }) {
  const { data, setData, uid } = useStore()
  const entries = data.finances.filter((f) => f.projectId === projectId).sort((a, b) => a.month.localeCompare(b.month))

  function add() {
    const now = Date.now()
    const month = new Date().toISOString().slice(0, 7)
    const f: FinanceEntry = { id: uid('fin'), projectId, month, mrr: 0, expenses: 0, createdAt: now, updatedAt: now }
    setData((prev) => ({ ...prev, finances: [...prev.finances, f] }))
  }
  function patch(idf: string, u: Partial<FinanceEntry>) {
    setData((prev) => ({ ...prev, finances: prev.finances.map((f) => f.id === idf ? { ...f, ...u, updatedAt: Date.now() } : f) }))
  }
  function remove(idf: string) {
    setData((prev) => ({ ...prev, finances: prev.finances.filter((f) => f.id !== idf) }))
  }

  return (
    <div className="space-y-4">
      <Btn variant="primary" onClick={add}><Plus className="w-4 h-4" /> Entrée mensuelle</Btn>
      {entries.length === 0 ? (
        <EmptyState title="Aucune donnée financière" hint="Suis ton MRR et tes dépenses mois par mois." />
      ) : (
        <Card className="space-y-2">
          {entries.map((f) => (
            <div key={f.id} className="flex items-center gap-2">
              <input type="month" value={f.month} onChange={(e) => patch(f.id, { month: e.target.value })} className={`${inputCls} w-auto`} />
              <input type="number" value={f.mrr} onChange={(e) => patch(f.id, { mrr: Number(e.target.value) || 0 })} className={inputCls} placeholder="MRR" />
              <input type="number" value={f.expenses} onChange={(e) => patch(f.id, { expenses: Number(e.target.value) || 0 })} className={inputCls} placeholder="Dépenses" />
              <button onClick={() => remove(f.id)} className="p-1.5 text-fg-faint hover:text-danger"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
