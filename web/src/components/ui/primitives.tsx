import { cn } from '@/lib/utils'
import type { ProjectPriority, ProjectHealth, ProjectStatus, TaskPriority } from '@/lib/store/types'
import { t } from '@/lib/i18n'

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('card p-5', className)} {...props}>
      {children}
    </div>
  )
}

export function PageHeader({
  title, subtitle, actions,
}: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-fg tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-fg-muted mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}

export function EmptyState({
  icon: Icon, title, hint, action,
}: { icon?: React.ComponentType<{ className?: string }>; title: string; hint?: string; action?: React.ReactNode }) {
  return (
    <div className="card flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && <Icon className="w-8 h-8 text-fg-faint mb-3" />}
      <p className="text-fg-muted font-medium">{title}</p>
      {hint && <p className="text-sm text-fg-subtle mt-1 max-w-sm">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

const PRIORITY_CLS: Record<ProjectPriority, string> = {
  P1: 'pill-danger', P2: 'pill-warning', P3: 'pill-violet',
}
export function PriorityBadge({ priority }: { priority: ProjectPriority }) {
  return <span className={PRIORITY_CLS[priority]}>{t.priority[priority]}</span>
}

const HEALTH_DOT: Record<ProjectHealth, string> = {
  green: 'bg-success', yellow: 'bg-warning', red: 'bg-danger',
}
export function HealthBadge({ health }: { health: ProjectHealth }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-2xs text-fg-muted">
      <span className={cn('w-2 h-2 rounded-full', HEALTH_DOT[health])} />
      {t.health[health]}
    </span>
  )
}

const STATUS_CLS: Record<ProjectStatus, string> = {
  idea: 'pill-violet', validating: 'pill-warning', active: 'pill-success',
  paused: 'pill', killed: 'pill',
}
export function StatusBadge({ status }: { status: ProjectStatus }) {
  return <span className={cn(STATUS_CLS[status], 'text-fg-muted')}>{t.status[status]}</span>
}

const TASK_PRIORITY_CLS: Record<TaskPriority, string> = {
  high: 'text-danger', normal: 'text-fg-muted', low: 'text-fg-faint',
}
export function TaskPriorityDot({ priority }: { priority: TaskPriority }) {
  return (
    <span className={cn('text-2xs font-medium', TASK_PRIORITY_CLS[priority])}>
      {t.taskPriority[priority]}
    </span>
  )
}

export function Btn({
  variant = 'default', className, children, ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'primary' | 'ghost' | 'danger' }) {
  const styles = {
    default: 'bg-bg-elevated border border-border text-fg-muted hover:text-fg hover:border-border-strong',
    primary: 'bg-gradient-violet text-white shadow-glow-sm hover:shadow-glow',
    ghost: 'text-fg-muted hover:bg-bg-elevated hover:text-fg',
    danger: 'bg-danger/10 border border-danger/30 text-danger hover:bg-danger/20',
  }
  return (
    <button
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
        styles[variant], className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function Field({
  label, children,
}: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-fg-muted">{label}</span>
      {children}
    </label>
  )
}

export const inputCls =
  'w-full px-3 py-2 rounded-lg bg-bg-elevated border border-border text-sm text-fg placeholder:text-fg-faint focus:border-accent-500/50 transition-colors'
