import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Layers } from 'lucide-react'
import { modules } from '@/lib/playbook-data'
import { getModuleFiles } from '@/lib/content'
import { cn } from '@/lib/utils'

export default function Modules() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/30 text-2xs text-accent-300 font-mono">
          <Layers className="w-3 h-3" />
          {modules.length} modules
        </div>
        <h1 className="mt-4 text-4xl lg:text-5xl font-semibold tracking-tighter gradient-text">
          Modules L0 → L7
        </h1>
        <p className="mt-3 max-w-2xl text-fg-muted">
          L'architecture du playbook en 8 couches.
          De l'identité (L0) au méta (L∞), chaque module est autonome mais nourri par les autres.
        </p>
      </header>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((m, idx) => {
          const files = getModuleFiles(m.slug)
          const filled = files.filter((f) => !f.isStub).length
          const pct = files.length > 0 ? Math.round((filled / files.length) * 100) : 0

          return (
            <motion.div
              key={m.slug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
            >
              <Link
                to={`/modules/${m.slug}`}
                className="group card card-hover p-6 h-full flex flex-col"
              >
                {/* Top */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-glow-sm',
                      m.color
                    )}
                  >
                    <m.icon className="w-5 h-5 text-white" strokeWidth={2.2} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xs uppercase font-mono text-fg-faint tracking-widest">
                      {m.layer}
                    </div>
                    <div className="text-2xs text-fg-subtle font-mono mt-0.5">
                      {files.length} fichiers
                    </div>
                  </div>
                </div>

                {/* Title + description */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-fg group-hover:text-accent-300 transition-colors leading-tight">
                    {m.title}
                  </h2>
                  <p className="mt-1 text-xs text-fg-faint font-mono">{m.slug}</p>
                  <p className="mt-3 text-sm text-fg-muted leading-relaxed">
                    {m.description}
                  </p>
                  <p className="mt-3 text-xs text-accent-300/80 italic leading-relaxed">
                    "{m.purpose}"
                  </p>
                </div>

                {/* Footer progress */}
                <div className="mt-5 pt-4 border-t border-border space-y-2">
                  <div className="flex items-center justify-between text-2xs">
                    <span className="text-fg-subtle">Rempli</span>
                    <span className="font-mono text-fg-muted">
                      {filled} / {files.length} · {pct}%
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-bg-overlay overflow-hidden">
                    <div
                      className="h-full bg-gradient-violet"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-fg-muted group-hover:text-accent-300 transition-colors pt-1">
                    Explorer le module
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
