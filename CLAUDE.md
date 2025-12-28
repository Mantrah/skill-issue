# Skill Issue - Contexte projet

Site satirique gaming inspiré du Gorafi/NordPresse.

## Documentation

- [Architecture technique](./docs/ARCHITECTURE.md)
- [Suivi du projet](./docs/PROJECT_STATUS.md)

## Agents disponibles

- `analyste` : Analyse les demandes, vérifie la cohérence, propose des plans d'implémentation
- `content-generator` : Génère des articles satiriques gaming
- `content-tuner` : Ajuste les guidelines de génération selon feedback
- `image-prompt-generator` : Génère des prompts d'images pour les articles
- `comment-orchestrator` : Planifie les commentaires bots pour un article
- `tester` : Crée et exécute les tests unitaires et de validation
- `bots/` : Dossier contenant les personnalités des bots commentateurs

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
