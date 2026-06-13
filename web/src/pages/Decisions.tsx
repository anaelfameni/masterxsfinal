import { Plus, Trash2, GitBranch } from 'lucide-react'
import { useStore } from '@/lib/store/StoreContext'
import { PageHeader, Card, Btn, Field, inputCls, EmptyState } from '@/components/ui/primitives'
import type { Decision } from '@/lib/store/types'

export default function Decisions() {
  const { data, setData, uid } = useStore()
  const decisions = [...data.decisions].sort((a, b) => b.createdAt - a.createdAt)

  function add() {
    const now = Date.now()
    const d: Decision = {
      id: uid('dec'), title: 'Nouvelle décision', projectId: null, context: '', options: '',
      decision: '', consequences: '', status: 'proposed', createdAt: now, updatedAt: now,
    }
    setData((prev) => ({ ...prev, decisions: [d, ...prev.decisions] }))
  }
  function patch(id: string, u: Partial<Decision>) {
    setData((prev) => ({ ...prev, decisions: prev.decisions.map((d) => d.id === id ? { ...d, ...u, updatedAt: Date.now() } : d) }))
  }
  function remove(id: string) {
    setData((prev) => ({ ...prev, decisions: prev.decisions.filter((d) => d.id !== id) }))
  }

  return (
    <div>
      <PageHeader title="Décisions" subtitle="Tes arbitrages documentés (ADR) : contexte, options, décision, conséquences."
        actions={<Btn variant="primary" onClick={add}><Plus className="w-4 h-4" /> Décision</Btn>} />
      {decisions.length === 0 ? (
        <EmptyState icon={GitBranch} title="Aucune décision" hint="Documente une décision importante pour ne jamais oublier pourquoi tu l'as prise." />
      ) : (
        <div className="space-y-4">
          {decisions.map((d) => {
            const project = data.projects.find((p) => p.id === d.projectId)
            return (
              <Card key={d.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <input value={d.title} onChange={(e) => patch(d.id, { title: e.target.value })} className="font-medium bg-transparent text-fg flex-1 focus:outline-none" />
                  <select value={d.projectId || ''} onChange={(e) => patch(d.id, { projectId: e.target.value || null })} className={`${inputCls} w-auto`}>
                    <option value="">Global</option>
                    {data.projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
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
            )
          })}
        </div>
      )}
    </div>
  )
}
