import { Plus, Trash2, Users } from 'lucide-react'
import { useStore } from '@/lib/store/StoreContext'
import { PageHeader, Card, Btn, Field, inputCls, EmptyState } from '@/components/ui/primitives'
import type { Meeting, MeetingAction } from '@/lib/store/types'

export default function Meetings() {
  const { data, setData, uid } = useStore()
  const meetings = [...data.meetings].sort((a, b) => b.date.localeCompare(a.date))

  function add() {
    const now = Date.now()
    const m: Meeting = {
      id: uid('mtg'), title: 'Nouvelle réunion', date: new Date().toISOString().slice(0, 10),
      attendees: '', notes: '', actions: [], projectId: null, createdAt: now, updatedAt: now,
    }
    setData((prev) => ({ ...prev, meetings: [m, ...prev.meetings] }))
  }
  function patch(id: string, u: Partial<Meeting>) {
    setData((prev) => ({ ...prev, meetings: prev.meetings.map((m) => m.id === id ? { ...m, ...u, updatedAt: Date.now() } : m) }))
  }
  function remove(id: string) {
    setData((prev) => ({ ...prev, meetings: prev.meetings.filter((m) => m.id !== id) }))
  }
  function addAction(m: Meeting, text: string) {
    if (!text.trim()) return
    const a: MeetingAction = { id: uid('ma'), text: text.trim(), done: false }
    patch(m.id, { actions: [...m.actions, a] })
  }
  function toggleAction(m: Meeting, aId: string) {
    patch(m.id, { actions: m.actions.map((a) => a.id === aId ? { ...a, done: !a.done } : a) })
  }

  return (
    <div>
      <PageHeader title="Réunions" subtitle="Notes et actions à suivre après chaque échange."
        actions={<Btn variant="primary" onClick={add}><Plus className="w-4 h-4" /> Réunion</Btn>} />
      {meetings.length === 0 ? (
        <EmptyState icon={Users} title="Aucune réunion" hint="Garde une trace de tes échanges et de leurs actions." />
      ) : (
        <div className="space-y-4">
          {meetings.map((m) => (
            <Card key={m.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <input value={m.title} onChange={(e) => patch(m.id, { title: e.target.value })} className="font-medium bg-transparent text-fg flex-1 focus:outline-none" />
                <input type="date" value={m.date} onChange={(e) => patch(m.id, { date: e.target.value })} className={`${inputCls} w-auto`} />
                <button onClick={() => remove(m.id)} className="text-fg-faint hover:text-danger"><Trash2 className="w-4 h-4" /></button>
              </div>
              <input value={m.attendees || ''} onChange={(e) => patch(m.id, { attendees: e.target.value })} placeholder="Participants…" className={inputCls} />
              <Field label="Notes"><textarea value={m.notes} onChange={(e) => patch(m.id, { notes: e.target.value })} className={`${inputCls} min-h-[80px]`} /></Field>
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-fg-muted">Actions</span>
                {m.actions.map((a) => (
                  <label key={a.id} className="flex items-center gap-2 text-sm text-fg-muted">
                    <input type="checkbox" checked={a.done} onChange={() => toggleAction(m, a.id)} />
                    <span className={a.done ? 'line-through text-fg-faint' : ''}>{a.text}</span>
                  </label>
                ))}
                <input placeholder="+ action (Entrée)" className={inputCls}
                  onKeyDown={(e) => { if (e.key === 'Enter') { addAction(m, (e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = '' } }} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
