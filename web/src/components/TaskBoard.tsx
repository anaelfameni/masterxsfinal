import { useState } from 'react'
import { Plus, Trash2, List, Columns, Calendar, ChevronDown, ChevronRight } from 'lucide-react'
import { useStore } from '@/lib/store/StoreContext'
import { Btn, inputCls, EmptyState } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'
import type { Task, TaskStatus, TaskPriority, SubTask } from '@/lib/store/types'
import { t } from '@/lib/i18n'

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: 'todo', label: t.taskStatus.todo },
  { id: 'doing', label: t.taskStatus.doing },
  { id: 'done', label: t.taskStatus.done },
]

interface Props {
  projectId: string | null
  onChange?: () => void
  showProjectColumn?: boolean
}

export default function TaskBoard({ projectId, onChange, showProjectColumn }: Props) {
  const { data, setData, uid } = useStore()
  const [view, setView] = useState<'list' | 'kanban'>('list')
  const [title, setTitle] = useState('')

  const tasks = data.tasks
    .filter((tk) => (projectId === null ? true : tk.projectId === projectId))
    .sort((a, b) => a.order - b.order || b.createdAt - a.createdAt)

  function commit(updater: (prev: typeof data.tasks) => typeof data.tasks) {
    setData((prev) => ({ ...prev, tasks: updater(prev.tasks) }))
    onChange?.()
  }

  function addTask() {
    if (!title.trim()) return
    const now = Date.now()
    const task: Task = {
      id: uid('task'), projectId, title: title.trim(), status: 'todo', priority: 'normal',
      tags: [], subtasks: [], deadline: null, createdAt: now, updatedAt: now, order: tasks.length,
    }
    commit((prev) => [task, ...prev])
    setTitle('')
  }

  function patch(id: string, u: Partial<Task>) {
    commit((prev) => prev.map((tk) => (tk.id === id ? { ...tk, ...u, updatedAt: Date.now() } : tk)))
  }
  function remove(id: string) {
    commit((prev) => prev.filter((tk) => tk.id !== id))
  }

  function onDrop(status: TaskStatus, id: string) {
    patch(id, { status })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Nouvelle tâche…" className={inputCls} />
        <Btn variant="primary" onClick={addTask}><Plus className="w-4 h-4" /></Btn>
        <div className="flex rounded-lg border border-border overflow-hidden shrink-0">
          <button onClick={() => setView('list')} className={cn('p-2', view === 'list' ? 'bg-accent-500/15 text-accent-300' : 'text-fg-muted hover:bg-bg-elevated')}><List className="w-4 h-4" /></button>
          <button onClick={() => setView('kanban')} className={cn('p-2', view === 'kanban' ? 'bg-accent-500/15 text-accent-300' : 'text-fg-muted hover:bg-bg-elevated')}><Columns className="w-4 h-4" /></button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <EmptyState title="Aucune tâche" hint="Ajoute ta première tâche ci-dessus." />
      ) : view === 'list' ? (
        <div className="space-y-2">
          {tasks.map((tk) => (
            <TaskRow key={tk.id} task={tk} patch={patch} remove={remove} showProject={showProjectColumn} />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {COLUMNS.map((col) => (
            <div
              key={col.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(col.id, e.dataTransfer.getData('text/plain'))}
              className="card p-3 min-h-[120px]"
            >
              <h3 className="text-2xs uppercase tracking-widest text-fg-faint font-semibold mb-3 px-1">
                {col.label} · {tasks.filter((tk) => tk.status === col.id).length}
              </h3>
              <div className="space-y-2">
                {tasks.filter((tk) => tk.status === col.id).map((tk) => (
                  <div
                    key={tk.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', tk.id)}
                    className="rounded-lg border border-border bg-bg-elevated p-3 cursor-grab active:cursor-grabbing"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={cn('text-sm', tk.status === 'done' ? 'line-through text-fg-faint' : 'text-fg')}>{tk.title}</span>
                      <button onClick={() => remove(tk.id)} className="text-fg-faint hover:text-danger shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    {tk.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tk.tags.map((tag) => <span key={tag} className="pill-violet text-2xs">{tag}</span>)}
                      </div>
                    )}
                    {tk.deadline && <div className="text-2xs text-fg-faint mt-2 flex items-center gap-1"><Calendar className="w-3 h-3" />{tk.deadline}</div>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TaskRow({
  task, patch, remove, showProject,
}: { task: Task; patch: (id: string, u: Partial<Task>) => void; remove: (id: string) => void; showProject?: boolean }) {
  const { data, uid } = useStore()
  const [expanded, setExpanded] = useState(false)
  const project = data.projects.find((p) => p.id === task.projectId)

  function toggleStatus() {
    const next: TaskStatus = task.status === 'done' ? 'todo' : task.status === 'todo' ? 'doing' : 'done'
    patch(task.id, { status: next })
  }
  function addSub(label: string) {
    if (!label.trim()) return
    const sub: SubTask = { id: uid('sub'), title: label.trim(), done: false }
    patch(task.id, { subtasks: [...task.subtasks, sub] })
  }
  function toggleSub(sid: string) {
    patch(task.id, { subtasks: task.subtasks.map((s) => s.id === sid ? { ...s, done: !s.done } : s) })
  }
  function setTags(value: string) {
    patch(task.id, { tags: value.split(',').map((s) => s.trim()).filter(Boolean) })
  }

  const dotColor = task.status === 'done' ? 'bg-success' : task.status === 'doing' ? 'bg-warning' : 'bg-fg-faint'

  return (
    <div className="card p-3">
      <div className="flex items-center gap-3">
        <button onClick={toggleStatus} className={cn('w-4 h-4 rounded-full shrink-0', dotColor)} title={t.taskStatus[task.status]} />
        <input
          value={task.title} onChange={(e) => patch(task.id, { title: e.target.value })}
          className={cn('flex-1 bg-transparent text-sm focus:outline-none', task.status === 'done' ? 'line-through text-fg-faint' : 'text-fg')}
        />
        {showProject && project && <span className="text-2xs text-fg-faint shrink-0">{project.name}</span>}
        <select value={task.priority} onChange={(e) => patch(task.id, { priority: e.target.value as TaskPriority })} className="bg-transparent text-2xs text-fg-muted focus:outline-none">
          <option value="high">{t.taskPriority.high}</option><option value="normal">{t.taskPriority.normal}</option><option value="low">{t.taskPriority.low}</option>
        </select>
        <button onClick={() => setExpanded((v) => !v)} className="text-fg-faint hover:text-fg">
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        <button onClick={() => remove(task.id)} className="text-fg-faint hover:text-danger"><Trash2 className="w-4 h-4" /></button>
      </div>

      {expanded && (
        <div className="mt-3 pl-7 space-y-3">
          <div className="grid sm:grid-cols-2 gap-2">
            <input value={task.tags.join(', ')} onChange={(e) => setTags(e.target.value)} placeholder="tags (séparés par ,)" className={inputCls} />
            <input type="date" value={task.deadline || ''} onChange={(e) => patch(task.id, { deadline: e.target.value || null })} className={inputCls} />
          </div>
          <div className="space-y-1.5">
            {task.subtasks.map((s) => (
              <label key={s.id} className="flex items-center gap-2 text-sm text-fg-muted">
                <input type="checkbox" checked={s.done} onChange={() => toggleSub(s.id)} />
                <span className={s.done ? 'line-through text-fg-faint' : ''}>{s.title}</span>
              </label>
            ))}
            <input
              placeholder="+ sous-tâche (Entrée)" className={inputCls}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addSub((e.target as HTMLInputElement).value)
                  ;(e.target as HTMLInputElement).value = ''
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
