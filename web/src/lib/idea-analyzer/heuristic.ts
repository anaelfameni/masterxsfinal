// Scoring heuristique 100% local — ancré sur la philosophie MasterXS.
// Pas d'IA, pas de réseau. Résultat déterministe.

import type {
  Answers,
  AnswerValue,
  DimensionScore,
  IdeaReport,
  RedFlag,
  Strength,
  Verdict,
} from './types'
import { DIMENSIONS, QUESTIONS } from './questions'

const VAGUE_VERBS = [
  'optimiser',
  'améliorer',
  'faciliter',
  'simplifier',
  'fluidifier',
  'révolutionner',
  'disrupter',
  'transformer',
]

const VAGUE_PERSONAS = [
  'les entrepreneurs',
  'les gens',
  'les utilisateurs',
  'les entreprises',
  'tout le monde',
  'tous les',
  'beaucoup de',
]

function str(v: AnswerValue): string {
  return typeof v === 'string' ? v : v == null ? '' : String(v)
}

function len(v: AnswerValue): number {
  return str(v).trim().length
}

function isFilled(v: AnswerValue, minLen = 1): boolean {
  return len(v) >= minLen
}

function hasVagueVerb(v: AnswerValue): boolean {
  const lower = str(v).toLowerCase()
  return VAGUE_VERBS.some((w) => lower.includes(w))
}

function hasVaguePersona(v: AnswerValue): boolean {
  const lower = str(v).toLowerCase()
  return VAGUE_PERSONAS.some((w) => lower.includes(w))
}

function selectScore(answers: Answers, qId: string): number {
  const q = QUESTIONS.find((x) => x.id === qId)
  if (!q || q.type !== 'select') return 0
  const val = answers[qId]
  const opt = q.options?.find((o) => o.value === val)
  return opt?.score ?? 0
}

// Score 0-100 per dimension
function scorePain(answers: Answers): { score: number; reasoning: string; flags: RedFlag[]; strengths: Strength[] } {
  const flags: RedFlag[] = []
  const strengths: Strength[] = []
  let s = 50

  // Q2 — problème spécifique
  const problem = answers.q2_problem
  if (len(problem) < 40) {
    flags.push({ questionId: 'q2_problem', severity: 'major', message: 'Description du problème trop courte — manque de spécificité.' })
    s -= 15
  } else {
    s += 10
  }
  if (hasVagueVerb(problem)) {
    flags.push({ questionId: 'q2_problem', severity: 'minor', message: "Verbes vagues détectés (optimiser/améliorer/faciliter). Reformule avec 'sans X, ils font Y péniblement parce que Z'." })
    s -= 10
  }

  // Q3 — persona spécifique
  const persona = answers.q3_persona
  if (hasVaguePersona(persona)) {
    flags.push({ questionId: 'q3_persona', severity: 'critical', message: "Persona trop vague ('les entrepreneurs', 'tout le monde'). Sans persona précise, pas de marché." })
    s -= 25
  } else if (len(persona) > 60) {
    strengths.push({ questionId: 'q3_persona', message: 'Persona spécifique et détaillée — bon signal.' })
    s += 15
  }

  // Q4 — conversations clients (signal le plus fort)
  const conv = selectScore(answers, 'q4_conversations')
  if (conv === 0) {
    flags.push({ questionId: 'q4_conversations', severity: 'critical', message: "Zéro conversation client. C'est LE signal d'alarme. Parle à 10 personnes avant tout." })
    s = Math.min(s, 25)
  } else if (conv >= 70) {
    strengths.push({ questionId: 'q4_conversations', message: 'Tu as fait le travail terrain — base solide pour avancer.' })
    s += 20
  }

  // Q5 — solution existante
  const existing = str(answers.q5_existing_solution).toLowerCase()
  if (/excel|rien|manuel|whatsapp|email|google sheet/.test(existing)) {
    strengths.push({ questionId: 'q5_existing_solution', message: 'Workaround manuel/Excel = douleur réelle non résolue.' })
    s += 10
  }

  return { score: Math.max(0, Math.min(100, s)), reasoning: 'Spécificité persona + nb conversations + nature de la douleur', flags, strengths }
}

function scoreWtp(answers: Answers): { score: number; reasoning: string; flags: RedFlag[]; strengths: Strength[] } {
  const flags: RedFlag[] = []
  const strengths: Strength[] = []
  const base = selectScore(answers, 'q7_wtp')

  if (base <= 10) {
    flags.push({ questionId: 'q7_wtp', severity: 'critical', message: 'Personne ne paie pour résoudre ce problème aujourd\'hui. Red flag majeur — la douleur n\'est probablement pas monétisable.' })
  } else if (base >= 90) {
    strengths.push({ questionId: 'q7_wtp', message: 'Marché payant à bon prix déjà existant — la WTP est validée.' })
  }

  // Bonus si exemple précis fourni
  const example = str(answers.q7b_paid_example)
  let bonus = 0
  if (/\d+\s?(€|\$|eur|usd)/i.test(example)) {
    bonus = 10
    strengths.push({ questionId: 'q7b_paid_example', message: 'Référence prix concrète fournie — montre la connaissance du marché.' })
  }

  return { score: Math.max(0, Math.min(100, base + bonus)), reasoning: 'Existence d\'un marché payant + précision du benchmark prix', flags, strengths }
}

function scoreDistribution(answers: Answers): { score: number; reasoning: string; flags: RedFlag[]; strengths: Strength[] } {
  const flags: RedFlag[] = []
  const strengths: Strength[] = []
  const channels = str(answers.q9_channels)
  let s = 30

  // Heuristique : compter combien de canaux SPÉCIFIQUES (présence de noms propres / chiffres / domaines)
  const lines = channels.split(/\n|;|\d+\)/).filter((l) => l.trim().length > 10)
  const specificMarkers = (channels.match(/[A-Z][a-zA-Z]+|reddit|linkedin|newsletter|cold email|webinar|partenariat|seo|youtube|x\.com|twitter|discord|slack|forum|conférence|salon/gi) || []).length
  const vagueMarkers = (channels.match(/réseaux sociaux|facebook ads|google ads|content marketing|seo (en général)/gi) || []).length

  if (channels.length < 60) {
    flags.push({ questionId: 'q9_channels', severity: 'major', message: 'Réponse trop courte pour 3 canaux précis. Distribution = mort si vague.' })
    s -= 15
  } else if (lines.length >= 3 && specificMarkers >= 3) {
    s += 45
    strengths.push({ questionId: 'q9_channels', message: '3+ canaux spécifiques nommés — distribution pensée concrètement.' })
  } else if (lines.length >= 2) {
    s += 20
  }

  if (vagueMarkers > 0) {
    flags.push({ questionId: 'q9_channels', severity: 'major', message: "Canaux vagues détectés ('réseaux sociaux', 'content marketing'). Sois spécifique : quel sub-reddit, quelle newsletter, quel sous-groupe ?" })
    s -= 20
  }

  return { score: Math.max(0, Math.min(100, s)), reasoning: 'Spécificité + nombre de canaux gratuits identifiés', flags, strengths }
}

function scoreFeasibility(answers: Answers): { score: number; reasoning: string; flags: RedFlag[]; strengths: Strength[] } {
  const flags: RedFlag[] = []
  const strengths: Strength[] = []
  const base = selectScore(answers, 'q13_timeline')

  if (base <= 20) {
    flags.push({ questionId: 'q13_timeline', severity: 'critical', message: 'Plus de 3 mois pour une version testable = soit trop complexe, soit mauvaise estimation. Réduis le scope.' })
  } else if (base >= 85) {
    strengths.push({ questionId: 'q13_timeline', message: 'Version testable < 4 semaines — tu peux apprendre vite et itérer.' })
  }
  return { score: base, reasoning: 'Capacité à livrer une version testable rapidement', flags, strengths }
}

function scoreMarket(answers: Answers): { score: number; reasoning: string; flags: RedFlag[]; strengths: Strength[] } {
  const flags: RedFlag[] = []
  const strengths: Strength[] = []
  const persona = str(answers.q3_persona).toLowerCase()
  const competitors = str(answers.q10_competitors)

  let s = 55

  // Persona vague = marché flou
  if (hasVaguePersona(answers.q3_persona)) {
    s -= 20
  }

  // Absence totale de concurrent = soit niche, soit pas de marché
  if (len(competitors) < 20) {
    flags.push({ questionId: 'q10_competitors', severity: 'major', message: 'Aucun concurrent identifié. Souvent ça veut dire qu\'il n\'y a pas de marché (pas qu\'il y a une opportunité). Vérifie en parlant à 10 personnes.' })
    s -= 15
  } else {
    s += 10
    strengths.push({ questionId: 'q10_competitors', message: 'Concurrents identifiés = marché existant, validé.' })
  }

  // Bonus si persona mentionne une niche claire (chiffres employés, secteur précis...)
  if (/\d+\s*(employé|salarié|client|user)/i.test(persona) || /(b2b|b2c|saas|industrie|santé|finance|immobilier|éducation|retail)/i.test(persona)) {
    s += 15
  }

  return { score: Math.max(0, Math.min(100, s)), reasoning: 'Spécificité du segment + présence/absence de concurrents', flags, strengths }
}

function scoreFounderFit(answers: Answers): { score: number; reasoning: string; flags: RedFlag[]; strengths: Strength[] } {
  const flags: RedFlag[] = []
  const strengths: Strength[] = []
  const advantage = str(answers.q12_unfair_advantage)
  const intrinsic = selectScore(answers, 'q14_intrinsic')

  let s = 50

  // Avantage injuste
  if (len(advantage) < 30 || /pas vraiment|aucun|rien|je n['e].*pas/i.test(advantage)) {
    flags.push({ questionId: 'q12_unfair_advantage', severity: 'major', message: "Pas d'avantage injuste clair (expertise / réseau / connaissance sectorielle). Tu pars avec un handicap." })
    s -= 25
  } else if (len(advantage) > 60) {
    s += 25
    strengths.push({ questionId: 'q12_unfair_advantage', message: 'Avantage injuste articulé clairement.' })
  }

  // Motivation intrinsèque (Q14)
  if (intrinsic <= 10) {
    flags.push({ questionId: 'q14_intrinsic', severity: 'critical', message: 'Motivation extrinsèque dominante. Tu vas abandonner au 1er creux. Choisis une idée qui te survit même sans applaudissements.' })
    s = Math.min(s, 30)
  } else if (intrinsic >= 90) {
    s += 15
    strengths.push({ questionId: 'q14_intrinsic', message: 'Motivation intrinsèque forte — tu tiendras dans la traversée du désert.' })
  } else if (intrinsic <= 40) {
    flags.push({ questionId: 'q14_intrinsic', severity: 'major', message: "Motivation incertaine. À surveiller — risque d'abandon précoce." })
    s -= 10
  }

  return { score: Math.max(0, Math.min(100, s)), reasoning: 'Avantage injuste + motivation intrinsèque', flags, strengths }
}

// ── Early Kill : conditions bloquantes
function checkEarlyKill(answers: Answers): { reason: string; action: string } | null {
  const conv = selectScore(answers, 'q4_conversations')
  const wtp = selectScore(answers, 'q7_wtp')
  const channels = str(answers.q9_channels)
  const intrinsic = selectScore(answers, 'q14_intrinsic')
  const timeline = selectScore(answers, 'q13_timeline')
  const advantage = str(answers.q12_unfair_advantage)

  // Règle 1 : zéro conversation + personne ne paie
  if (conv === 0 && wtp <= 10) {
    return {
      reason: "Aucune conversation client ET personne ne paie pour résoudre ce problème aujourd'hui. C'est la combo la plus létale : tu n'as ni demande validée, ni preuve de monétisation.",
      action: "Parle à 10 personnes ayant ce problème AVANT de revenir ici. Si elles s'allument quand tu décris le problème = continue. Si elles haussent les épaules = passe à autre chose.",
    }
  }

  // Règle 2 : motivation intrinsèque NON
  if (intrinsic <= 10) {
    return {
      reason: "Tu construirais cette idée seulement si elle impressionne. C'est de la motivation extrinsèque. Tu abandonneras au 1er creux (et il y aura beaucoup de creux).",
      action: "Choisis une idée qui te survit même sans applaudissements. Demande-toi : 'Si je devais y passer 3 ans en silence sans personne pour me valider, est-ce que je tiendrais ?'",
    }
  }

  // Règle 3 : >3 mois + pas d'avantage injuste
  if (timeline <= 20 && (len(advantage) < 30 || /pas vraiment|aucun/i.test(advantage))) {
    return {
      reason: "+3 mois pour livrer une version testable, ET pas d'avantage injuste. Tu te bats à armes inférieures sur un cycle trop long pour itérer.",
      action: "Réduis brutalement le scope (cut list MasterXS). Si tu ne peux pas livrer en 4-6 semaines, soit l'idée est mauvaise, soit le scope est mauvais.",
    }
  }

  // Règle 4 : canaux complètement absents
  if (channels.length < 30) {
    return {
      reason: "Aucun canal de distribution précis identifié. Tu vas construire dans le vide.",
      action: "Identifie 3 endroits SPÉCIFIQUES où tes clients se rassemblent (sub-reddit nommé, newsletter nommée, groupe nommé). Sans ça, le build n'a pas de sens.",
    }
  }

  return null
}

function suggestPivots(answers: Answers, dimensionScores: DimensionScore[]): string[] {
  const pivots: string[] = []
  const byId = Object.fromEntries(dimensionScores.map((d) => [d.id, d.score]))

  if (byId.market < 50 && byId.pain > 60) {
    pivots.push("Garder la même douleur, mais cibler une niche plus étroite et plus spécifique (passer de 'PME' à 'PME industrielle multi-sites 50-200').")
  }
  if (byId.wtp < 50 && byId.pain > 60) {
    pivots.push("Vendre la solution à celui qui PAIE pour ce problème aujourd'hui (B2B), pas à celui qui le subit (B2C).")
  }
  if (byId.distribution < 50) {
    pivots.push("Inverser : choisir d'abord le canal (1 sub-reddit, 1 newsletter) puis identifier le problème le plus brûlant DE cette audience.")
  }
  if (byId.feasibility < 50) {
    pivots.push("Réduire le scope à un workflow unique. V1 = 1 utilisateur résout 1 problème en 1 clic. Le reste = roadmap.")
  }
  if (byId.founderFit < 50) {
    pivots.push("Trouver un co-founder ou advisor qui apporte l'avantage injuste manquant (réseau / expertise sectorielle).")
  }

  return pivots.slice(0, 3)
}

function nextActionsFor(verdict: Verdict, answers: Answers, flags: RedFlag[]): string[] {
  const actions: string[] = []
  switch (verdict) {
    case 'EXECUTE':
      actions.push("Lancer un sprint pre-sell 7 jours : 1 landing page + 1 vidéo Loom + cold outreach aux 30 personas les plus chaudes.")
      actions.push("Objectif chiffré : 5+ pre-orders payés OU 3 LOIs signées avant la moindre ligne de code.")
      actions.push("Si pre-sell réussi → build MVP 6 semaines avec scope figé MasterXS.")
      break
    case 'CONTINUE_CAUTION':
      actions.push("Identifier les 2-3 hypothèses critiques restantes et les tester en 1 semaine.")
      actions.push("Faire 5-10 interviews clients supplémentaires axées sur les zones grises.")
      actions.push("Revenir analyser après ces validations.")
      break
    case 'PIVOT':
      actions.push("Reformuler l'idée en gardant la douleur et en changeant l'angle ou la cible.")
      actions.push("Relancer une analyse complète sur la version pivotée.")
      break
    case 'KILL':
      actions.push("Lister ce que tu as appris dans 08-meta/lessons.md.")
      actions.push("Passer à l'idée suivante de ton hopper sans regret.")
      break
    case 'EARLY_KILL':
      actions.push("Voir l'action spécifique en haut du rapport.")
      break
  }
  return actions
}

// ── Public API
export function analyzeIdea(answers: Answers): IdeaReport {
  const earlyKill = checkEarlyKill(answers)

  const painR = scorePain(answers)
  const wtpR = scoreWtp(answers)
  const distR = scoreDistribution(answers)
  const feasR = scoreFeasibility(answers)
  const marketR = scoreMarket(answers)
  const fitR = scoreFounderFit(answers)

  const dimensionScores: DimensionScore[] = [
    { id: 'pain', score: painR.score, reasoning: painR.reasoning },
    { id: 'wtp', score: wtpR.score, reasoning: wtpR.reasoning },
    { id: 'distribution', score: distR.score, reasoning: distR.reasoning },
    { id: 'feasibility', score: feasR.score, reasoning: feasR.reasoning },
    { id: 'market', score: marketR.score, reasoning: marketR.reasoning },
    { id: 'founderFit', score: fitR.score, reasoning: fitR.reasoning },
  ]

  const weightById = Object.fromEntries(DIMENSIONS.map((d) => [d.id, d.weight]))
  const globalScore = Math.round(
    dimensionScores.reduce((sum, d) => sum + d.score * (weightById[d.id] ?? 0), 0)
  )

  const allFlags: RedFlag[] = [
    ...painR.flags,
    ...wtpR.flags,
    ...distR.flags,
    ...feasR.flags,
    ...marketR.flags,
    ...fitR.flags,
  ]
  const allStrengths: Strength[] = [
    ...painR.strengths,
    ...wtpR.strengths,
    ...distR.strengths,
    ...feasR.strengths,
    ...marketR.strengths,
    ...fitR.strengths,
  ]

  let verdict: Verdict
  if (earlyKill) {
    verdict = 'EARLY_KILL'
  } else if (globalScore >= 80) {
    verdict = 'EXECUTE'
  } else if (globalScore >= 65) {
    verdict = 'CONTINUE_CAUTION'
  } else if (globalScore >= 40) {
    verdict = 'PIVOT'
  } else {
    verdict = 'KILL'
  }

  // Critical-flag override : si 2+ critical flags, on n'autorise jamais EXECUTE
  const criticalCount = allFlags.filter((f) => f.severity === 'critical').length
  if (criticalCount >= 2 && verdict === 'EXECUTE') {
    verdict = 'CONTINUE_CAUTION'
  }
  if (criticalCount >= 2 && verdict === 'CONTINUE_CAUTION') {
    verdict = 'PIVOT'
  }

  const pivots = verdict === 'EXECUTE' ? [] : suggestPivots(answers, dimensionScores)
  const nextActions = nextActionsFor(verdict, answers, allFlags)

  const now = Date.now()
  const title = extractTitle(answers)
  const slug = slugify(title)

  return {
    id: `${dateStr(now)}-${slug}-${randomId()}`,
    createdAt: now,
    updatedAt: now,
    title,
    slug,
    answers,
    scores: dimensionScores,
    globalScore,
    verdict,
    redFlags: dedupeFlags(allFlags).slice(0, 5),
    strengths: allStrengths.slice(0, 5),
    pivots,
    nextActions,
    earlyKill: earlyKill ?? undefined,
  }
}

function dedupeFlags(flags: RedFlag[]): RedFlag[] {
  const seen = new Set<string>()
  const out: RedFlag[] = []
  // Sort by severity first
  const order: Record<RedFlag['severity'], number> = { critical: 0, major: 1, minor: 2 }
  const sorted = [...flags].sort((a, b) => order[a.severity] - order[b.severity])
  for (const f of sorted) {
    const key = `${f.questionId}|${f.message}`
    if (!seen.has(key)) {
      seen.add(key)
      out.push(f)
    }
  }
  return out
}

function extractTitle(answers: Answers): string {
  const pitch = str(answers.q1_pitch)
  if (!pitch) return 'Idée sans titre'
  // Take first sentence, max 80 chars
  const firstSentence = pitch.split(/[.!?\n]/)[0].trim()
  return firstSentence.length > 80 ? firstSentence.slice(0, 77) + '...' : firstSentence
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50) || 'idee'
}

function randomId(): string {
  return Math.random().toString(36).slice(2, 7)
}

function dateStr(ms: number): string {
  const d = new Date(ms)
  const yy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}
