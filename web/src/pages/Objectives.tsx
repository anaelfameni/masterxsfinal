import { Plus, Trash2, Target } from 'lucide-react'
import { useStore } from '@/lib/store/StoreContext'
import { PageHeader, Card, Btn, Field, inputCls, EmptyState } from '@/components/ui/primitives'
import type { Objective, KeyResult } from '@/lib/store/types'

export default function Objectives() {
  const { data, setData, uid } = useStore()

  function add() {
    const now = Date.now()
    const o: Objective = {
      id: uid('goal'), title: 'Nouvel objectif', period: '', projectId: null,
      keyResults: [], createdAt: now, updatedAt: now,
    }
    setData((prev) => ({ ...prev, objectives: [o, ...prev.objectives] }))
  }
  function patch(id: string, u: Partial<Objective>) {
    setData((prev) => ({ ...prev, objectives: prev.objectives.map((o) => o.id === id ? { ...o, ...u, updatedAt: Date.now() } : o) }))
  }
  function remove(id: string) {
    setData((prev) => ({ ...prev, objectives: prev.objectives.filter((o) => o.id !== id) }))
  }
  function addKr(o: Objective) {
    const kr: KeyResult = { id: uid('kr'), label: 'Résultat clé', target: 100, current: 0 }
    patch(o.id, { keyResults: [...o.keyResults, kr] })
  }
  function patchKr(o: Objective, krId: string, u: Partial<KeyResult>) {
    patch(o.id, { keyResults: o.keyResults.map((k) => k.id === krId ? { ...k, ...u } : k) })
  }
  function removeKr(o: Objective, krId: string) {
    patch(o.id, { keyResults: o.keyResults.filter((k) => k.id !== krId) })
  }

  return (
    <div>
      <PageHeader title="Objectifs" subtitle="OKR : un objectif, des résultats clés mesurables."
        actions={<Btn variant="primary" onClick={add}><Plus className="w-4 h-4" /> Objectif</Btn>} />
      {data.objectives.length === 0 ? (
        <EmptyState icon={Target} title="Aucun objectif" hint="Définis ce que tu veux atteindre ce trimestre." />
      ) : (
        <div className="space-y-4">
          {data.objectives.map((o) => (
            <Card key={o.id} className="space-y-4">
              <div className="flex items-center gap-2">
                <input value={o.title} onChange={(e) => patch(o.id, { title: e.target.value })} className="text-lg font-medium bg-transparent text-fg flex-1 focus:outline-none" />
                <input value={o.period || ''} onChange={(e) => patch(o.id, { period: e.target.value })} placeholder="Période" className={`${inputCls} w-28`} />
                <select value={o.projectId || ''} onChange={(e) => patch(o.id, { projectId: e.target.value || null })} className={`${inputCls} w-auto`}>
                  <option value="">Aucun projet</option>
                  {data.projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <button onClick={() => remove(o.id)} className="p-1.5 text-fg-faint hover:text-danger"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                {o.keyResults.map((k) => {
                  const pct = k.target > 0 ? Math.min(100, Math.round((k.current / k.target) * 100)) : 0
                  return (
                    <div key={k.id} className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <input value={k.label} onChange={(e) => patchKr(o, k.id, { label: e.target.value })} className="flex-1 bg-transparent text-sm text-fg-muted focus:outline-none" />
                        <input type="number" value={k.current} onChange={(e) => patchKr(o, k.id, { current: Number(e.target.value) || 0 })} className={`${inputCls} w-20`} />
                        <span className="text-fg-faint">/</span>
                        <input type="number" value={k.target} onChange={(e) => patchKr(o, k.id, { target: Number(e.target.value) || 0 })} className={`${inputCls} w-20`} />
                        <input value={k.unit || ''} onChange={(e) => patchKr(o, k.id, { unit: e.target.value })} placeholder="unité" className={`${inputCls} w-16`} />
                        <button onClick={() => removeKr(o, k.id)} className="text-fg-faint hover:text-danger"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                      <div className="h-1.5 rounded-full bg-bg-elevated overflow-hidden">
                        <div className="h-full bg-gradient-violet" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
                <button onClick={() => addKr(o)} className="text-xs text-accent-400 hover:text-accent-300 inline-flex items-center gap-1"><Plus className="w-3 h-3" /> Résultat clé</button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
