import { motion } from 'framer-motion'
import { ScrollText, Quote } from 'lucide-react'
import { commandments } from '@/lib/playbook-data'

export default function Commandments() {
  return (
    <div className="space-y-10 max-w-5xl">
      <header>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/30 text-2xs text-accent-300 font-mono">
          <ScrollText className="w-3 h-3" />
          À coller au mur
        </div>
        <h1 className="mt-4 text-4xl lg:text-5xl font-semibold tracking-tighter gradient-text">
          Les 20 Commandements
        </h1>
        <p className="mt-3 max-w-2xl text-fg-muted">
          Les règles non-négociables du solo founder bootstrap.
          Lus chaque vendredi. Appliqués chaque jour. Ignore-les à tes risques.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {commandments.map((c, idx) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.025 }}
            className="card p-5 relative overflow-hidden group hover:border-accent-500/40 hover:shadow-glow-sm transition-all"
          >
            <div
              aria-hidden
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-accent-500/5 blur-2xl group-hover:bg-accent-500/15 transition-all"
            />
            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="text-2xs font-mono tracking-widest text-fg-faint">
                  COMMANDEMENT
                </span>
                <span className="text-2xs font-mono text-accent-400 font-semibold">
                  #{c.id.toString().padStart(2, '0')}
                </span>
              </div>
              <p className="mt-3 text-base font-medium text-fg leading-snug">
                <span className="text-accent-400 mr-1">"</span>
                {c.text.replace(/\.$/, '')}
                <span className="text-accent-400 ml-1">"</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pull quote */}
      <motion.blockquote
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="card p-8 lg:p-12 relative overflow-hidden text-center"
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-violet-subtle opacity-50 pointer-events-none"
        />
        <Quote className="w-8 h-8 mx-auto text-accent-400/50 mb-4" />
        <p className="text-2xl lg:text-3xl font-semibold tracking-tight gradient-text-violet leading-tight max-w-3xl mx-auto">
          Méta-règle : quand tu ne sais pas quoi faire, fais quelque chose
          que le client peut voir cette semaine.
        </p>
        <p className="mt-4 text-fg-muted text-sm">
          Customer-visible motion compounds. Internal motion ne compound pas.
        </p>
      </motion.blockquote>
    </div>
  )
}
