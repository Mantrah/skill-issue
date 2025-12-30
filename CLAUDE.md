# Skill Issue - Contexte projet

Site satirique gaming inspiré du Gorafi/NordPresse.

## Documentation

- [Architecture technique](./docs/ARCHITECTURE.md)
- [Suivi du projet](./docs/PROJECT_STATUS.md)
- [Schéma base de données](./docs/DATABASE_SCHEMA.md)

## Règles de modification (OBLIGATOIRE)

### Changements TRIVIAUX (implémenter directement)
- Typos, couleurs, spacing, textes statiques
- Valeurs numériques simples
- Corrections mineures sans impact structurel

### Changements NON-TRIVIAUX (plan mode obligatoire)
Pour tout changement impliquant :
- Nouveau fichier ou composant
- Modification de logique métier
- Changement d'architecture
- Création/modification d'agent ou skill
- Modifications multi-fichiers

**JE DOIS** :
1. Entrer en plan mode (`EnterPlanMode`)
2. Appeler l'agent `analyste` pour vérifier cohérence projet
3. Écrire le plan dans `.claude/plans/`
4. Attendre validation utilisateur
5. Implémenter en suivant les guidelines du skill `/implement`

## Skills disponibles

| Skill | Commande | Description |
|-------|----------|-------------|
| `implement` | `/implement` | Implémente après validation d'un plan (guidelines projet) |
| `create-article` | `/create-article [sujet]` | Orchestre la création d'article (topic → content → image → pending.json) |
| `orchestrate-comments` | `/orchestrate-comments [slug]` | Planifie les commentaires bots pour un article |

## Agents disponibles

| Agent | Rôle | Appelé par |
|-------|------|------------|
| `analyste` | Analyse demandes, vérifie cohérence projet | plan mode (automatique) |
| `topic-finder` | Recherche sujets d'actualité gaming | skill `create-article` |
| `content-generator` | Génère articles FR+EN + télécharge image | skill `create-article` |
| `image-finder` | Recherche image avancée (fallback) | skill `create-article` |
| `content-tuner` | Ajuste guidelines selon feedback | manuel |
| `comment-orchestrator` | Planifie commentaires bots | skill `orchestrate-comments` |
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
