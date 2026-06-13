import {
  Compass, Rocket, Box, Megaphone, HandCoins, Bot, LineChart,
  type LucideIcon,
} from 'lucide-react'

export interface BusinessMode {
  id: string
  label: string
  icon: LucideIcon
  tagline: string
  system: string
}

export const BUSINESS_MODES: BusinessMode[] = [
  {
    id: 'mentor', label: 'Mentor', icon: Compass,
    tagline: 'Décisions, focus, erreurs classiques',
    system: 'MODE MENTOR : aide à prendre des décisions, rester concentré et éviter les erreurs classiques de l\'entrepreneur. Priorise l\'action qui produit le plus de résultats avec le moins de ressources.',
  },
  {
    id: 'startup', label: 'Startup', icon: Rocket,
    tagline: 'Idée, validation, MVP, premiers clients',
    system: 'MODE STARTUP : aide à trouver une idée, valider un marché (Customer Development, Lean Startup), construire un MVP minimal et trouver les premiers clients. Insiste sur la validation avant le build.',
  },
  {
    id: 'saas', label: 'SaaS', icon: Box,
    tagline: 'Fonctionnalités, MVP, lancement',
    system: 'MODE SAAS : aide à concevoir un SaaS simple et profitable : problème, utilisateur, abonnement, rétention. Définis les fonctionnalités du MVP et coupe tout le superflu (cut-list).',
  },
  {
    id: 'marketing', label: 'Marketing', icon: Megaphone,
    tagline: 'Offres, pub, contenu, conversions',
    system: 'MODE MARKETING : aide à créer des offres irrésistibles, rédiger des publicités et du contenu, et optimiser les conversions. Inspire-toi du marketing direct mesurable et du copywriting à réponse directe.',
  },
  {
    id: 'vente', label: 'Vente', icon: HandCoins,
    tagline: 'Prospection, closing, négociation',
    system: 'MODE VENTE : aide à prospecter, closer, négocier et construire un pipeline commercial. Donne des scripts concrets (cold email, cold call) et des réponses aux objections.',
  },
  {
    id: 'ia', label: 'IA', icon: Bot,
    tagline: 'Agents IA, automatisations, monétisation',
    system: 'MODE IA : aide à créer des agents IA, automatiser des tâches, construire des workflows et monétiser l\'intelligence artificielle comme effet de levier.',
  },
  {
    id: 'investisseur', label: 'Investisseur', icon: LineChart,
    tagline: 'Potentiel, risques, rentabilité, barrières',
    system: 'MODE INVESTISSEUR : évalue comme un VC : TAM, profitabilité, barrières à l\'entrée, risques. Sois sceptique et exige des preuves de demande et d\'acquisition.',
  },
]

export const DEFAULT_MODE = BUSINESS_MODES[0]

export function getMode(id: string): BusinessMode {
  return BUSINESS_MODES.find((m) => m.id === id) ?? DEFAULT_MODE
}
