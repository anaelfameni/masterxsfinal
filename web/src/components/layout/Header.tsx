import { Menu, Github, Search } from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'
import { useMemo } from 'react'

interface HeaderProps {
  onMenuClick: () => void
}

function getBreadcrumb(pathname: string): { label: string; to?: string }[] {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return [{ label: 'Dashboard' }]

  const labels: Record<string, string> = {
    playbook: 'Playbook',
    modules: 'Modules',
    file: 'Fichier',
    tools: 'Tools',
    'idea-scorer': 'Idea Scorer',
    roadmap: 'Roadmap',
    commandments: '20 Commandements',
  }

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
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb */}
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
        <button
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-elevated border border-border text-fg-subtle text-sm hover:border-border-strong hover:text-fg-muted transition-all"
          onClick={() => {
            const input = document.querySelector<HTMLInputElement>('input[data-search]')
            input?.focus()
          }}
          title="Search (soon)"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
          <kbd className="ml-2 px-1.5 py-0.5 rounded text-2xs font-mono bg-bg-overlay border border-border-strong text-fg-faint">
            ⌘K
          </kbd>
        </button>

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-md hover:bg-bg-elevated text-fg-muted hover:text-fg transition-colors"
          aria-label="GitHub"
        >
          <Github className="w-4 h-4" />
        </a>
      </div>
    </header>
  )
}
