// Storage local des analyses + export vers le filesystem MasterXS (via /api/file).
// Index dans localStorage, contenu complet dans localStorage aussi (taille raisonnable).

import type { Answers, IdeaReport } from './types'
import { QUESTIONS, DIMENSIONS_BY_ID, VERDICT_META } from './questions'

const STORAGE_KEY_REPORTS = 'masterxs:idea-analyzer:reports'
const STORAGE_KEY_DRAFT = 'masterxs:idea-analyzer:draft'
const STORAGE_KEY_GROQ = 'masterxs:idea-analyzer:groq-key'

// ── Reports
export function listReports(): IdeaReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REPORTS)
    if (!raw) return []
    const parsed = JSON.parse(raw) as IdeaReport[]
    return Array.isArray(parsed) ? parsed.sort((a, b) => b.createdAt - a.createdAt) : []
  } catch {
    return []
  }
}

export function saveReport(report: IdeaReport): void {
  const all = listReports()
  const idx = all.findIndex((r) => r.id === report.id)
  if (idx >= 0) all[idx] = report
  else all.unshift(report)
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(all))
}

export function getReport(id: string): IdeaReport | undefined {
  return listReports().find((r) => r.id === id)
}

export function deleteReport(id: string): void {
  const all = listReports().filter((r) => r.id !== id)
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(all))
}

// ── Draft (wizard auto-save)
export function saveDraft(answers: Answers, currentStep: number): void {
  localStorage.setItem(
    STORAGE_KEY_DRAFT,
    JSON.stringify({ answers, currentStep, savedAt: Date.now() })
  )
}

export function loadDraft(): { answers: Answers; currentStep: number; savedAt: number } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DRAFT)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearDraft(): void {
  localStorage.removeItem(STORAGE_KEY_DRAFT)
}

// ── Groq API key (opt-in, local only)
export function getGroqKey(): string {
  return localStorage.getItem(STORAGE_KEY_GROQ) || ''
}

export function setGroqKey(key: string): void {
  if (!key) localStorage.removeItem(STORAGE_KEY_GROQ)
  else localStorage.setItem(STORAGE_KEY_GROQ, key)
}

// ── Markdown export
export function reportToMarkdown(report: IdeaReport): string {
  const verdictMeta = VERDICT_META[report.verdict]
  const lines: string[] = []

  lines.push(`---`)
  lines.push(`title: "${escapeYaml(report.title)}"`)
  lines.push(`date: ${new Date(report.createdAt).toISOString()}`)
  lines.push(`verdict: ${report.verdict}`)
  lines.push(`global_score: ${report.globalScore}`)
  lines.push(`tags: [idea-analyzer, discovery, ${report.verdict.toLowerCase()}]`)
  lines.push(`---`)
  lines.push('')
  lines.push(`# ${report.title}`)
  lines.push('')
  lines.push(`> **Verdict** : ${verdictMeta.label} — ${verdictMeta.short}`)
  lines.push(`> **Score global** : **${report.globalScore}/100**`)
  lines.push(`> **Date** : ${new Date(report.createdAt).toLocaleString('fr-FR')}`)
  lines.push('')

  if (report.earlyKill) {
    lines.push(`## Early Kill`)
    lines.push('')
    lines.push(`**Raison** : ${report.earlyKill.reason}`)
    lines.push('')
    lines.push(`**Action recommandée** : ${report.earlyKill.action}`)
    lines.push('')
  }

  lines.push(`## Verdict`)
  lines.push('')
  lines.push(`**${verdictMeta.label}** — ${verdictMeta.description}`)
  lines.push('')

  lines.push(`## Breakdown par dimension`)
  lines.push('')
  lines.push(`| Dimension | Score | Raisonnement |`)
  lines.push(`|---|---:|---|`)
  for (const s of report.scores) {
    const dim = DIMENSIONS_BY_ID[s.id]
    lines.push(`| ${dim?.label ?? s.id} | **${s.score}/100** | ${s.reasoning} |`)
  }
  lines.push('')

  if (report.strengths.length) {
    lines.push(`## Points forts détectés`)
    lines.push('')
    for (const s of report.strengths) {
      lines.push(`- **${s.questionId}** — ${s.message}`)
    }
    lines.push('')
  }

  if (report.redFlags.length) {
    lines.push(`## Red flags`)
    lines.push('')
    for (const f of report.redFlags) {
      lines.push(`- **[${f.severity.toUpperCase()}]** ${f.message} _(${f.questionId})_`)
    }
    lines.push('')
  }

  if (report.pivots.length) {
    lines.push(`## Pivots suggérés`)
    lines.push('')
    for (const p of report.pivots) {
      lines.push(`- ${p}`)
    }
    lines.push('')
  }

  lines.push(`## Prochaines actions`)
  lines.push('')
  for (const a of report.nextActions) {
    lines.push(`- ${a}`)
  }
  lines.push('')

  if (report.aiAnalysis) {
    const a = report.aiAnalysis
    lines.push(`## Analyse IA (${a.model})`)
    lines.push('')
    lines.push(`**Résumé** : ${a.summary}`)
    lines.push('')
    lines.push(`- Faisabilité : **${a.feasibilityScore}/10**`)
    lines.push(`- Rentabilité : **${a.profitabilityScore}/10**`)
    lines.push('')
    if (a.topRisks.length) {
      lines.push(`### Risques majeurs`)
      a.topRisks.forEach((r) => lines.push(`- ${r}`))
      lines.push('')
    }
    if (a.topStrengths.length) {
      lines.push(`### Forces clés`)
      a.topStrengths.forEach((r) => lines.push(`- ${r}`))
      lines.push('')
    }
    if (a.nextSteps.length) {
      lines.push(`### Next steps recommandés`)
      a.nextSteps.forEach((r) => lines.push(`- ${r}`))
      lines.push('')
    }
    lines.push(`### Verdict final IA`)
    lines.push('')
    lines.push(`> ${a.finalVerdict}`)
    lines.push('')
  }

  lines.push(`## Réponses brutes`)
  lines.push('')
  for (const q of QUESTIONS) {
    const v = report.answers[q.id]
    if (v == null || v === '') continue
    let display: string
    if (q.type === 'select') {
      const opt = q.options?.find((o) => o.value === v)
      display = opt?.label ?? String(v)
    } else {
      display = String(v)
    }
    lines.push(`### ${q.label}`)
    lines.push('')
    lines.push(display)
    lines.push('')
  }

  return lines.join('\n')
}

function escapeYaml(s: string): string {
  return s.replace(/"/g, '\\"')
}

// Export to filesystem under 02-discovery/ideas/
export async function exportReportToFile(
  report: IdeaReport
): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  const filename = `${dateStr(report.createdAt)}-${report.slug}.md`
  const path = `02-discovery/ideas/${filename}`
  const content = reportToMarkdown(report)
  try {
    const res = await fetch(`/api/file?path=${encodeURIComponent(path)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { ok: false, error: err.error || `HTTP ${res.status}` }
    }
    return { ok: true, path }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}

function dateStr(ms: number): string {
  const d = new Date(ms)
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}
