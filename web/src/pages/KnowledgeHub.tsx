import { Link } from 'react-router-dom'
import { BookOpen, Layers, Map, ScrollText, Lightbulb } from 'lucide-react'
import { PageHeader, Card } from '@/components/ui/primitives'

const links = [
  { to: '/knowledge/playbook', icon: BookOpen, title: 'Playbook', desc: 'Les frameworks business généralisés : validation, offre, acquisition, vente, systèmes, scaling.' },
  { to: '/knowledge/modules', icon: Layers, title: 'Modules', desc: 'Les modules détaillés du playbook par discipline.' },
  { to: '/knowledge/roadmap', icon: Map, title: 'Roadmap', desc: 'La trajectoire produit de MasterXS.' },
  { to: '/knowledge/commandments', icon: ScrollText, title: 'Lois fondamentales', desc: 'Les règles non négociables d\'exécution.' },
  { to: '/tools/idea-analyzer', icon: Lightbulb, title: 'Analyseur d\'idées', desc: 'Scorer une idée de business et la convertir en projet.' },
]

export default function KnowledgeHub() {
  return (
    <div>
      <PageHeader
        title="Knowledge"
        subtitle="La base de connaissance au service de l'exécution — jamais l'inverse."
      />
      <div className="grid sm:grid-cols-2 gap-4">
        {links.map((l) => (
          <Link key={l.to} to={l.to}>
            <Card className="card-hover h-full">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent-500/10 text-accent-400 flex items-center justify-center shrink-0">
                  <l.icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-medium text-fg">{l.title}</h3>
                  <p className="text-sm text-fg-muted mt-1">{l.desc}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
