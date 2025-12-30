# Suivi du projet - Skill Issue

## État actuel

**Phase** : MVP fonctionnel - En cours d'amélioration

## Phases d'implémentation

### Phase 1 : Setup projet ✅
- [x] Créer projet Next.js 14 avec App Router
- [x] Configurer Tailwind CSS
- [x] Migrer agents depuis geek-lol
- [x] Migrer articles validés
- [x] Setup .env.local.example
- [x] Mettre à jour README
- [x] Créer documentation (CLAUDE.md, ARCHITECTURE.md)

### Phase 2 : Auth & Base (Partiel)
- [ ] Créer projet Supabase
- [ ] Configurer tables (voir [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md))
- [ ] Migrer pending.json → Supabase
- [ ] Intégrer Supabase Auth
- [ ] Configurer OAuth Google
- [ ] Configurer OAuth Meta/Facebook
- [ ] Créer middleware d'authentification
- [ ] Page login/callback
- [ ] Adapter articles.ts pour lire depuis Supabase
- [ ] Adapter API /api/articles/action pour écrire dans Supabase

### Phase 3 : Articles public ✅
- [x] Page d'accueil avec liste articles
- [x] Page article individuelle
- [x] Composants ArticleCard, ArticleList
- [x] SEO meta tags + Open Graph
- [x] Filtres par catégorie
- [x] GamepadDecorations (style console)
- [x] Effet Ambilight sur page article

### Phase 4 : Admin (À faire)
- [ ] Dashboard admin (route protégée)
- [ ] CRUD articles
- [ ] Éditeur markdown
- [ ] Upload images

### Phase 5 : Commentaires ✅
- [x] Section commentaires sur articles
- [x] Système de likes
- [x] Commentaires bots automatiques
- [ ] Formulaire ajout commentaire (auth required)
- [ ] Modération admin

### Phase 6 : Multilingue ✅
- [x] Contexte de langue (LanguageContext)
- [x] Dictionnaires EN/FR
- [x] Switcher de langue
- [x] Articles bilingues (content/fr, content/en)

### Phase 7 : Polish (En cours)
- [x] Partage social (ShareButtons)
- [x] Design responsive
- [x] Dark mode (thème sombre par défaut)
- [x] Bouton signaler (ReportButton)
- [x] Layout homepage style Kotaku (featured + sidebar)
- [x] Section "Most Commented" avec seededRandom
- [x] Système de pubs responsive (mobile inline + sidebar desktop)
- [x] Fix image cropping (object-top)
- [x] GamepadDecorations D-pad interactif (press animation)
- [x] Logo header manette SVG
- [x] Alignement favicon/header (fond sombre + manette outline)
- [x] Gradient statique homepage (rouge/noir/gris)
- [x] Effet Ambilight corrigé (anti-banding CSS, gradient ellipse centré à 8%)
- [x] Refonte système catégories (20 catégories thématiques, multi-tags, frontmatter YAML)
- [ ] Tests de performance

## Articles validés (6)

| Fichier | Sujet | Status |
|---------|-------|--------|
| palworld-joueurs-realisation.md | Palworld / Réalisation joueurs | ✅ Validé |
| metroid-prime-4-attente.md | Nintendo / Metroid Prime 4 | ✅ Validé |
| nintendo-fuite-cartouches.md | Nintendo / Fuite Switch 2 | ✅ Validé |
| ea-fc25-microtransactions.md | EA / Microtransactions | ✅ Validé |
| ubisoft-ac-shadows.md | Ubisoft / AC Shadows | ✅ Validé |

## Guidelines content-generator

Règles clés établies pendant les tests :
- **Faits de base vrais** : Ne pas inventer scores, dates, événements réels
- **Pas de punchlines évidentes** : Éviter "à quoi bon", "c'est la fin"
- **Chutes sèches** : Pas de "avant de préciser qu'il plaisantait"
- **Ton pince-sans-rire** : Énoncer l'absurde comme des faits
- **Cruauté douce** : Témoignages pathétiques, contraste ton neutre

## Skills - Orchestration

| Skill | Commande | Status | Description |
|-------|----------|--------|-------------|
| implement | `/implement` | ✅ Actif | Guidelines d'implémentation projet |
| create-article | `/create-article` | ✅ Actif | Orchestre création d'article |
| orchestrate-comments | `/orchestrate-comments` | ✅ Actif | Planifie commentaires bots |

**Note** : Le workflow analyze/implement est automatique via CLAUDE.md (règles de modification obligatoires).

## Agents - État d'utilisation

| Agent | Status | Appelé par | Notes |
|-------|--------|------------|-------|
| analyste | ✅ Actif | plan mode (auto) | Vérifie cohérence projet |
| topic-finder | ✅ Actif | skill `create-article` | Recherche sujets d'actualité |
| content-generator | ✅ Actif | skill `create-article` | Génère articles FR+EN |
| image-finder | ✅ Actif | skill `create-article` | Fallback si image manquante |
| content-tuner | ✅ Actif | manuel | Ajuste guidelines |
| comment-orchestrator | ✅ Actif | skill `orchestrate-comments` | Planifie commentaires |
| bots/* | ✅ Actifs | comment-orchestrator | Commentateurs automatiques |

## À noter pour plus tard

- Prévoir agent "content-checker" pour détecter répétitions entre articles (nécessite MCP + DB)
- Domaine skillissue.gg (~50€/an) quand le site sera prêt

## Troubleshooting

### Erreur Turbopack "Failed to write app endpoint /page"

**Symptôme** : Next.js crash avec une erreur Turbopack fatale au chargement de la page.

**Cause** : Un fichier nommé `nul` existe à la racine du projet. Sur Windows, `nul` est un nom réservé (équivalent de `/dev/null` sur Unix) et ne peut pas être lu comme un fichier normal.

**Solution** : Supprimer le fichier `nul` à la racine du projet, puis redémarrer le serveur.

```bash
# Windows - supprimer le fichier réservé
del "\\?\C:\chemin\vers\projet\nul"
```

## Dernière mise à jour

2025-12-29 - Troll face curseur sur bouton Signaler, doc troubleshooting
