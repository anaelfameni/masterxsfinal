// Règles d'arbitrage du portefeuille et détections déterministes (hors ligne).

import type { MasterXSData, Project, Task } from './types'

export const STAGNATION_DAYS = 7
export const DEADLINE_SOON_DAYS = 14
export const MS_PER_DAY = 86_400_000

export function daysSince(ts: number): number {
  return Math.floor((Date.now() - ts) / MS_PER_DAY)
}

export function daysUntil(isoDate?: string | null): number | null {
  if (!isoDate) return null
  const target = new Date(isoDate + 'T00:00:00').getTime()
  if (Number.isNaN(target)) return null
  return Math.ceil((target - Date.now()) / MS_PER_DAY)
}

export function isStagnant(p: Project): boolean {
  return p.status === 'active' && daysSince(p.lastActivityAt) >= STAGNATION_DAYS
}

// Santé recalculée automatiquement : un projet actif stagnant >= 7j devient yellow.
export function computedHealth(p: Project): Project['health'] {
  if (p.status === 'killed' || p.status === 'paused') return p.health
  if (p.blockedBy) return 'red'
  if (isStagnant(p)) return p.health === 'red' ? 'red' : 'yellow'
  return p.health
}

export interface PortfolioAlert {
  level: 'danger' | 'warning' | 'info'
  message: string
  projectId?: string
}

export function portfolioAlerts(data: MasterXSData): PortfolioAlert[] {
  const alerts: PortfolioAlert[] = []
  const active = data.projects.filter((p) => p.status !== 'killed')

  const p1 = active.filter((p) => p.priority === 'P1')
  const p2 = active.filter((p) => p.priority === 'P2')

  if (p1.length > 1) {
    alerts.push({
      level: 'danger',
      message: `Règle violée : ${p1.length} projets en P1 (1 seul autorisé). Le focus est dilué.`,
    })
  }
  if (p2.length > 2) {
    alerts.push({
      level: 'warning',
      message: `Règle violée : ${p2.length} projets en P2 (2 maximum recommandés).`,
    })
  }

  for (const p of p1) {
    if (!p.nextAction || !p.nextAction.trim()) {
      alerts.push({
        level: 'danger',
        message: `${p.name} est en P1 mais n'a aucune prochaine action définie.`,
        projectId: p.id,
      })
    }
  }

  for (const p of active) {
    if (isStagnant(p)) {
      alerts.push({
        level: 'warning',
        message: `${p.name} stagne depuis ${daysSince(p.lastActivityAt)} jours.`,
        projectId: p.id,
      })
    }
    const dl = daysUntil(p.deadline)
    if (dl !== null && dl >= 0 && dl <= DEADLINE_SOON_DAYS) {
      alerts.push({
        level: dl <= 3 ? 'danger' : 'info',
        message: `${p.name} : échéance dans ${dl} jour${dl > 1 ? 's' : ''}.`,
        projectId: p.id,
      })
    }
  }

  return alerts
}

export function blockingTasks(data: MasterXSData): Task[] {
  const soon = (t: Task) => {
    const dl = daysUntil(t.deadline)
    return dl !== null && dl <= 1
  }
  return data.tasks.filter(
    (t) => t.status !== 'done' && (t.priority === 'high' || soon(t))
  )
}

export function recentWins(data: MasterXSData): string[] {
  const wins: string[] = []
  const since = Date.now() - 7 * MS_PER_DAY
  for (const t of data.tasks) {
    if (t.status === 'done' && t.updatedAt >= since) {
      wins.push(t.title)
    }
  }
  return wins.slice(0, 8)
}
