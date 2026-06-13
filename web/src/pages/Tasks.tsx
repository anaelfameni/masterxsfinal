import { useState } from 'react'
import { useStore } from '@/lib/store/StoreContext'
import { PageHeader, inputCls } from '@/components/ui/primitives'
import TaskBoard from '@/components/TaskBoard'

export default function Tasks() {
  const { data } = useStore()
  const [projectId, setProjectId] = useState<string>('all')

  return (
    <div>
      <PageHeader
        title="Tâches"
        subtitle="Toutes tes tâches, tous projets confondus."
        actions={
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className={`${inputCls} w-auto`}>
            <option value="all">Tous les projets</option>
            <option value="none">Sans projet</option>
            {data.projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        }
      />
      <TaskBoard
        projectId={projectId === 'all' ? null : projectId === 'none' ? null : projectId}
        showProjectColumn={projectId === 'all'}
      />
    </div>
  )
}
