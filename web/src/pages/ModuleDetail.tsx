import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, FileText, Folder, CheckCircle2, Circle } from 'lucide-react'
import { modulesBySlug } from '@/lib/playbook-data'
import { getModuleFiles } from '@/lib/content'
import { cn, formatBytes } from '@/lib/utils'

export default function ModuleDetail() {
  const { slug } = useParams<{ slug: string }>()
  const module = slug ? modulesBySlug[slug] : undefined
  const files = slug ? getModuleFiles(slug) : []

  if (!module) {
    return (
      <div className="card p-8 text-center">
        <p className="text-fg-muted">Module introuvable.</p>
        <Link to="/modules" className="mt-4 inline-flex items-center gap-2 text-accent-300 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Retour aux modules
        </Link>
      </div>
    )
  }

  // Group files by subfolder
  const byFolder: Record<string, typeof files> = {}
  for (const f of files) {
    const segments = f.path.split('/')
    const folder = segments.length > 2 ? segments.slice(1, -1).join('/') : '/'
    if (!byFolder[folder]) byFolder[folder] = []
    byFolder[folder].push(f)
  }
  const folderKeys = Object.keys(byFolder).sort()

  const filled = files.filter((f) => !f.isStub).length
  const pct = files.length > 0 ? Math.round((filled / files.length) * 100) : 0
  const Icon = module.icon

  return (
    <div className="space-y-8">
      <Link
        to="/modules"
        className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-accent-300 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Tous les modules
      </Link>

      {/* Module hero */}
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card p-8 relative overflow-hidden"
      >
        <div
          aria-hidden
          className={cn(
            'absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-30 bg-gradient-to-br',
            module.color
          )}
        />
        <div className="relative flex items-start gap-5">
          <div
            className={cn(
              'shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-glow',
              module.color
            )}
          >
            <Icon className="w-7 h-7 text-white" strokeWidth={2.2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 text-2xs uppercase tracking-widest font-mono text-fg-faint">
              <span className="text-accent-400">{module.layer}</span>
              <span>·</span>
              <span>{module.slug}</span>
            </div>
            <h1 className="mt-2 text-3xl lg:text-4xl font-semibold tracking-tighter text-fg">
              {module.title}
            </h1>
            <p className="mt-3 text-fg-muted leading-relaxed max-w-2xl">
              {module.description}
            </p>
            <p className="mt-3 text-accent-300 italic">"{module.purpose}"</p>

            <div className="mt-6 flex flex-wrap gap-3 items-center">
              <span className="pill-violet">
                <FileText className="w-3 h-3" /> {files.length} fichiers
              </span>
              <span className="pill-success">
                <CheckCircle2 className="w-3 h-3" /> {filled} remplis
              </span>
              {pct < 100 && (
                <span className="pill-warning">
                  <Circle className="w-3 h-3" /> {files.length - filled} stubs
                </span>
              )}
              <span className="text-xs text-fg-faint font-mono">
                {pct}% complet
              </span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Files list */}
      <section>
        <h2 className="text-lg font-semibold text-fg mb-4 flex items-center gap-2">
          <Folder className="w-4 h-4 text-accent-400" />
          Fichiers du module
        </h2>

        {files.length === 0 ? (
          <div className="card p-8 text-center text-fg-muted">
            Aucun fichier pour l'instant.
          </div>
        ) : (
          <div className="space-y-4">
            {folderKeys.map((folder) => (
              <div key={folder}>
                {folder !== '/' && (
                  <h3 className="text-2xs uppercase tracking-widest text-fg-faint font-mono mb-2 ml-2">
                    📁 {folder}/
                  </h3>
                )}
                <div className="card overflow-hidden">
                  {byFolder[folder].map((f, idx) => (
                    <Link
                      key={f.path}
                      to={`/file/${f.path}`}
                      className={cn(
                        'group flex items-center gap-3 px-4 py-3 hover:bg-bg-elevated transition-colors',
                        idx > 0 && 'border-t border-border-subtle'
                      )}
                    >
                      <div className="shrink-0">
                        {f.isStub ? (
                          <Circle className="w-4 h-4 text-fg-faint" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-accent-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-fg group-hover:text-accent-300 transition-colors truncate">
                            {f.title}
                          </span>
                          <span className="text-2xs text-fg-faint font-mono truncate">
                            {f.filename}
                          </span>
                        </div>
                        <div className="text-2xs text-fg-subtle mt-0.5">
                          {f.isStub ? 'Stub à enrichir' : `Rempli · ${formatBytes(f.size)}`}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-fg-faint group-hover:text-accent-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
