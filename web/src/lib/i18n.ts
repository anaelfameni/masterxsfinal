// Libellés centralisés (FR). Point unique pour une future traduction.

export const t = {
  app: { name: 'MasterXS', tagline: 'Project Manager Personnel Intelligent' },
  nav: {
    now: 'NOW', projects: 'Projets', tasks: 'Tâches', objectives: 'Objectifs',
    ideas: 'Idées', businessgpt: 'BusinessGPT', journal: 'Journal', notes: 'Notes',
    meetings: 'Réunions', habits: 'Habitudes', finances: 'Finances',
    decisions: 'Décisions', knowledge: 'Knowledge', settings: 'Réglages',
  },
  priority: { P1: 'P1 · Focus', P2: 'P2 · Maintenance', P3: 'P3 · Veille' },
  status: {
    idea: 'Idée', validating: 'Validation', active: 'Actif',
    paused: 'En pause', killed: 'Abandonné',
  },
  health: { green: 'Sain', yellow: 'À surveiller', red: 'En danger' },
  taskStatus: { todo: 'À faire', doing: 'En cours', done: 'Terminé' },
  taskPriority: { high: 'Haute', normal: 'Normale', low: 'Basse' },
  common: {
    save: 'Enregistrer', cancel: 'Annuler', delete: 'Supprimer', edit: 'Modifier',
    add: 'Ajouter', create: 'Créer', empty: 'Rien ici pour le moment.',
  },
} as const
