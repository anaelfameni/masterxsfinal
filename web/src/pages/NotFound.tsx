import { Link } from 'react-router-dom'
import { ArrowLeft, AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="card p-10 text-center max-w-md">
        <AlertTriangle className="w-10 h-10 mx-auto text-warning mb-4" />
        <h1 className="text-3xl font-semibold tracking-tight gradient-text">404</h1>
        <p className="mt-2 text-fg-muted">
          Cette page n'existe pas dans le playbook.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-violet text-white text-sm font-medium shadow-glow hover:shadow-glow-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au dashboard
        </Link>
      </div>
    </div>
  )
}
