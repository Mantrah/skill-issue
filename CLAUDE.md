# Skill Issue - Contexte projet

Site satirique gaming inspiré du Gorafi/NordPresse.

## Documentation

- [Architecture technique](./docs/ARCHITECTURE.md)
- [Suivi du projet](./docs/PROJECT_STATUS.md)
- [Schéma base de données](./docs/DATABASE_SCHEMA.md)

## Skills disponibles

| Skill | Commande | Description |
|-------|----------|-------------|
| `analyze` | `/analyze` | Analyse avant toute modification du projet |
| `implement` | `/implement` | Implémente après validation d'un plan |
| `create-article` | `/create-article [sujet]` | Orchestre la création d'article (topic → content → image → pending.json) |

## Agents disponibles

| Agent | Rôle | Appelé par |
|-------|------|------------|
| `analyste` | Analyse demandes, vérifie cohérence | skill `analyze` |
| `topic-finder` | Recherche sujets d'actualité gaming | skill `create-article` |
| `content-generator` | Génère articles FR+EN + télécharge image | skill `create-article` |
| `image-finder` | Recherche image avancée (fallback) | skill `create-article` |
| `article-creator` | ~~Publie depuis pending.json~~ | obsolète (remplacé par API) |
| `content-tuner` | Ajuste guidelines selon feedback | manuel |
| `image-prompt-generator` | Génère prompts d'images IA | non utilisé |
| `comment-orchestrator` | Planifie commentaires bots | manuel |
| `tester` | Tests unitaires et validation | non utilisé |
| `bots/*` | Personnalités des bots commentateurs | comment-orchestrator |

## Workflow de création d'article

### Système de drafts

Les articles passent par `/drafts/pending.json` avant publication :
- `pending` : En attente de validation
- `approved` : Validé, prêt à publier
- `published` : Publié sur le site
- `rejected` : Refusé

### Commande rapide

```bash
/create-article                    # Recherche auto de sujet
/create-article FaZe Clan exodus   # Avec sujet fourni
```

### Workflow orchestré par le skill

```
┌─────────────────────────────────────────┐
│         /create-article [sujet]          │
└─────────────────────────────────────────┘
                    │
      ┌─────────────┴─────────────┐
      ▼                           ▼
┌───────────┐              ┌───────────┐
│  Sujet    │              │ Recherche │
│  fourni   │              │   auto    │
└─────┬─────┘              └─────┬─────┘
      │                          │
      │                   [topic-finder]
      │                          │
      │                   Auto-select (1er)
      │                          │
      └──────────┬───────────────┘
                 ▼
        [content-generator]
           │
           ▼
    Image trouvée ?
     │         │
    Oui       Non
     │         │
     │    [image-finder]
     │         │
     └────┬────┘
          ▼
   pending.json ✓
          │
          ▼
  User valide (/admin)
          │
          ▼
   Bouton "Publier"
   (UPDATE status)
          │
          ▼
     Publié ✓
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
