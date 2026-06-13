import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard, FolderKanban, CheckSquare, Target, Lightbulb,
  Bot, BookText, StickyNote, Users, Repeat, Wallet, GitBranch,
  BookOpen, Settings, X, Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { t } from '@/lib/i18n'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

interface NavItem {
  to: string
  label: string
  icon: typeof LayoutDashboard
  end?: boolean
}

const sections: { title: string; items: NavItem[] }[] = [
  {
    title: 'Pilotage',
    items: [
      { to: '/', label: t.nav.now, icon: LayoutDashboard, end: true },
      { to: '/projects', label: t.nav.projects, icon: FolderKanban },
      { to: '/objectives', label: t.nav.objectives, icon: Target },
      { to: '/decisions', label: t.nav.decisions, icon: GitBranch },
    ],
  },
  {
    title: 'Exécution',
    items: [
      { to: '/tasks', label: t.nav.tasks, icon: CheckSquare },
      { to: '/journal', label: t.nav.journal, icon: BookText },
      { to: '/habits', label: t.nav.habits, icon: Repeat },
      { to: '/meetings', label: t.nav.meetings, icon: Users },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { to: '/businessgpt', label: t.nav.businessgpt, icon: Bot },
      { to: '/ideas', label: t.nav.ideas, icon: Lightbulb },
      { to: '/finances', label: t.nav.finances, icon: Wallet },
    ],
  },
  {
    title: 'Ressources',
    items: [
      { to: '/notes', label: t.nav.notes, icon: StickyNote },
      { to: '/knowledge', label: t.nav.knowledge, icon: BookOpen },
      { to: '/settings', label: t.nav.settings, icon: Settings },
    ],
  },
]

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed top-0 left-0 h-screen w-[260px] z-50 flex flex-col',
          'bg-bg-surface/95 backdrop-blur-xl border-r border-border',
          'transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-border shrink-0">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-violet flex items-center justify-center shadow-glow-sm">
              <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
              <div className="absolute inset-0 rounded-lg bg-gradient-violet opacity-50 blur-md group-hover:opacity-80 transition-opacity" />
            </div>
            <div className="leading-none">
              <div className="font-semibold text-fg tracking-tight">{t.app.name}</div>
              <div className="text-2xs text-fg-subtle mt-0.5 font-mono">project manager</div>
            </div>
          </NavLink>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md hover:bg-bg-elevated text-fg-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="px-3 mb-2 text-2xs uppercase tracking-widest text-fg-faint font-semibold">
                {section.title}
              </h3>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                        isActive
                          ? 'bg-accent-500/10 text-accent-300 shadow-inner-glow'
                          : 'text-fg-muted hover:bg-bg-elevated hover:text-fg'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={cn(
                            'w-4 h-4 shrink-0',
                            isActive ? 'text-accent-400' : 'text-fg-subtle group-hover:text-fg-muted'
                          )}
                        />
                        <span className="truncate">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-border text-2xs text-fg-faint shrink-0">
          <div className="font-mono">local-first · $0</div>
          <div className="mt-1 text-fg-subtle">Quoi faire maintenant ?</div>
        </div>
      </aside>
    </>
  )
}
