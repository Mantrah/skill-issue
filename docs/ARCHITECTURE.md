# Architecture - Skill Issue

## Stack technique

| Composant | Choix | Raison |
|-----------|-------|--------|
| Frontend | Next.js 14 (App Router) | SSR/SSG, SEO, écosystème riche |
| Styling | Tailwind CSS | Rapide, flexible |
| Database | Supabase (PostgreSQL) | Gratuit, Auth OAuth intégré |
| Hébergement | Vercel | Gratuit, intégration Next.js parfaite |
| Auth | Supabase Auth | Google/Meta OAuth gratuit |

## Hébergement

- **Domaine initial** : skillissue.vercel.app (gratuit)
- **Domaine futur** : skillissue.gg (~50€/an)

## Structure du projet

```
skill-issue/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── article/[slug]/
│   │   │   │   └── page.tsx          # Article page
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx          # Dashboard
│   │   │   │   ├── articles/
│   │   │   │   └── comments/
│   │   │   └── auth/
│   │   │       ├── login/
│   │   │       └── callback/
│   │   ├── api/
│   │   │   ├── articles/
│   │   │   ├── comments/
│   │   │   └── auth/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                       # Composants réutilisables
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleList.tsx
│   │   ├── CommentSection.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ShareButtons.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── i18n/
│   │   │   ├── config.ts
│   │   │   └── dictionaries/
│   │   │       ├── en.json
│   │   │       └── fr.json
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── content/                          # Articles markdown (phase test)
├── public/
│   └── images/
├── supabase/
│   └── migrations/
├── docs/
│   ├── ARCHITECTURE.md               # Ce fichier
│   └── PROJECT_STATUS.md             # Suivi du projet
├── .claude/
│   └── agents/
│       ├── content-generator.md
│       └── content-tuner.md
├── CLAUDE.md                         # Contexte pour Claude
├── next.config.js
├── tailwind.config.js
└── package.json
```

## Schéma base de données (Supabase)

```sql
-- Articles
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_fr TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_fr TEXT NOT NULL,
  excerpt_en TEXT,
  excerpt_fr TEXT,
  image_url TEXT,
  category VARCHAR(100),
  tags TEXT[],
  author_id UUID REFERENCES auth.users(id),
  status VARCHAR(20) DEFAULT 'draft', -- draft, published
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles (extension de auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username VARCHAR(100),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'user', -- user, admin
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_fr VARCHAR(100) NOT NULL
);
```

## Dépendances principales

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "@supabase/supabase-js": "^2.0.0",
    "@supabase/ssr": "^0.1.0",
    "next-intl": "^3.0.0",
    "tailwindcss": "^3.4.0",
    "react-markdown": "^9.0.0",
    "date-fns": "^3.0.0"
  }
}
```
