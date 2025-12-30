---
name: orchestrate-comments
description: Planifie les commentaires bots pour un article
---

# Skill de planification des commentaires

Ce skill génère automatiquement les commentaires des bots pour un article donné avec un timing intelligent.

## Usage

```
/orchestrate-comments [slug]
```

## Processus

1. **Lire l'article** depuis `drafts/pending.json` ou `content/fr/[slug].md`
2. **Calculer le timing** via `src/lib/comment-scheduler.ts` (fenêtres horaires, probabilités)
3. **Appeler les agents bots** pour générer le contenu
4. **Écrire les commentaires** dans `data/comments/[slug].json` avec `scheduledStatus`

## Système de timing intelligent

Chaque bot a une **fenêtre horaire** réaliste :

| Bot | Fenêtre | Délai base | Variance | Probabilité |
|-----|---------|------------|----------|-------------|
| boomer (Michel) | 9h-18h | T+5m | ±10m | 80% |
| retro (RetroGamer) | 19h-23h | T+30m | ±20m | 70% |
| pro-gamer (xX_Pro) | 14h-04h | T+90m | ±45m | 60% |
| e-girl (Kawaii) | 10h-02h | T+120m | ±60m | 50% |

Si l'article est publié hors fenêtre, le commentaire est reporté au début de la prochaine fenêtre.

## Bots disponibles

| Bot | Personnalité |
|-----|--------------|
| `boomer-gamer` | Michel_DuBureau, 58 ans, naïf, questions involontairement drôles |
| `pro-gamer` | xX_ProGamer_Xx, 19 ans, toxique, "skill issue" |
| `retro-gamer` | RetroGamer_1987, 45 ans, nostalgique |
| `e-girl` | xKawaiiGamer_Chan, 22 ans, emojis partout |

## Format de sortie

Le skill produit un fichier JSON dans `data/comments/[slug].json` :

```json
{
  "articleSlug": "[slug]",
  "comments": [
    {
      "id": "uuid",
      "author": "Michel_DuBureau",
      "content": "...",
      "date": "ISO-8601",
      "likes": 12,
      "status": "bot",
      "replyTo": null,
      "scheduledStatus": "scheduled",
      "scheduledAt": "ISO-8601"
    }
  ]
}
```

### Statuts de planification

| Status | Description |
|--------|-------------|
| `pending` | En attente de validation manuelle |
| `scheduled` | Planifié pour publication auto à `scheduledAt` |
| `published` | Visible sur le site |

## Règles

1. **Toujours lire l'article** avant de générer les commentaires
2. **Utiliser le scheduler** - Appeler `scheduleComments()` pour calculer les timings
3. **Respecter les personnalités** - Chaque bot a un ton unique
4. **Interactions naturelles** - Les bots peuvent se répondre entre eux
5. **Pas de spoilers** - Les commentaires ne révèlent pas la chute de l'article

## Code scheduler

```typescript
import { scheduleComments, BOT_CONFIGS } from '@/lib/comment-scheduler'

// Calcule le timing pour chaque bot
const scheduled = scheduleComments(new Date())
// Returns: [{ botId, author, scheduledAt, willComment }]
```
