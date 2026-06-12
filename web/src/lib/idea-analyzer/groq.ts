// Client Groq (opt-in). Le user fournit sa clé API, stockée en localStorage.
// Modèle : Llama 3.3 70B Versatile (rapide, gratuit tier généreux).

import type { AiAnalysis, Answers, IdeaReport } from './types'
import { DIMENSIONS_BY_ID, QUESTIONS, VERDICT_META } from './questions'

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

// Manifeste MasterXS intégré dans le prompt (court, ciblé)
const MASTERXS_PHILOSOPHY = `
PHILOSOPHIE MASTERXS — gardiens de ton analyse :
1. Validation > Vision (parler aux clients avant de coder)
2. Distribution > Code (le canal d'acquisition se conçoit AVANT le produit)
3. Cash > Scaling (le revenu prime sur la "growth")
4. Pre-sell avant build (5 paid pre-orders ou 3 LOIs sinon on ne code pas)
5. MVP en 6 semaines max (au-delà, c'est une dérive)
6. 1 canal de distribution avant d'en ajouter un deuxième
7. Tue les mauvaises idées tôt (90% des idées doivent mourir au scoring)
8. Pas d'outil payant Phase 1 (100% free tier + open source)

Tu es BUSINESSGPT, l'IA d'analyse de MasterXS. Tu es brutalement honnête, pas cruelle.
Tu refuses la politesse de complaisance. Tu nommes les red flags par leur nom.
Tu ne flatte jamais une idée faible.
`.trim()

function buildPrompt(report: IdeaReport): string {
  const answersText = QUESTIONS.map((q) => {
    const v = report.answers[q.id]
    if (v == null || v === '') return null
    let display = String(v)
    if (q.type === 'select') {
      const opt = q.options?.find((o) => o.value === v)
      display = opt?.label ?? String(v)
    }
    return `Q: ${q.label}\nR: ${display}`
  })
    .filter(Boolean)
    .join('\n\n')

  const heuristicScores = report.scores
    .map((s) => `- ${DIMENSIONS_BY_ID[s.id]?.label ?? s.id}: ${s.score}/100`)
    .join('\n')

  return `
${MASTERXS_PHILOSOPHY}

═══════════════════════════════════════════
IDÉE SOUMISE PAR LE SOLO FOUNDER
═══════════════════════════════════════════

${answersText}

═══════════════════════════════════════════
SCORING HEURISTIQUE PRÉ-CALCULÉ (à challenger ou confirmer)
═══════════════════════════════════════════

Score global : ${report.globalScore}/100
Verdict heuristique : ${VERDICT_META[report.verdict]?.label}

Scores par dimension :
${heuristicScores}

Red flags détectés : ${report.redFlags.length}
Points forts détectés : ${report.strengths.length}

═══════════════════════════════════════════
MISSION
═══════════════════════════════════════════

Analyse cette idée selon la philosophie MasterXS. Sois brutal, pas cruel.

Réponds UNIQUEMENT en JSON strict valide (pas de markdown, pas de texte avant/après) avec cette structure exacte :

{
  "summary": "Résumé en 5 lignes maximum de ton analyse, ton brutal mais constructif",
  "feasibilityScore": <0-10>,
  "profitabilityScore": <0-10>,
  "topRisks": [
    "Risque 1 (le plus critique)",
    "Risque 2",
    "Risque 3"
  ],
  "topStrengths": [
    "Force 1 (la plus exploitable)",
    "Force 2"
  ],
  "nextSteps": [
    "Action concrète 1 (à faire cette semaine)",
    "Action concrète 2",
    "Action concrète 3"
  ],
  "finalVerdict": "2 phrases brutales. Phrase 1 = ton verdict (GO / ITERATE / PIVOT / KILL). Phrase 2 = pourquoi."
}

CONTRAINTES :
- finalVerdict en 2 phrases MAX, pas plus
- summary en 5 lignes MAX
- nextSteps : action exécutable cette semaine, pas du blabla
- Aligne ton verdict sur la philosophie MasterXS (validation, distribution, cash)
- Si l'idée mérite KILL, dis-le sans détour
`.trim()
}

export interface GroqAnalysisError {
  ok: false
  error: string
  hint?: string
}

export interface GroqAnalysisSuccess {
  ok: true
  analysis: AiAnalysis
}

export type GroqAnalysisResult = GroqAnalysisSuccess | GroqAnalysisError

export async function runGroqAnalysis(
  report: IdeaReport,
  apiKey: string
): Promise<GroqAnalysisResult> {
  if (!apiKey) {
    return {
      ok: false,
      error: 'Clé API Groq manquante.',
      hint: "Récupère une clé gratuite sur console.groq.com puis ajoute-la dans Paramètres.",
    }
  }

  const prompt = buildPrompt(report)

  try {
    const res = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: 'Tu es BUSINESSGPT, l\'IA d\'analyse d\'idées SaaS de MasterXS. Tu réponds toujours en JSON strict valide.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
        max_tokens: 1200,
      }),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      let hint = ''
      if (res.status === 401) hint = "Clé Groq invalide ou expirée. Régénère-la sur console.groq.com."
      if (res.status === 429) hint = "Quota Groq dépassé. Attends quelques minutes."
      return { ok: false, error: `Groq HTTP ${res.status} — ${errText.slice(0, 200)}`, hint }
    }

    const data = await res.json()
    const raw = data?.choices?.[0]?.message?.content ?? ''
    let parsed: any
    try {
      parsed = JSON.parse(raw)
    } catch {
      return {
        ok: false,
        error: 'Réponse Groq non-JSON ou invalide.',
        hint: 'Réessaye ou simplifie tes réponses.',
      }
    }

    const analysis: AiAnalysis = {
      generatedAt: Date.now(),
      model: MODEL,
      summary: String(parsed.summary ?? '').slice(0, 800),
      feasibilityScore: clampScore(parsed.feasibilityScore),
      profitabilityScore: clampScore(parsed.profitabilityScore),
      topRisks: arr(parsed.topRisks).slice(0, 5),
      topStrengths: arr(parsed.topStrengths).slice(0, 5),
      nextSteps: arr(parsed.nextSteps).slice(0, 5),
      finalVerdict: String(parsed.finalVerdict ?? '').slice(0, 400),
      rawResponse: raw,
    }

    return { ok: true, analysis }
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
      hint: 'Vérifie ta connexion internet ou ta clé Groq.',
    }
  }
}

function clampScore(v: unknown): number {
  const n = Number(v)
  if (Number.isNaN(n)) return 0
  return Math.max(0, Math.min(10, Math.round(n * 10) / 10))
}

function arr(v: unknown): string[] {
  if (!Array.isArray(v)) return []
  return v.map((x) => String(x)).filter(Boolean)
}
