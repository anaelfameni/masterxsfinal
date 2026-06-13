import { useMemo } from 'react'
import { Wallet } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { useStore } from '@/lib/store/StoreContext'
import { PageHeader, Card, EmptyState } from '@/components/ui/primitives'

export default function Finances() {
  const { data } = useStore()

  const byMonth = useMemo(() => {
    const map = new Map<string, { month: string; mrr: number; expenses: number }>()
    for (const f of data.finances) {
      const cur = map.get(f.month) || { month: f.month, mrr: 0, expenses: 0 }
      cur.mrr += f.mrr
      cur.expenses += f.expenses
      map.set(f.month, cur)
    }
    return [...map.values()].sort((a, b) => a.month.localeCompare(b.month))
  }, [data.finances])

  const totalMrr = data.projects.reduce((s, p) => s + (p.mrr || 0), 0)
  const lastMonth = byMonth[byMonth.length - 1]
  const profit = lastMonth ? lastMonth.mrr - lastMonth.expenses : 0

  return (
    <div>
      <PageHeader title="Finances" subtitle="MRR et dépenses consolidés. Détaille par projet dans chaque fiche." />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card><div className="text-2xs text-fg-subtle">MRR projets (actuel)</div><div className="text-2xl font-semibold text-fg mt-1">{totalMrr.toLocaleString('fr-FR')}€</div></Card>
        <Card><div className="text-2xs text-fg-subtle">Dépenses (dernier mois)</div><div className="text-2xl font-semibold text-fg mt-1">{(lastMonth?.expenses ?? 0).toLocaleString('fr-FR')}€</div></Card>
        <Card><div className="text-2xs text-fg-subtle">Profit (dernier mois)</div><div className={`text-2xl font-semibold mt-1 ${profit >= 0 ? 'text-success' : 'text-danger'}`}>{profit.toLocaleString('fr-FR')}€</div></Card>
      </div>
      <Card>
        <h2 className="text-sm font-semibold text-fg mb-4">Évolution mensuelle</h2>
        {byMonth.length === 0 ? (
          <EmptyState icon={Wallet} title="Aucune donnée financière" hint="Ajoute des entrées mensuelles depuis l'onglet Finances d'un projet." />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={byMonth} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
              <YAxis stroke="#71717a" fontSize={11} />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid #262626', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="mrr" name="MRR" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="expenses" name="Dépenses" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  )
}
