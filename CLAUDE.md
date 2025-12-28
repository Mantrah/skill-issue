# Skill Issue - Contexte projet

Site satirique gaming inspiré du Gorafi/NordPresse.

## Documentation

- [Architecture technique](./docs/ARCHITECTURE.md)
- [Suivi du projet](./docs/PROJECT_STATUS.md)

## Agents disponibles

- `analyste` : Analyse les demandes, vérifie la cohérence, propose des plans d'implémentation
- `topic-finder` : Recherche des sujets d'actualité gaming avec potentiel satirique
- `content-generator` : Génère des articles satiriques gaming (retourne un format structuré)
- `article-creator` : Crée les fichiers d'un article validé (markdown FR/EN + image)
- `content-tuner` : Ajuste les guidelines de génération selon feedback
- `image-prompt-generator` : Génère des prompts d'images pour les articles
- `comment-orchestrator` : Planifie les commentaires bots pour un article
- `tester` : Crée et exécute les tests unitaires et de validation
- `bots/` : Dossier contenant les personnalités des bots commentateurs

## Workflow de création d'article

### Système de drafts

Les articles passent par `/drafts/pending.json` avant publication :
- `pending` : En attente de validation
- `approved` : Validé, prêt à publier
- `published` : Publié sur le site
- `rejected` : Refusé

### Workflow complet

```
1. topic-finder      → Propose des sujets d'actualité
2. Validation sujet  → User choisit
3. content-generator → Retourne JSON article
4. Orchestrateur     → Ajoute à pending.json (status: pending)
5. Validation        → User visualise et valide
6. article-creator   → Publie (fichiers + status: published)
```

### Workflow court (avec sujet fourni)

```
1. content-generator → Retourne JSON article
2. Orchestrateur     → Ajoute à pending.json
3. Validation        → User visualise et valide
4. article-creator   → Publie
```

### Structure JSON article

```json
{
  "id": "uuid",
  "slug": "article-slug",
  "tags": ["tag1", "tag2"],
  "imageUrl": "https://...",
  "date": "YYYY-MM-DD",
  "status": "pending",
  "fr": { "title": "...", "content": "..." },
  "en": { "title": "...", "content": "..." }
}
```

## Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Supabase (DB + Auth)
- Vercel (hosting)

## Commandes

```bash
npm run dev    # Lancer en local
npm run build  # Build production
```

## Conventions

- Articles en markdown dans `/content`
- Multilingue EN/FR prévu
- Ton satirique, jamais méchant
