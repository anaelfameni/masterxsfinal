import { Menu } from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'
import { useMemo } from 'react'
import ThemeToggle from './ThemeToggle'

interface HeaderProps {
  onMenuClick: () => void
}

const labels: Record<string, string> = {
  projects: 'Projets', tasks: 'Tâches', objectives: 'Objectifs',
  decisions: 'Décisions', ideas: 'Idées', businessgpt: 'BusinessGPT',
  journal: 'Journal', notes: 'Notes', meetings: 'Réunions',
  habits: 'Habitudes', finances: 'Finances', knowledge: 'Knowledge',
  settings: 'Réglages', tools: 'Outils', 'idea-analyzer': 'Analyseur d\'idées',
  'idea-scorer': 'Scoring', new: 'Nouveau', result: 'Résultat',
  modules: 'Modules', file: 'Fichier', roadmap: 'Roadmap', commandments: 'Commandements',
  playbook: 'Playbook',
}

function getBreadcrumb(pathname: string): { label: string; to?: string }[] {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return [{ label: 'NOW' }]
  return segments.map((seg, idx) => ({
    label: labels[seg] || decodeURIComponent(seg),
    to: idx < segments.length - 1 ? '/' + segments.slice(0, idx + 1).join('/') : undefined,
  }))
}

export default function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation()
  const crumbs = useMemo(() => getBreadcrumb(location.pathname), [location.pathname])

  return (
    <header className="sticky top-0 z-30 h-16 px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-md hover:bg-bg-elevated text-fg-muted shrink-0"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav className="flex items-center gap-2 text-sm min-w-0 overflow-hidden">
          {crumbs.map((c, idx) => (
            <span key={idx} className="flex items-center gap-2 min-w-0">
              {idx > 0 && <span className="text-fg-faint shrink-0">/</span>}
              {c.to ? (
                <Link
                  to={c.to}
                  className="text-fg-muted hover:text-accent-300 transition-colors truncate"
                >
                  {c.label}
                </Link>
              ) : (
                <span className="text-fg truncate font-medium">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <ThemeToggle />
      </div>
    </header>
  )
}
