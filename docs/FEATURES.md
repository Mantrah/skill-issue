# Skill Issue - Documentation Technique

## Architecture

### Stack
- **Next.js 16** (App Router) - Framework web
- **React 19** - Librairie UI
- **Tailwind CSS 4** - Styling
- **TypeScript** - Typage strict
- **Supabase** (prévu) - Base de données + Auth

### Structure des dossiers
```
skill-issue/
├── src/
│   ├── app/              # Pages et routing (App Router)
│   ├── components/       # Composants React
│   ├── contexts/         # Contextes React (langue)
│   └── lib/              # Utilitaires et logique métier
├── content/
│   ├── fr/               # Articles en français
│   └── en/               # Articles en anglais
├── data/
│   └── comments/         # Commentaires JSON par article
├── public/
│   └── images/           # Images des articles
├── .claude/
│   └── agents/           # Agents Claude spécialisés
└── docs/                 # Documentation technique
```

## Fonctionnalités

### Multilingue (i18n)
- **Langues** : Français (défaut), Anglais
- **Persistance** : localStorage
- **Contexte** : `LanguageContext` avec hook `useLanguage()`
- **Traductions** : Centralisées dans `src/lib/i18n.ts`

### Articles
- **Format** : Markdown dans `/content/[locale]/`
- **Parsing** : Automatique (titre, chapô, contenu, catégorie)
- **Images** : Détection automatique dans `/public/images/[slug].[ext]`
- **Dates** : Mockées (sera DB plus tard)
- **Tri** : Par date décroissante

### Catégories
| ID | Label | Couleur | Icône |
|----|-------|---------|-------|
| nintendo | Nintendo | #e11d48 | 🎮 |
| ea | EA Sports | #0ea5e9 | ⚽ |
| ubisoft | Ubisoft | #8b5cf6 | 🗡️ |
| sony | PlayStation | #2563eb | 🎯 |
| microsoft | Xbox | #22c55e | 🎲 |
| general | Gaming | #71717a | 👾 |

### Commentaires
- **Stockage** : JSON dans `/data/comments/[slug].json`
- **Statuts** : admin 🛡️, bot 🤖, user 👤
- **Likes** : Côté client (local state)
- **Réponses** : Prévu (champ `replyTo`)

### Partage
- Boutons : X (Twitter), Facebook, LinkedIn
- Copie lien avec feedback "Lien copié !"

### Likes articles
- État local côté client
- Compteur initial mocké

## Composants

### Layout
| Composant | Rôle |
|-----------|------|
| `Header.tsx` | Navigation + logo manette + toggle langue |
| `Footer.tsx` | Disclaimer satirique multilingue |

### Homepage
| Composant | Rôle |
|-----------|------|
| `CategoryFilter.tsx` | Filtres catégories + liste articles |
| `ArticleCard.tsx` | Carte article (featured ou standard) |

### Page article
| Composant | Rôle |
|-----------|------|
| `ArticlePageClient.tsx` | Rendu article complet + effet Ambilight |
| `CommentSection.tsx` | Liste commentaires avec likes (triés par likes) |
| `ShareButtons.tsx` | Boutons partage sociaux |
| `LikeButton.tsx` | Bouton like article |
| `ReportButton.tsx` | Bouton "Signaler" satirique (affiche meme "Problem?") |
| `ImagePlaceholder.tsx` | Placeholder coloré si pas d'image |

### Effet Ambilight
Gradient dynamique sur les pages d'article basé sur la couleur dominante de l'image.

**Fonctionnement** :
1. Chargement image via `fetch()` + blob URL (contourne CORS)
2. Analyse pixels via canvas (échantillonnage 1/16)
3. Filtrage pixels trop sombres (<30) ou trop clairs (>225)
4. Boost saturation (×1.8) pour couleurs plus vives
5. Assombrissement (×0.45) pour rendu subtil
6. Gradient linéaire vertical (couleur en haut → fond en bas)

**Style CSS** :
```css
linear-gradient(180deg, ${couleurAssombrie} 0%, var(--background) 67%)
background-attachment: fixed
transition: 1000ms ease-out
```

**Fallback** : Si pas d'image ou erreur, affiche `var(--background)` simple.

## Agents Claude

### content-generator (Sonnet)
Génère des articles satiriques gaming selon guidelines établies.
- Ton pince-sans-rire
- Faits de base vrais, interprétation absurde
- Workflow bilingue FR → EN

### content-tuner (Sonnet)
Améliore content-generator selon feedback utilisateur.

### comment-orchestrator (Sonnet)
Planifie les commentaires de bots pour un article.
- Analyse article + image
- Sélectionne les bots pertinents
- Planifie conversations entre bots
- Respecte les horaires de chaque bot

### image-prompt-generator (Haiku)
Génère des prompts d'images pour les articles.
- Images sérieuses et reconnaissables
- Évite les problèmes de copyright
- Utilise couleurs/ambiance plutôt que logos exacts

### Bots commentateurs
| Bot | Pseudo | Personnalité | Horaires |
|-----|--------|--------------|----------|
| retro-gamer | RetroGamer_1987 | Nostalgique, compare tout aux années 80-90 | 19h-23h |
| pro-gamer | xX_ProGamer_Xx | Compétitif, blame les autres, "skill issue" | 22h-4h |
| boomer-gamer | Michel_DuBureau | Égaré, questions naïves, "mon neveu..." | 7h-9h, 12h-14h, 18h-20h |

## Agents de développement

### analyste (Sonnet)
Agent avec vision complète du projet. Appelé par le skill `analyze`.
- Lit toute la documentation au démarrage
- Vérifie cohérence avec l'architecture
- Identifie fichiers impactés
- Propose plan d'implémentation

### tester (Sonnet)
Crée et exécute tests APRÈS implémentation.
- Tests unitaires
- Diagnostique les échecs
- Recommande actions

## Skills

### analyze
Skill déclencheur qui filtre les demandes.
- Évalue si changement trivial ou non
- Appelle l'agent `analyste` si nécessaire
- Demande validation avant implémentation

### implement
Skill d'implémentation APRÈS validation.
- Suit le plan validé par l'analyste
- Vérifie build
- Documente les changements

## Données

### Articles (4 publiés)
| Slug | Catégorie | Langues |
|------|-----------|---------|
| ubisoft-ac-shadows | ubisoft | FR, EN |
| ea-fc25-microtransactions | ea | FR, EN |
| nintendo-fuite-cartouches | nintendo | FR, EN |
| metroid-prime-4-attente | nintendo | FR, EN |

### Format JSON commentaires
```json
{
  "articleSlug": "slug-article",
  "comments": [
    {
      "id": "1",
      "author": "Username",
      "content": "Texte",
      "date": "2025-12-24T10:00:00Z",
      "likes": 89,
      "status": "bot",
      "replyTo": null
    }
  ]
}
```

## Commandes

```bash
npm run dev    # Serveur dev (localhost:3000)
npm run build  # Build production
npm start      # Serveur production
npm run lint   # Linter ESLint
```
