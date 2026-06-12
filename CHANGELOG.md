# Changelog MasterXS

Toutes les modifications notables du playbook et de la structure MasterXS.

Format : [Semantic Versioning](https://semver.org/lang/fr/) (MAJOR.MINOR.PATCH).

- **MAJOR** : refonte d'architecture (ajout/suppression d'une couche L0-L7)
- **MINOR** : nouveau framework / SOP / module
- **PATCH** : correction, clarification, exemple ajouté

---

## [1.0.0] — 2026-05-11

### Added
- Playbook initial complet `MASTERXS-PLAYBOOK.md` (16 sections, ~1690 lignes)
- Structure de dossiers L0-L7 scaffoldée :
  - `00-os-personnel/` + `sops/`
  - `01-knowledge-base/` + `sources/{youtube,books,conversations,experiences}` + `insights/` + `patterns/` + `frameworks/`
  - `02-discovery/` + `interviews/`
  - `03-scoring/` + `evaluations/`
  - `04-build/` + `prompt-library/` + `sops/`
  - `05-gtm/`
  - `06-retention/`
  - `07-portfolio/` + `post-mortems/`
  - `08-meta/` + `retros/`
  - `_templates/`
- 7 templates remplis et utilisables :
  - `_templates/insight.md`
  - `_templates/framework.md`
  - `_templates/sop.md`
  - `_templates/idea-eval.md`
  - `_templates/post-mortem.md`
  - `_templates/interview-discovery.md`
  - `_templates/source-youtube.md`
- 60+ fichiers .md stubs avec en-tête initial dans tous les modules
- `README.md` du projet

### Sources intégrées
- 14+ sources web validées (voir Annexe A du playbook)
- 23 vidéos YouTube clusterisées en C1-C5 (voir Annexe B)

### Décisions figées
- Stack : Markdown + Git en primaire (jamais Notion en premier)
- Coût Phase 1 : 100% gratuit (free tier + open source), max $1/mois pour domaine
- Workflow IA : Continue.dev open-source en Phase 1, Cursor/Windsurf après PMF
- MVP : règle des 6 semaines (vs 30 jours précédent)

---

## Prochaines versions prévues

- **v1.1** — après Cluster C1 Mindset (4 vidéos Hormozi extraites)
- **v1.2** — après Cluster C2 PMF
- **v1.3** — après Cluster C3 Build IA
- **v1.4** — après Cluster C4 Sales
- **v1.5** — après Cluster C5 Scaling
- **v2.0** — après premier SaaS rentable lancé via le playbook
