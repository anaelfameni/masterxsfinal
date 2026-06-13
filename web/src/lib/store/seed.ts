// Jeu de données d'exemple (français), supprimable en 1 clic depuis les Réglages.

import { emptyData, type MasterXSData } from './types'

const now = Date.now()
const day = 86_400_000

function iso(offsetDays: number): string {
  return new Date(now + offsetDays * day).toISOString().slice(0, 10)
}
function month(offset: number): string {
  const d = new Date(now)
  d.setMonth(d.getMonth() + offset)
  return d.toISOString().slice(0, 7)
}

export function seedData(): MasterXSData {
  const data = emptyData()

  const p1 = 'seed-proj-1'
  const p2 = 'seed-proj-2'
  const p3 = 'seed-proj-3'

  data.projects = [
    {
      id: p1,
      name: 'SaaS Facturation',
      description: 'Outil de facturation simple pour freelances francophones.',
      priority: 'P1',
      status: 'active',
      health: 'green',
      nextAction: 'Envoyer 20 messages de prospection à froid',
      blockedBy: null,
      deadline: iso(20),
      mrr: 850,
      goalId: 'seed-goal-1',
      color: '#a855f7',
      createdAt: now - 40 * day,
      updatedAt: now - 1 * day,
      lastActivityAt: now - 1 * day,
    },
    {
      id: p2,
      name: 'Agence Créa',
      description: 'Agence de production de contenu pour PME.',
      priority: 'P2',
      status: 'active',
      health: 'yellow',
      nextAction: 'Relancer le prospect Dupont',
      blockedBy: null,
      deadline: null,
      mrr: 1200,
      goalId: null,
      color: '#22c55e',
      createdAt: now - 90 * day,
      updatedAt: now - 9 * day,
      lastActivityAt: now - 9 * day,
    },
    {
      id: p3,
      name: 'Formation IA',
      description: 'Programme en ligne sur l\'automatisation par l\'IA.',
      priority: 'P3',
      status: 'validating',
      health: 'green',
      nextAction: 'Créer la landing page de pré-vente',
      blockedBy: null,
      deadline: null,
      mrr: 0,
      goalId: null,
      color: '#3b82f6',
      createdAt: now - 15 * day,
      updatedAt: now - 2 * day,
      lastActivityAt: now - 2 * day,
    },
  ]

  data.tasks = [
    {
      id: 'seed-task-1', projectId: p1, title: 'Envoyer 20 messages de prospection', status: 'doing',
      priority: 'high', tags: ['acquisition'], subtasks: [
        { id: 'st-1', title: 'Lister 20 prospects', done: true },
        { id: 'st-2', title: 'Rédiger le script', done: true },
        { id: 'st-3', title: 'Envoyer', done: false },
      ], deadline: iso(1), createdAt: now - 3 * day, updatedAt: now - 1 * day, order: 0,
    },
    {
      id: 'seed-task-2', projectId: p1, title: 'Intégrer Stripe Checkout', status: 'todo',
      priority: 'normal', tags: ['build'], subtasks: [], deadline: iso(7),
      createdAt: now - 2 * day, updatedAt: now - 2 * day, order: 1,
    },
    {
      id: 'seed-task-3', projectId: p1, title: 'Page de tarifs', status: 'done',
      priority: 'normal', tags: ['build'], subtasks: [], deadline: null,
      createdAt: now - 6 * day, updatedAt: now - 2 * day, order: 2,
    },
    {
      id: 'seed-task-4', projectId: p2, title: 'Relancer le prospect Dupont', status: 'todo',
      priority: 'high', tags: ['vente'], subtasks: [], deadline: iso(2),
      createdAt: now - 4 * day, updatedAt: now - 4 * day, order: 0,
    },
  ]

  data.objectives = [
    {
      id: 'seed-goal-1', title: 'Atteindre 3K€ de MRR', description: 'Objectif trimestriel principal.',
      period: 'Q3', projectId: p1, keyResults: [
        { id: 'kr-1', label: 'MRR SaaS Facturation', target: 3000, current: 850, unit: '€' },
        { id: 'kr-2', label: 'Clients payants', target: 30, current: 9 },
      ], createdAt: now - 30 * day, updatedAt: now - 1 * day,
    },
  ]

  data.decisions = [
    {
      id: 'seed-dec-1', title: 'Adopter MasterXS comme cockpit unique', projectId: null,
      context: 'Les projets étaient éparpillés entre plusieurs outils.',
      options: 'Notion / Linear / un système sur-mesure local-first.',
      decision: 'Construire MasterXS, léger et personnalisé.',
      consequences: 'Tout passe par MasterXS ; revue chaque vendredi.',
      status: 'accepted', createdAt: now - 20 * day, updatedAt: now - 20 * day,
    },
  ]

  data.ideas = [
    {
      id: 'seed-idea-1', title: 'Assistant IA pour artisans', pitch: 'Devis et factures générés par IA.',
      category: 'SaaS', stage: 'raw', createdAt: now - 5 * day, updatedAt: now - 5 * day,
    },
  ]

  data.journal = [
    {
      id: 'seed-j-1', date: iso(0), content: 'Focus sur la prospection. 12 messages envoyés, 2 réponses positives.',
      mood: 4, createdAt: now, updatedAt: now,
    },
  ]

  data.habits = [
    {
      id: 'seed-habit-1', name: 'Deep work 2h', emoji: '🎯',
      log: [iso(-1), iso(-2), iso(0)], createdAt: now - 10 * day, updatedAt: now,
    },
    {
      id: 'seed-habit-2', name: 'Prospection quotidienne', emoji: '📩',
      log: [iso(0), iso(-1)], createdAt: now - 10 * day, updatedAt: now,
    },
  ]

  data.finances = [
    { id: 'f-1', projectId: p1, month: month(-2), mrr: 400, expenses: 20, createdAt: now, updatedAt: now },
    { id: 'f-2', projectId: p1, month: month(-1), mrr: 720, expenses: 20, createdAt: now, updatedAt: now },
    { id: 'f-3', projectId: p1, month: month(0), mrr: 850, expenses: 25, createdAt: now, updatedAt: now },
    { id: 'f-4', projectId: p2, month: month(0), mrr: 1200, expenses: 300, createdAt: now, updatedAt: now },
  ]

  return data
}
