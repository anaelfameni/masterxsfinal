import { useState } from 'react'
import { Plus, Trash2, StickyNote } from 'lucide-react'
import { useStore } from '@/lib/store/StoreContext'
import { PageHeader, Card, Btn, inputCls, EmptyState } from '@/components/ui/primitives'
import type { Note } from '@/lib/store/types'

export default function Notes() {
  const { data, setData, uid } = useStore()
  const [q, setQ] = useState('')
  const notes = data.notes
    .filter((n) => !n.tags.includes('log'))
    .filter((n) => (q ? (n.title + n.content + n.tags.join(' ')).toLowerCase().includes(q.toLowerCase()) : true))
    .sort((a, b) => b.updatedAt - a.updatedAt)

  function add() {
    const now = Date.now()
    const note: Note = { id: uid('note'), title: 'Nouvelle note', content: '', tags: [], projectId: null, createdAt: now, updatedAt: now }
    setData((prev) => ({ ...prev, notes: [note, ...prev.notes] }))
  }
  function patch(id: string, u: Partial<Note>) {
    setData((prev) => ({ ...prev, notes: prev.notes.map((n) => n.id === id ? { ...n, ...u, updatedAt: Date.now() } : n) }))
  }
  function remove(id: string) {
    setData((prev) => ({ ...prev, notes: prev.notes.filter((n) => n.id !== id) }))
  }

  return (
    <div>
      <PageHeader title="Notes" subtitle="Ressources, snippets, références — tagués et cherchables."
        actions={<Btn variant="primary" onClick={add}><Plus className="w-4 h-4" /> Note</Btn>} />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher…" className={`${inputCls} mb-4`} />
      {notes.length === 0 ? (
        <EmptyState icon={StickyNote} title="Aucune note" hint="Crée une note pour stocker une ressource utile." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {notes.map((n) => (
            <Card key={n.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <input value={n.title} onChange={(e) => patch(n.id, { title: e.target.value })} className="font-medium bg-transparent text-fg flex-1 focus:outline-none" />
                <button onClick={() => remove(n.id)} className="text-fg-faint hover:text-danger"><Trash2 className="w-4 h-4" /></button>
              </div>
              <textarea value={n.content} onChange={(e) => patch(n.id, { content: e.target.value })} placeholder="Contenu…" className={`${inputCls} min-h-[80px]`} />
              <input value={n.tags.join(', ')} onChange={(e) => patch(n.id, { tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} placeholder="tags" className={inputCls} />
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
