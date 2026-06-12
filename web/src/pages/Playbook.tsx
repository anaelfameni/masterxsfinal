import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { BookOpen, List, Download } from 'lucide-react'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { getPlaybook } from '@/lib/content'
import { playbookSections } from '@/lib/playbook-data'
import { cn } from '@/lib/utils'

export default function Playbook() {
  const playbook = getPlaybook()
  const location = useLocation()
  const [activeSection, setActiveSection] = useState<string | null>(null)

  // Track active section via IntersectionObserver
  useEffect(() => {
    if (!playbook) return
    const headings = document.querySelectorAll('h2[id], h3[id]')
    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      { rootMargin: '-100px 0px -70% 0px', threshold: 0 }
    )

    headings.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [playbook, location.pathname])

  if (!playbook) {
    return (
      <div className="card p-8 text-center">
        <p className="text-fg-muted">Playbook introuvable.</p>
      </div>
    )
  }

  return (
    <div className="lg:grid lg:grid-cols-[1fr_240px] lg:gap-10 max-w-none">
      {/* Main content */}
      <article className="min-w-0">
        {/* Header */}
        <header className="mb-10 pb-6 border-b border-border">
          <div className="flex items-center gap-2 text-2xs uppercase tracking-widest text-accent-300 font-mono">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Playbook · v1.0.0</span>
          </div>
          <h1 className="mt-3 text-4xl lg:text-5xl font-semibold tracking-tighter gradient-text">
            MasterXS Playbook
          </h1>
          <p className="mt-3 text-fg-muted max-w-2xl">
            Le système d'exploitation du solo founder SaaS IA. Source unique de
            vérité. {playbookSections.length} sections. ~1690 lignes. Versionné.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href="/MASTERXS-PLAYBOOK.md"
              download
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-elevated border border-border text-xs text-fg-muted hover:border-accent-500/50 hover:text-fg transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Télécharger .md
            </a>
            <span className="pill-violet">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
              {playbookSections.length} sections
            </span>
          </div>
        </header>

        <MarkdownRenderer content={playbook.content} />
      </article>

      {/* TOC sidebar (right) */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
          <div className="flex items-center gap-2 text-2xs uppercase tracking-widest text-fg-faint font-semibold mb-3">
            <List className="w-3 h-3" />
            Sur cette page
          </div>
          <nav className="space-y-0.5 text-sm border-l border-border">
            {playbookSections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={cn(
                  'block pl-4 -ml-px py-1.5 border-l-2 transition-all',
                  activeSection === s.id
                    ? 'border-accent-500 text-accent-300 font-medium'
                    : 'border-transparent text-fg-subtle hover:text-fg-muted hover:border-border-strong'
                )}
              >
                <span className="font-mono text-2xs text-fg-faint mr-2">{s.number}.</span>
                {s.shortTitle}
              </a>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  )
}
