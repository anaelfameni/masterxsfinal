import { useState } from 'react'
import { Plus, Trash2, Repeat, Flame } from 'lucide-react'
import { useStore } from '@/lib/store/StoreContext'
import { PageHeader, Card, Btn, inputCls, EmptyState } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'
import type { Habit } from '@/lib/store/types'

function lastDays(n: number): string[] {
  const out: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    out.push(new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10))
  }
  return out
}

function streak(log: string[]): number {
  const set = new Set(log)
  let s = 0
  for (let i = 0; ; i++) {
    const d = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10)
    if (set.has(d)) s++
    else if (i === 0) continue // aujourd'hui pas encore fait : on ne casse pas le streak
    else break
  }
  return s
}

export default function Habits() {
  const { data, setData, uid } = useStore()
  const [name, setName] = useState('')
  const days = lastDays(30)

  function add() {
    if (!name.trim()) return
    const now = Date.now()
    const h: Habit = { id: uid('habit'), name: name.trim(), emoji: '✅', log: [], createdAt: now, updatedAt: now }
    setData((prev) => ({ ...prev, habits: [...prev.habits, h] }))
    setName('')
  }
  function toggle(h: Habit, date: string) {
    const has = h.log.includes(date)
    const log = has ? h.log.filter((d) => d !== date) : [...h.log, date]
    setData((prev) => ({ ...prev, habits: prev.habits.map((x) => x.id === h.id ? { ...x, log, updatedAt: Date.now() } : x) }))
  }
  function remove(id: string) {
    setData((prev) => ({ ...prev, habits: prev.habits.filter((h) => h.id !== id) }))
  }

  return (
    <div>
      <PageHeader title="Habitudes" subtitle="Le progrès vient de la régularité, pas de l'intensité." />
      <Card className="mb-5 flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="Nouvelle habitude…" className={inputCls} />
        <Btn variant="primary" onClick={add}><Plus className="w-4 h-4" /> Ajouter</Btn>
      </Card>
      {data.habits.length === 0 ? (
        <EmptyState icon={Repeat} title="Aucune habitude" hint="Suis une habitude clé (deep work, prospection…)." />
      ) : (
        <div className="space-y-3">
          {data.habits.map((h) => {
            const s = streak(h.log)
            const today = new Date().toISOString().slice(0, 10)
            return (
              <Card key={h.id}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-fg">{h.emoji} {h.name}</span>
                    {s > 0 && <span className="pill-warning text-2xs"><Flame className="w-3 h-3" /> {s}j</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Btn onClick={() => toggle(h, today)} className="text-xs">{h.log.includes(today) ? 'Fait ✓' : 'Marquer aujourd\'hui'}</Btn>
                    <button onClick={() => remove(h.id)} className="text-fg-faint hover:text-danger"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {days.map((d) => (
                    <button key={d} onClick={() => toggle(h, d)} title={d}
                      className={cn('w-4 h-4 rounded-sm', h.log.includes(d) ? 'bg-accent-500' : 'bg-bg-elevated hover:bg-border-strong')} />
                  ))}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
