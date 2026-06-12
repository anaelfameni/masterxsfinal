// Métadonnées des modules L0-L7 + sections du playbook + roadmap
// Source de vérité pour la navigation du site

import {
  Compass,
  Brain,
  Search,
  Target,
  Wrench,
  Megaphone,
  Repeat,
  Briefcase,
  Settings,
  FileCode,
  type LucideIcon,
} from 'lucide-react'

export interface ModuleMeta {
  slug: string
  layer: string
  title: string
  shortTitle: string
  description: string
  purpose: string
  icon: LucideIcon
  color: string
  order: number
}

export const modules: ModuleMeta[] = [
  {
    slug: '00-os-personnel',
    layer: 'L0',
    title: 'OS Personnel',
    shortTitle: 'OS Personnel',
    description: 'Système d\'exploitation personnel — identité, cadence, frameworks de décision.',
    purpose: 'La fondation. Sans toi codifié, le reste tangue.',
    icon: Compass,
    color: 'from-violet-500 to-purple-700',
    order: 0,
  },
  {
    slug: '01-knowledge-base',
    layer: 'L1',
    title: 'Knowledge Base',
    shortTitle: 'Knowledge',
    description: 'Zettelkasten — sources, insights atomiques, patterns, frameworks.',
    purpose: 'Le second brain qui compound dans le temps.',
    icon: Brain,
    color: 'from-fuchsia-500 to-violet-700',
    order: 1,
  },
  {
    slug: '02-discovery',
    layer: 'L2',
    title: 'Discovery',
    shortTitle: 'Discovery',
    description: 'Sources d\'idées, signal detection, idea hopper, niche formula.',
    purpose: 'Trouver les bonnes idées, pas plus d\'idées.',
    icon: Search,
    color: 'from-purple-500 to-fuchsia-700',
    order: 2,
  },
  {
    slug: '03-scoring',
    layer: 'L3',
    title: 'Validation & Scoring',
    shortTitle: 'Scoring',
    description: 'Gates → rubric 12 dims → pre-sell recipe. Le tri impitoyable.',
    purpose: 'Kill 90% des idées avant d\'écrire la 1ère ligne de code.',
    icon: Target,
    color: 'from-violet-600 to-purple-800',
    order: 3,
  },
  {
    slug: '04-build',
    layer: 'L4',
    title: 'Build',
    shortTitle: 'Build',
    description: 'Stack canonique, Windsurf workflow, cut list, 6-week MVP.',
    purpose: 'Construire en 6 semaines, jamais 6 mois.',
    icon: Wrench,
    color: 'from-purple-600 to-violet-800',
    order: 4,
  },
  {
    slug: '05-gtm',
    layer: 'L5',
    title: 'Go-To-Market',
    shortTitle: 'GTM',
    description: 'Channel decision, cold outreach, SEO, build in public.',
    purpose: '1 canal perfectionné avant 2.',
    icon: Megaphone,
    color: 'from-violet-500 to-purple-600',
    order: 5,
  },
  {
    slug: '06-retention',
    layer: 'L6',
    title: 'Retention & Ops',
    shortTitle: 'Retention',
    description: 'Founder-led sales, onboarding, churn protocol, hiring rules.',
    purpose: 'Faire rester ceux qui sont entrés.',
    icon: Repeat,
    color: 'from-fuchsia-600 to-purple-700',
    order: 6,
  },
  {
    slug: '07-portfolio',
    layer: 'L7',
    title: 'Portfolio',
    shortTitle: 'Portfolio',
    description: 'Active projects, kill log, post-mortems, capital allocation.',
    purpose: 'Voir l\'ensemble de tes paris.',
    icon: Briefcase,
    color: 'from-violet-700 to-fuchsia-800',
    order: 7,
  },
  {
    slug: '08-meta',
    layer: 'L∞',
    title: 'Meta',
    shortTitle: 'Meta',
    description: 'Playbook roadmap, improvement log, vision 3 ans, MasterXS produit.',
    purpose: 'Le playbook qui pense sur lui-même.',
    icon: Settings,
    color: 'from-purple-700 to-violet-900',
    order: 8,
  },
  {
    slug: '_templates',
    layer: 'TPL',
    title: 'Templates',
    shortTitle: 'Templates',
    description: '7 templates prêts à l\'emploi — insight, framework, SOP, idea-eval, etc.',
    purpose: 'Jamais réinventer un format. Copier, remplir, avancer.',
    icon: FileCode,
    color: 'from-violet-400 to-purple-600',
    order: 9,
  },
]

export const modulesBySlug: Record<string, ModuleMeta> = Object.fromEntries(
  modules.map((m) => [m.slug, m])
)

export interface PlaybookSection {
  id: string
  number: string
  title: string
  shortTitle: string
}

export const playbookSections: PlaybookSection[] = [
  { id: '0-vision', number: '0', title: 'Vision MasterXS — du playbook au mentor IA', shortTitle: 'Vision' },
  { id: '1-pourquoi-playbook', number: '1', title: 'Pourquoi un playbook — ton vrai actif compounding', shortTitle: 'Pourquoi' },
  { id: '2-architecture', number: '2', title: 'Architecture en 8 couches (L0-L7)', shortTitle: 'Architecture' },
  { id: '3-stack-gratuit', number: '3', title: 'Stack 100% gratuit', shortTitle: 'Stack' },
  { id: '4-extraction', number: '4', title: 'Système d\'extraction des 23 vidéos', shortTitle: 'Extraction' },
  { id: '5-discovery', number: '5', title: 'Discovery — sources d\'idées SaaS IA', shortTitle: 'Discovery' },
  { id: '6-validation', number: '6', title: 'Validation & Scoring', shortTitle: 'Scoring' },
  { id: '7-build-mvp', number: '7', title: 'Build MVP — règle des 6 semaines', shortTitle: 'Build' },
  { id: '8-distribution', number: '8', title: 'Distribution-first GTM', shortTitle: 'GTM' },
  { id: '9-retention-ops', number: '9', title: 'Retention, Ops & Scale', shortTitle: 'Ops' },
  { id: '10-os-personnel', number: '10', title: 'OS personnel & cadence', shortTitle: 'OS perso' },
  { id: '11-roadmap-6-semaines', number: '11', title: 'Roadmap 6 semaines', shortTitle: 'Roadmap 6sem' },
  { id: '12-roadmap-arr', number: '12', title: 'Roadmap Phase 0 → 5 ($1M ARR)', shortTitle: 'Phase 0→5' },
  { id: '13-anti-patterns', number: '13', title: 'Anti-patterns critiques', shortTitle: 'Anti-patterns' },
  { id: '14-vision-produit', number: '14', title: 'Vision MasterXS comme produit', shortTitle: 'Produit' },
  { id: '15-commandements', number: '15', title: 'Les 20 commandements', shortTitle: 'Commandements' },
  { id: '16-annexes', number: '16', title: 'Annexes', shortTitle: 'Annexes' },
]

export interface RoadmapWeek {
  week: number
  cluster: string
  title: string
  videosCount: number
  deliverables: string[]
}

export const roadmap6Weeks: RoadmapWeek[] = [
  {
    week: 1,
    cluster: 'S1',
    title: 'Skeleton + OS personnel',
    videosCount: 0,
    deliverables: [
      'Structure dossiers L0-L7',
      '7 templates utilisables',
      'Module 0 — identity, cadence, decision-frameworks',
      'Stack canonique figée',
    ],
  },
  {
    week: 2,
    cluster: 'C1',
    title: 'Cluster Mindset (Hormozi)',
    videosCount: 4,
    deliverables: [
      'Extraction des 4 vidéos Hormozi',
      '8-15 insights atomiques',
      '2-3 frameworks émergents',
      'Module 1 (knowledge base) opérationnel',
    ],
  },
  {
    week: 3,
    cluster: 'C2',
    title: 'Cluster PMF & Validation',
    videosCount: 3,
    deliverables: [
      'Extraction 3 vidéos PMF',
      'Module 2 Discovery v1',
      'Module 3 Scoring v1',
      'Test critique : score 5 idées (goal 4 killed)',
    ],
  },
  {
    week: 4,
    cluster: 'C3',
    title: 'Cluster Build IA',
    videosCount: 6,
    deliverables: [
      'Extraction 6 vidéos Build IA',
      'Module 4 Build v1',
      'Prompt library initial (5 prompts)',
      'Boilerplate setup',
    ],
  },
  {
    week: 5,
    cluster: 'C4',
    title: 'Cluster Sales & Acquisition',
    videosCount: 6,
    deliverables: [
      'Extraction 6 vidéos Sales',
      'Module 5 GTM v1',
      'Canal primaire choisi et figé',
      'Cold outreach playbook',
    ],
  },
  {
    week: 6,
    cluster: 'C5',
    title: 'Scaling + premier vrai test',
    videosCount: 3,
    deliverables: [
      'Extraction 3 vidéos Scaling',
      'Module 6 + 7 v1',
      'Idée score 85+ → niveau 3 pre-sell',
      'Goal honnête : 3+ pre-orders ou kill',
    ],
  },
]

export interface PhaseStep {
  phase: string
  title: string
  duration: string
  goal: string
  decisionGate: string
}

export const arrRoadmap: PhaseStep[] = [
  {
    phase: 'Phase 0',
    title: 'Idée & Validation',
    duration: 'S0-S6',
    goal: 'Prouver que quelqu\'un paiera AVANT d\'écrire du code production',
    decisionGate: '5+ paid pre-orders ou 3+ LOIs signées',
  },
  {
    phase: 'Phase 1',
    title: 'MVP',
    duration: 'S7-S14',
    goal: 'Ship v1 que la pre-order list paie',
    decisionGate: '5-15 paying customers, activation >30%, churn <10%/mo',
  },
  {
    phase: 'Phase 2',
    title: 'Founder-Led Sales',
    duration: 'M4-M9',
    goal: '$5K-$10K MRR. Trouver product-channel fit',
    decisionGate: '$5K MRR + sub-5% churn = product-channel fit',
  },
  {
    phase: 'Phase 3',
    title: 'Repeatable Acquisition',
    duration: 'M9-M18',
    goal: '$10K → $30K MRR. Industrialiser le canal',
    decisionGate: '$30K MRR + sub-3% churn + CAC payback <6mo',
  },
  {
    phase: 'Phase 4',
    title: 'Scale or Coast',
    duration: 'M18-M36',
    goal: '$30K → $100K MRR',
    decisionGate: '$1M ARR avec retention saine → choose endgame',
  },
  {
    phase: 'Phase 5',
    title: 'Endgame',
    duration: 'Y3+',
    goal: 'Solo lean / Build a team / Sell — 3 paths valides',
    decisionGate: 'Aucun n\'est un échec. Le seul échec = ne pas décider',
  },
]

export interface Commandment {
  id: number
  text: string
}

export const commandments: Commandment[] = [
  { id: 1, text: 'Distribution > produit.' },
  { id: 2, text: 'Validate before you build.' },
  { id: 3, text: 'Six-week MVP, not six-month.' },
  { id: 4, text: 'Boring tech, opinionated product.' },
  { id: 5, text: 'One channel, perfected, before two.' },
  { id: 6, text: 'Tier pricing, raise prices yearly, push annual.' },
  { id: 7, text: 'First 10 customers manual, no exceptions.' },
  { id: 8, text: 'Customer conversations forever.' },
  { id: 9, text: 'Say no 5x more than yes.' },
  { id: 10, text: 'Ship something visible every week.' },
  { id: 11, text: 'Use AI as default, not as novelty.' },
  { id: 12, text: 'Batch by hat, not by topic.' },
  { id: 13, text: 'Friday review, monthly metrics, quarterly retrospectives.' },
  { id: 14, text: 'Sleep + exercise + community + therapy.' },
  { id: 15, text: 'Don\'t mix burnout with strategy.' },
  { id: 16, text: 'Don\'t hire too early, prefer contractors.' },
  { id: 17, text: 'Don\'t raise unless you can articulate why.' },
  { id: 18, text: 'Don\'t sell out of boredom.' },
  { id: 19, text: 'Don\'t compare to funded teams.' },
  { id: 20, text: 'Don\'t substitute motion for progress.' },
]

export interface ScoringDimension {
  id: number
  name: string
  weight: number
  description: string
}

export const scoringRubric: ScoringDimension[] = [
  { id: 1, name: 'Douleur monétisable', weight: 3, description: 'Problème fréquent + douloureux + déjà payé ailleurs' },
  { id: 2, name: 'Faisabilité MVP solo IA <6 sem', weight: 3, description: 'Buildable seul avec IA en 6 semaines max' },
  { id: 3, name: 'Bootstrap-compatible', weight: 3, description: '$5K MRR atteignable en 6 mois' },
  { id: 4, name: 'Acquisition réaliste pour MOI', weight: 3, description: 'Canal accessible avec mes skills actuels' },
  { id: 5, name: 'Pricing & LTV', weight: 2, description: '>30€/mo B2B ou >50€ AOV' },
  { id: 6, name: 'Différenciation IA durable', weight: 2, description: 'Moat au-delà du wrapper ChatGPT' },
  { id: 7, name: 'Vitesse validation', weight: 2, description: 'LOI ou pre-order possible <14j' },
  { id: 8, name: 'Concurrence', weight: 2, description: 'Fragmenté > saturé > monopole' },
  { id: 9, name: 'Compatibilité mes skills', weight: 2, description: 'Match avec identity.md' },
  { id: 10, name: 'Potentiel long terme', weight: 1, description: 'Vision 3 ans soutenable' },
  { id: 11, name: 'Risque plateforme', weight: 1, description: 'Pas dépendant d\'une seule API' },
  { id: 12, name: 'Coût d\'opération', weight: 1, description: 'Marges >70% à scale' },
]

export function computeMaxScore(): number {
  return scoringRubric.reduce((sum, d) => sum + d.weight * 5, 0)
}

export function getScoreVerdict(score: number): {
  verdict: 'kill' | 'hopper' | 'validate' | 'pre-sell' | 'commit'
  label: string
  description: string
  color: string
} {
  if (score < 50) return { verdict: 'kill', label: 'KILL', description: 'Tue cette idée. Ne reviens pas dessus.', color: 'text-danger' }
  if (score < 70) return { verdict: 'hopper', label: 'HOPPER', description: 'Archive dans idea-hopper. Pas prioritaire.', color: 'text-warning' }
  if (score < 85) return { verdict: 'validate', label: 'VALIDATE', description: '5h de discovery + scoring approfondi.', color: 'text-info' }
  if (score < 100) return { verdict: 'pre-sell', label: 'PRE-SELL', description: 'Pre-sell 14j : landing + 50 outreach. Go ou kill.', color: 'text-accent-400' }
  return { verdict: 'commit', label: 'COMMIT 90J', description: 'Excellent. Engage 90 jours sur cette idée.', color: 'text-success' }
}
