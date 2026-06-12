// 15 questions du wizard, structurées en 3 blocs A/B/C
// Philosophie : chaque question doit soit tuer l'idée, soit la renforcer.

import type { Question, Dimension, VerdictMeta } from './types'

export const QUESTIONS: Question[] = [
  // ── BLOC A — Contexte (6 questions, ~2 min)
  {
    id: 'q1_pitch',
    block: 'A',
    order: 1,
    label: "Décris ton idée en 2 phrases maximum.",
    helper: "Pas de jargon, pas de métaphore. Qui paie, pour quoi, combien.",
    type: 'longtext',
    placeholder: "Ex: Une app qui aide les RH de PME industrielles (50-200 employés) à automatiser le suivi des absences. 49€/mois.",
    required: true,
    minLength: 30,
  },
  {
    id: 'q2_problem',
    block: 'A',
    order: 2,
    label: "Quel problème spécifique ton SaaS résout ?",
    helper: "Pas 'il aide à', mais 'sans lui, les gens font X péniblement parce que Y'.",
    type: 'longtext',
    placeholder: "Sans cet outil, les RH passent 4h par semaine à compiler des tableaux Excel d'absences envoyés par email parce que leur SIRH ne gère pas le multi-sites.",
    required: true,
    minLength: 40,
  },
  {
    id: 'q3_persona',
    block: 'A',
    order: 3,
    label: "Décris une personne réelle qui a ce problème.",
    helper: "Son titre, son industrie, sa frustration du lundi matin. 'Les entrepreneurs' = red flag. 'Les RH de PME industrielles 50-200 employés' = signal positif.",
    type: 'longtext',
    placeholder: "Marie, 38 ans, DRH de Logistique Express (120 employés, 3 sites). Le lundi matin elle reçoit 12 emails d'arrêts maladie qu'elle doit consolider pour la paie.",
    required: true,
    minLength: 30,
  },
  {
    id: 'q4_conversations',
    block: 'A',
    order: 4,
    label: "Combien de personnes ayant ce problème as-tu interviewées ?",
    helper: "C'est le signal d'alarme #1. Zéro conversation = score 0 sur cette dimension.",
    type: 'select',
    required: true,
    options: [
      { value: '0', label: "Aucune. Je n'ai parlé à personne", score: 0 },
      { value: '1-3', label: '1 à 3 personnes', score: 30 },
      { value: '5-10', label: '5 à 10 personnes', score: 70 },
      { value: '10+', label: '+10 personnes avec notes détaillées', score: 95 },
    ],
  },
  {
    id: 'q5_existing_solution',
    block: 'A',
    order: 5,
    label: "Comment les gens résolvent ce problème aujourd'hui (sans ton SaaS) ?",
    helper: "Rien / Excel / manuel = bon signe (douleur réelle non résolue). Ils utilisent déjà X bien = il faut être 10x meilleur.",
    type: 'longtext',
    placeholder: "Ils utilisent Excel partagé + WhatsApp groupe. 60% de rework chaque mois sur la paie.",
    required: true,
    minLength: 20,
  },
  {
    id: 'q6_why_now',
    block: 'A',
    order: 6,
    label: "Pourquoi ce problème n'a pas été résolu de manière satisfaisante jusqu'ici ?",
    helper: "Détecte les réponses naïves vs les vraies opportunités de timing (réglementation, IA accessible, prix qui s'effondre...).",
    type: 'longtext',
    placeholder: "Les SIRH sont conçus pour les grands groupes (5K+ employés). Les PME 50-200 sont trop petites pour les SIRH et trop grandes pour Excel.",
    required: true,
    minLength: 30,
  },

  // ── BLOC B — Marché et argent (6 questions, ~3 min)
  {
    id: 'q7_wtp',
    block: 'B',
    order: 1,
    label: "Des gens paient-ils déjà pour résoudre ce problème (directement ou avec un outil adjacent) ?",
    helper: "Oui + exemple précis = fort signal. Non = red flag majeur.",
    type: 'select',
    required: true,
    options: [
      { value: 'no', label: "Non, personne ne paie pour ça", score: 10 },
      { value: 'adjacent', label: "Ils paient pour un outil adjacent (cite-le)", score: 55 },
      { value: 'direct_cheap', label: "Oui, mais à prix bas (<20€/mois)", score: 65 },
      { value: 'direct_premium', label: "Oui, et à bon prix (>50€/mois)", score: 90 },
    ],
  },
  {
    id: 'q7b_paid_example',
    block: 'B',
    order: 2,
    label: "Cite un outil concurrent (ou adjacent) et son prix mensuel.",
    helper: "Ex: 'PayFit, 39€/employé/mois' ou 'Excel + temps perdu = 200€/mois équivalent'.",
    type: 'text',
    placeholder: "ConcurrentX, 49€/mois/utilisateur",
    required: false,
  },
  {
    id: 'q8_price',
    block: 'B',
    order: 3,
    label: "Quel prix mensuel envisages-tu pour ton SaaS ?",
    helper: "Sois précis. Base : par siège, par usage, ou flat ?",
    type: 'longtext',
    placeholder: "39€/mois flat pour <50 employés, puis 0.50€/employé au-delà.",
    required: true,
    minLength: 10,
  },
  {
    id: 'q9_channels',
    block: 'B',
    order: 4,
    label: "Nomme 3 canaux PRÉCIS pour atteindre tes 100 premiers clients.",
    helper: "Pas 'réseaux sociaux'. Des endroits spécifiques. Ex : 'Sous-reddit r/humanresources', 'Newsletter HR Paris', 'Cold email DRH PME industrielle scrapés sur LinkedIn Sales Navigator'.",
    type: 'longtext',
    placeholder: "1) Cold email 200 DRH PME industrielles via Sales Navigator\n2) Annonce dans le groupe Facebook 'RH France PME' (12K membres)\n3) Webinar mensuel sur la digitalisation RH avec un partenaire expert-comptable",
    required: true,
    minLength: 60,
  },
  {
    id: 'q10_competitors',
    block: 'B',
    order: 5,
    label: "Cite 2 concurrents directs.",
    helper: "Si tu n'en trouves pas, c'est soit une opportunité, soit il n'y a pas de marché. Sois honnête.",
    type: 'longtext',
    placeholder: "1) PayFit (cible plus haut)\n2) Lucca (cible plus haut)\nGap : SaaS RH simple pour PME 50-200 industrielles multi-sites.",
    required: true,
    minLength: 20,
  },
  {
    id: 'q11_differentiation',
    block: 'B',
    order: 6,
    label: "Pourquoi un client choisirait ton outil et pas les concurrents cités ?",
    helper: "En une phrase. 'Parce que c'est moins cher' = mauvaise réponse.",
    type: 'longtext',
    placeholder: "Parce qu'on est le seul à gérer le multi-sites avec un import paie compatible Silae / EBP, sans setup de plus de 24h.",
    required: true,
    minLength: 30,
  },

  // ── BLOC C — Toi en tant que fondateur (3 questions, ~1 min)
  {
    id: 'q12_unfair_advantage',
    block: 'C',
    order: 1,
    label: "Pourquoi TU es la bonne personne pour construire ce SaaS ?",
    helper: "Connaissance sectorielle ? Réseau ? Expertise technique ? Si 'je n'en ai pas vraiment' = flag sérieux.",
    type: 'longtext',
    placeholder: "J'ai été 5 ans DRH dans une PME industrielle. Je connais 30+ DRH du secteur. Je sais exactement comment ils achètent et combien ils sont prêts à payer.",
    required: true,
    minLength: 30,
  },
  {
    id: 'q13_timeline',
    block: 'C',
    order: 2,
    label: "En combien de temps peux-tu avoir une version TESTABLE (pas finale) ?",
    helper: "> 3 mois = soit trop complexe, soit mauvaise estimation.",
    type: 'select',
    required: true,
    options: [
      { value: '<2w', label: 'Moins de 2 semaines', score: 95 },
      { value: '2-4w', label: '2 à 4 semaines', score: 85 },
      { value: '1-3m', label: '1 à 3 mois', score: 60 },
      { value: '3m+', label: 'Plus de 3 mois', score: 20 },
    ],
  },
  {
    id: 'q14_intrinsic',
    block: 'C',
    order: 3,
    label: "Si tu savais que personne ne serait impressionné par cette idée, tu la construirais quand même ?",
    helper: "Test de motivation intrinsèque. Non ou incertain = red flag majeur.",
    type: 'select',
    required: true,
    options: [
      { value: 'yes', label: 'Oui, sans hésiter', score: 95 },
      { value: 'unsure', label: 'Pas sûr, ça dépend des résultats', score: 40 },
      { value: 'no', label: 'Non, je veux la validation externe', score: 10 },
    ],
  },
]

export const QUESTIONS_BY_BLOCK = {
  A: QUESTIONS.filter((q) => q.block === 'A'),
  B: QUESTIONS.filter((q) => q.block === 'B'),
  C: QUESTIONS.filter((q) => q.block === 'C'),
}

export const BLOCK_META: Record<'A' | 'B' | 'C', { title: string; subtitle: string; tone: 'info' | 'warning' | 'danger'; estimatedMin: number }> = {
  A: {
    title: 'Contexte de base',
    subtitle: "On commence par cadrer l'idée. Sois précis, pas évasif.",
    tone: 'info',
    estimatedMin: 2,
  },
  B: {
    title: 'Validation marché & argent',
    subtitle: "Le moment de vérité. Le marché et le cash décident, pas l'enthousiasme.",
    tone: 'warning',
    estimatedMin: 3,
  },
  C: {
    title: 'Toi en tant que fondateur',
    subtitle: "Court mais brutal. Founder-market fit ou pas.",
    tone: 'danger',
    estimatedMin: 1,
  },
}

// ── Dimensions de scoring (poids alignés à la philosophie MasterXS : distribution + cash > tout)
export const DIMENSIONS: Dimension[] = [
  {
    id: 'pain',
    label: 'Douleur client',
    shortLabel: 'Douleur',
    weight: 0.25,
    description: "Urgence + intensité du problème. Spécificité de la persona.",
  },
  {
    id: 'wtp',
    label: 'Willingness to pay',
    shortLabel: 'Argent',
    weight: 0.20,
    description: "Les gens paient déjà pour résoudre ça ? À quel prix ?",
  },
  {
    id: 'distribution',
    label: 'Distribution',
    shortLabel: 'Canaux',
    weight: 0.20,
    description: "Peux-tu atteindre tes clients SANS budget pub ?",
  },
  {
    id: 'feasibility',
    label: 'Faisabilité technique',
    shortLabel: 'Build',
    weight: 0.15,
    description: "Toi + solo + 90 jours. Pas plus.",
  },
  {
    id: 'market',
    label: 'Taille de marché',
    shortLabel: 'Marché',
    weight: 0.10,
    description: "Marché accessible, pas TAM bullshit. 1000+ entreprises atteignables.",
  },
  {
    id: 'founderFit',
    label: 'Founder-Market Fit',
    shortLabel: 'Founder',
    weight: 0.10,
    description: "Pourquoi toi ? Avantage injuste + motivation intrinsèque.",
  },
]

export const DIMENSIONS_BY_ID = Object.fromEntries(DIMENSIONS.map((d) => [d.id, d])) as Record<
  string,
  Dimension
>

// ── Verdicts metadata
export const VERDICT_META: Record<string, VerdictMeta> = {
  EXECUTE: {
    id: 'EXECUTE',
    label: 'EXÉCUTER',
    short: 'Go',
    description: 'Idée solide. Lance le pre-sell sprint dès cette semaine.',
    color: 'success',
  },
  CONTINUE_CAUTION: {
    id: 'CONTINUE_CAUTION',
    label: 'CONTINUER AVEC PRUDENCE',
    short: 'Iterate',
    description: 'Bonne base mais 2-3 hypothèses critiques à valider avant build.',
    color: 'warning',
  },
  PIVOT: {
    id: 'PIVOT',
    label: 'PIVOTER',
    short: 'Pivot',
    description: 'Le cœur a du potentiel mais l\'angle actuel ne tient pas. Reformule.',
    color: 'warning',
  },
  KILL: {
    id: 'KILL',
    label: 'ARRÊTER',
    short: 'Kill',
    description: "Trop de red flags. Passe à l'idée suivante sans regret.",
    color: 'danger',
  },
  EARLY_KILL: {
    id: 'EARLY_KILL',
    label: 'EARLY KILL',
    short: 'Stop',
    description: "Signal bloquant détecté. Validation manquante avant d'aller plus loin.",
    color: 'danger',
  },
}
