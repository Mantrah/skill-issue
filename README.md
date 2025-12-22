# Skill Issue

Site satirique dédié aux jeux vidéo, inspiré du Gorafi et de NordPresse.

## Stack technique

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Google/Meta OAuth)
- **Hébergement**: Vercel

## Développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Structure

```
skill-issue/
├── src/
│   └── app/           # Pages Next.js (App Router)
├── content/           # Articles satiriques (markdown)
├── .claude/
│   └── agents/        # Agents de génération de contenu
│       ├── content-generator.md
│       └── content-tuner.md
└── public/            # Assets statiques
```

## Fonctionnalités prévues

### v1
- [ ] Page d'accueil avec liste d'articles
- [ ] Page article individuelle
- [ ] SEO optimisé
- [ ] Auth Google/Meta
- [ ] Commentaires
- [ ] Multilingue (EN/FR)

### Admin
- [ ] Dashboard admin
- [ ] CRUD articles
- [ ] Modération commentaires

## Déploiement

```bash
vercel
```

## Licence

MIT
