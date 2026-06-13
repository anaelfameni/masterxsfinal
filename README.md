# MasterXS — Project Manager Personnel Intelligent

MasterXS est un **cockpit d'exécution local-first** pour entrepreneur qui gère
plusieurs projets en parallèle. Il transforme un portefeuille chaotique en une
file d'exécution priorisée.

> Promesse : à tout instant, répondre en moins de 30 secondes à « quoi faire
> maintenant, pourquoi, et qu'est-ce que ça débloque ».

## L'application web (`web/`)

Stack : **Vite + React 18 + TypeScript + Tailwind**. Aucune base de données,
aucun backend : tout vit en **localStorage** sur ton appareil.

```bash
cd web
npm install
npm run dev      # http://localhost:5173
npm run build    # build de production
```

### Fonctionnalités

- **NOW** — briefing du matin : bloquants, prochaine action P1, projets à
  risque, victoires, métriques, graphiques (MRR, objectifs) et bouton
  **Analyse Chief of Staff**.
- **Projets** — portefeuille avec règles d'arbitrage (1 P1, 2 P2 max), santé
  auto (stagnation 7j), détail par projet (aperçu, tâches Liste + **Kanban**,
  décisions, journal, finances).
- **Tâches, Objectifs (OKR), Décisions (ADR), Idées, Journal, Notes, Réunions,
  Habitudes, Finances** — les 10 entités du PM.
- **BusinessGPT** — mentor IA (Groq) avec 7 modes : Mentor, Startup, SaaS,
  Marketing, Vente, IA, Investisseur.
- **Analyseur d'idées** — score une idée de business et la convertit en projet.
- **Thème clair / sombre** (sombre par défaut), **export / import JSON**.

### BusinessGPT (IA, gratuit)

BusinessGPT utilise l'API **Groq** (gratuite). Crée une clé sur
[console.groq.com](https://console.groq.com), puis colle-la dans **Réglages**.
La clé reste **uniquement** sur ton appareil. Sans clé, le Chief of Staff
fonctionne en mode hors ligne (analyse déterministe).

## Le playbook (Markdown)

La base de connaissance business reste disponible dans la section **Knowledge**
de l'app et dans les dossiers Markdown du dépôt.
