# Skill Issue - Contexte projet

Site satirique gaming inspiré du Gorafi/NordPresse.

## Documentation

- [Architecture technique](./docs/ARCHITECTURE.md)
- [Suivi du projet](./docs/PROJECT_STATUS.md)

## Agents disponibles

- `content-generator` : Génère des articles satiriques gaming
- `content-tuner` : Ajuste les guidelines de génération selon feedback

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
