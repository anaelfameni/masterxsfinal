import { useState } from 'react'
import { Trash2, BookText } from 'lucide-react'
import { useStore } from '@/lib/store/StoreContext'
import { PageHeader, Card, Btn, inputCls, EmptyState } from '@/components/ui/primitives'
import type { JournalEntry } from '@/lib/store/types'

const MOODS = ['😫', '😕', '😐', '🙂', '🚀']

export default function Journal() {
  const { data, setData, uid } = useStore()
  const [content, setContent] = useState('')
  const [mood, setMood] = useState<number>(4)
  const entries = [...data.journal].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)

  function add() {
    if (!content.trim()) return
    const now = Date.now()
    const entry: JournalEntry = {
      id: uid('j'), date: new Date().toISOString().slice(0, 10), content: content.trim(),
      mood: mood as JournalEntry['mood'], createdAt: now, updatedAt: now,
    }
    setData((prev) => ({ ...prev, journal: [entry, ...prev.journal] }))
    setContent('')
  }
  function remove(id: string) {
    setData((prev) => ({ ...prev, journal: prev.journal.filter((e) => e.id !== id) }))
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Journal" subtitle="Une entrée par jour. Ce qui a avancé, ce que tu ressens." />
      <Card className="mb-5 space-y-3">
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Aujourd'hui…" className={`${inputCls} min-h-[80px]`} />
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {MOODS.map((m, i) => (
              <button key={i} onClick={() => setMood(i + 1)} className={`w-9 h-9 rounded-lg text-lg ${mood === i + 1 ? 'bg-accent-500/15' : 'hover:bg-bg-elevated'}`}>{m}</button>
            ))}
          </div>
          <Btn variant="primary" onClick={add}>Enregistrer</Btn>
        </div>
      </Card>
      {entries.length === 0 ? (
        <EmptyState icon={BookText} title="Journal vide" hint="Écris ta première entrée." />
      ) : (
        <div className="space-y-3">
          {entries.map((e) => (
            <Card key={e.id} className="py-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xs text-fg-faint">{new Date(e.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} {e.mood ? MOODS[e.mood - 1] : ''}</span>
                <button onClick={() => remove(e.id)} className="text-fg-faint hover:text-danger"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <p className="text-sm text-fg-muted whitespace-pre-wrap">{e.content}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
