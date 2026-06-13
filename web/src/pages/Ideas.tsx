import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Lightbulb, ArrowRightCircle, Sparkles } from 'lucide-react'
import { useStore } from '@/lib/store/StoreContext'
import { PageHeader, Card, Btn, inputCls, EmptyState } from '@/components/ui/primitives'
import type { Idea, Project } from '@/lib/store/types'

export default function Ideas() {
  const { data, setData, uid } = useStore()
  const [title, setTitle] = useState('')
  const ideas = [...data.ideas].sort((a, b) => b.createdAt - a.createdAt)

  function add() {
    if (!title.trim()) return
    const now = Date.now()
    const idea: Idea = { id: uid('idea'), title: title.trim(), stage: 'raw', createdAt: now, updatedAt: now }
    setData((prev) => ({ ...prev, ideas: [idea, ...prev.ideas] }))
    setTitle('')
  }
  function patch(id: string, u: Partial<Idea>) {
    setData((prev) => ({ ...prev, ideas: prev.ideas.map((i) => i.id === id ? { ...i, ...u, updatedAt: Date.now() } : i) }))
  }
  function remove(id: string) {
    setData((prev) => ({ ...prev, ideas: prev.ideas.filter((i) => i.id !== id) }))
  }

  function convert(idea: Idea) {
    const now = Date.now()
    const project: Project = {
      id: uid('proj'), name: idea.title, description: idea.pitch, priority: 'P3',
      status: 'idea', health: 'green', mrr: 0, blockedBy: null, deadline: null, goalId: null,
      createdAt: now, updatedAt: now, lastActivityAt: now,
    }
    setData((prev) => ({
      ...prev,
      projects: [project, ...prev.projects],
      ideas: prev.ideas.map((i) => i.id === idea.id ? { ...i, stage: 'converted', convertedProjectId: project.id } : i),
    }))
  }

  return (
    <div>
      <PageHeader title="Idées" subtitle="Capture tout, score sans pitié, convertis les meilleures en projets."
        actions={
          <Link to="/tools/idea-analyzer"><Btn><Sparkles className="w-4 h-4" /> Analyseur d'idées</Btn></Link>
        } />

      <Card className="mb-4 flex gap-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Une idée de business…" className={inputCls} />
        <Btn variant="primary" onClick={add}><Plus className="w-4 h-4" /> Capturer</Btn>
      </Card>

      {ideas.length === 0 ? (
        <EmptyState icon={Lightbulb} title="Aucune idée" hint="Capture une idée en une ligne. Tu la scoreras plus tard." />
      ) : (
        <div className="space-y-3">
          {ideas.map((idea) => (
            <Card key={idea.id} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <input value={idea.title} onChange={(e) => patch(idea.id, { title: e.target.value })} className="font-medium bg-transparent text-fg w-full focus:outline-none" />
                <input value={idea.pitch || ''} onChange={(e) => patch(idea.id, { pitch: e.target.value })} placeholder="Pitch en une phrase…" className="text-sm bg-transparent text-fg-muted w-full focus:outline-none mt-1" />
              </div>
              <select value={idea.stage} onChange={(e) => patch(idea.id, { stage: e.target.value as Idea['stage'] })} className={`${inputCls} w-auto`}>
                <option value="raw">Brute</option><option value="scored">Scorée</option><option value="converted">Convertie</option><option value="killed">Abandonnée</option>
              </select>
              {idea.stage === 'converted' && idea.convertedProjectId ? (
                <Link to={`/projects/${idea.convertedProjectId}`} className="text-xs text-success">→ projet</Link>
              ) : (
                <button onClick={() => convert(idea)} title="Convertir en projet" className="text-accent-400 hover:text-accent-300"><ArrowRightCircle className="w-5 h-5" /></button>
              )}
              <button onClick={() => remove(idea.id)} className="text-fg-faint hover:text-danger"><Trash2 className="w-4 h-4" /></button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
