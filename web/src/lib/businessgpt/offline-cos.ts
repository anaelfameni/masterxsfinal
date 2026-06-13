// Chief of Staff hors ligne : analyse déterministe + sérialisation du portefeuille.

import type { MasterXSData } from '../store/types'
import { portfolioAlerts, recentWins, isStagnant, daysUntil, daysSince } from '../store/rules'

export function serializePortfolio(data: MasterXSData): string {
  const lines: string[] = []
  lines.push('ÉTAT DU PORTEFEUILLE MASTERXS')
  lines.push('')
  const active = data.projects.filter((p) => p.status !== 'killed')
  lines.push(`Projets actifs : ${active.length}`)
  const totalMrr = data.projects.reduce((s, p) => s + (p.mrr || 0), 0)
  lines.push(`MRR total : ${totalMrr}€`)
  lines.push('')
  for (const p of active) {
    lines.push(`• ${p.name} [${p.priority}/${p.status}/${p.health}] MRR=${p.mrr}€`)
    if (p.nextAction) lines.push(`  next: ${p.nextAction}`)
    if (p.blockedBy) lines.push(`  bloqué par: ${p.blockedBy}`)
    if (p.deadline) lines.push(`  échéance: ${p.deadline}`)
    lines.push(`  dernière activité: il y a ${daysSince(p.lastActivityAt)}j`)
    const tasks = data.tasks.filter((t) => t.projectId === p.id && t.status !== 'done')
    if (tasks.length) lines.push(`  tâches ouvertes: ${tasks.map((t) => t.title).join('; ')}`)
  }
  lines.push('')
  for (const o of data.objectives) {
    const krs = o.keyResults.map((k) => `${k.label} ${k.current}/${k.target}${k.unit ?? ''}`).join(', ')
    lines.push(`Objectif: ${o.title} — ${krs}`)
  }
  return lines.join('\n')
}

export function offlineCosReport(data: MasterXSData): string {
  const alerts = portfolioAlerts(data)
  const wins = recentWins(data)
  const active = data.projects.filter((p) => p.status !== 'killed')
  const p1 = active.find((p) => p.priority === 'P1')

  const out: string[] = []
  out.push('## Synthèse')
  out.push(
    p1
      ? `Ton focus actuel est **${p1.name}**. Prochaine action : ${p1.nextAction || '⚠️ non définie'}.`
      : '⚠️ Aucun projet en P1 : tu n\'as pas de focus clair cette semaine.'
  )
  out.push(`${active.length} projets actifs, ${data.tasks.filter((t) => t.status !== 'done').length} tâches ouvertes.`)
  out.push('')

  out.push('## Risques détectés')
  if (alerts.length === 0) out.push('Aucun risque déterministe détecté. Continue.')
  else alerts.forEach((a) => out.push(`- ${a.message}`))
  out.push('')

  out.push('## Recommandations')
  const recs: string[] = []
  active.filter(isStagnant).forEach((p) =>
    recs.push(`Relancer ou mettre en pause **${p.name}** (stagnant).`)
  )
  active.forEach((p) => {
    const dl = daysUntil(p.deadline)
    if (dl !== null && dl <= 7 && dl >= 0) recs.push(`Prioriser **${p.name}** : échéance dans ${dl}j.`)
  })
  if (!p1) recs.push('Définir un unique projet P1 pour concentrer ton énergie.')
  if (recs.length === 0) recs.push('Exécuter la prochaine action du projet P1 sans te disperser.')
  recs.slice(0, 5).forEach((r) => out.push(`- ${r}`))
  out.push('')

  if (wins.length) {
    out.push('## Victoires récentes')
    wins.forEach((w) => out.push(`- ${w}`))
    out.push('')
  }

  out.push('## Question d\'arbitrage')
  out.push(
    p1
      ? `Est-ce que tout ce que tu fais cette semaine sert directement à faire avancer **${p1.name}** ?`
      : 'Quel projet unique mérite ton statut P1 cette semaine, et lesquels mettre en pause ?'
  )
  return out.join('\n')
}
