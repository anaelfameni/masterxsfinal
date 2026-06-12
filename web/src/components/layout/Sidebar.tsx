import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Calculator,
  Map,
  ScrollText,
  X,
  Sparkles,
  Skull,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { modules } from '@/lib/playbook-data'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const mainNav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/playbook', label: 'Playbook', icon: BookOpen },
  { to: '/modules', label: 'Modules L0-L7', icon: Layers },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
  { to: '/commandments', label: '20 Commandements', icon: ScrollText },
]

const tools = [
  { to: '/tools/idea-analyzer', label: 'SaaS Idea Analyzer', icon: Skull },
  { to: '/tools/idea-scorer', label: 'Idea Scorer', icon: Calculator },
]

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
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

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-screen w-[260px] z-50 flex flex-col',
          'bg-bg-surface/95 backdrop-blur-xl border-r border-border',
          'transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-border shrink-0">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-violet flex items-center justify-center shadow-glow-sm">
              <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
              <div className="absolute inset-0 rounded-lg bg-gradient-violet opacity-50 blur-md group-hover:opacity-80 transition-opacity" />
            </div>
            <div className="leading-none">
              <div className="font-semibold text-fg tracking-tight">MasterXS</div>
              <div className="text-2xs text-fg-subtle mt-0.5 font-mono">v1.0.0 · solo founder OS</div>
            </div>
          </NavLink>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md hover:bg-bg-elevated text-fg-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav scroll area */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main nav */}
          <div className="space-y-0.5">
            {mainNav.map((item) => (
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

          {/* Tools */}
          <div>
            <h3 className="px-3 mb-2 text-2xs uppercase tracking-widest text-fg-faint font-semibold">
              Tools
            </h3>
            <div className="space-y-0.5">
              {tools.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      isActive
                        ? 'bg-accent-500/10 text-accent-300'
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

          {/* Modules quick access */}
          <div>
            <h3 className="px-3 mb-2 text-2xs uppercase tracking-widest text-fg-faint font-semibold">
              Modules
            </h3>
            <div className="space-y-0.5">
              {modules.map((m) => (
                <NavLink
                  key={m.slug}
                  to={`/modules/${m.slug}`}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-all',
                      isActive
                        ? 'bg-accent-500/10 text-accent-300'
                        : 'text-fg-muted hover:bg-bg-elevated hover:text-fg'
                    )
                  }
                >
                  <span className="font-mono text-2xs text-fg-faint group-hover:text-accent-400 transition-colors w-7 shrink-0">
                    {m.layer}
                  </span>
                  <span className="truncate">{m.shortTitle}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border text-2xs text-fg-faint shrink-0">
          <div className="font-mono">Phase 1 · Playbook personnel</div>
          <div className="mt-1 text-fg-subtle">Goal Y1 : 3-5K MRR</div>
        </div>
      </aside>
    </>
  )
}
