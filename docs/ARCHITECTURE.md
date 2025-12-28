# Architecture - Skill Issue

## Stack technique

| Composant | Choix | Raison |
|-----------|-------|--------|
| Frontend | Next.js 14 (App Router) | SSR/SSG, SEO, écosystème riche |
| Styling | Tailwind CSS | Rapide, flexible |
| Database | Supabase (PostgreSQL) | Gratuit, Auth OAuth intégré |
| Hébergement | Vercel | Gratuit, intégration Next.js parfaite |
| Auth | Supabase Auth | Google/Meta OAuth gratuit |

## Principes de développement

### Future-Proofing (Migration Supabase)

**Règle fondamentale** : Toute implémentation doit être conçue pour faciliter la migration vers Supabase.

| Principe | Explication |
|----------|-------------|
| **JSON > Fichiers** | Préférer les structures JSON qui mappent vers des tables DB |
| **Source unique** | Une seule source de vérité pour chaque type de donnée |
| **UUIDs** | Utiliser des identifiants uniques préparés pour la DB |
| **Statuts explicites** | Workflow clair (`pending`, `published`, etc.) |
| **Metadata extensible** | Champ `metadata` JSON pour l'évolutivité |

**Exemple concret** : Le système de drafts utilise `/drafts/pending.json` avec une structure identique à la future table `articles` de Supabase. La migration se fera par simple import JSON → PostgreSQL.

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
│   │   ├── ArticleCard.tsx           # Carte article (featured + preview)
│   │   ├── ArticleList.tsx
│   │   ├── ArticlePageClient.tsx     # Page article avec Ambilight
│   │   ├── CommentSection.tsx
│   │   ├── GamepadDecorations.tsx    # Décorations manette (D-pad + boutons)
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ShareButtons.tsx
│   │   ├── LikeButton.tsx
│   │   ├── ReportButton.tsx
│   │   └── ImagePlaceholder.tsx
│   ├── hooks/
│   │   └── useAmbientColor.ts        # Hook extraction couleur dominante
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
├── content/                          # Articles publiés (markdown)
├── drafts/                           # Staging articles (JSON)
│   ├── pending.json                  # Articles en attente de validation
│   └── schema.json                   # Schéma JSON pour validation
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

## Composants visuels clés

### GamepadDecorations
Composant décoratif qui encadre les images d'articles dans un style "console de jeu" :
- **D-pad** (gauche) : Croix directionnelle SVG avec gradient rouge, **interactif** (React state pour animation press)
- **Boutons** (droite) : 2 boutons gris en diagonale
- **Console** : Background gradient gris foncé, bordure accent rouge, coins arrondis (rounded-3xl)
- **Interactivité** : `useState<Direction>` pour gérer l'état pressé, support mouse + touch events

### Règles d'affichage des images
Pour les images featured et article page :
- **Largeur** : L'image remplit toujours 100% de la largeur de l'écran central
- **Letterboxing** : Barres noires uniquement horizontales (haut/bas), jamais verticales
- **Zones** : D-pad 20% | Écran 60% | Boutons 20%
- **Bordure écran** : 2px noir

```tsx
// Configuration image
<Image
  src={article.image}
  width={1920}
  height={1080}
  className="w-full h-auto"
/>
```

### Effet Ambilight (page article uniquement)
Le hook `useAmbientColor` extrait la couleur dominante de l'image d'article et applique un gradient radial sur le fond de la page article, créant un effet d'immersion contextuel.

**Fichiers** :
- `src/hooks/useAmbientColor.ts` - Extraction couleur + génération du style
- `src/components/ArticlePageClient.tsx` - Applique `ambientStyle` sur le div principal (ligne 72)

**Technique d'extraction** :
- Canvas 50x50 pour échantillonnage rapide
- Moyenne RGB avec exclusion des pixels trop sombres/clairs (30-225)
- Boost saturation x1.8 et assombrissement x0.45 pour rendu subtil

**Gradient appliqué** :
```tsx
// Position verticale configurable via le paramètre verticalPosition
background: `radial-gradient(ellipse 80% 50% at 50% ${verticalPosition}%, ${ambientColor} 0%, var(--background) 70%)`
```

**Positions par page** :
- Page article : 8% (aligné sur l'écran de GamepadDecorations)
- Homepage : 18% (centré sur image + titre de l'article featured)

**Anti-banding CSS** :
Les gradients vers `transparent` créent du "banding" (bandes visibles) car `transparent` = `rgba(0,0,0,0)` (noir transparent).

**Solution** : Toujours transitionner vers `var(--background)` au lieu de `transparent`.

```tsx
// ❌ Banding visible
background: `radial-gradient(... ${color} 0%, transparent 70%)`

// ✅ Dégradé lisse
background: `radial-gradient(... ${color} 0%, var(--background) 70%)`
```

**Note future** : L'effet actuel est un gradient centré. Une itération future pourrait implémenter un "vrai ambilight" avec émission depuis les bords de l'écran.

### Layout Homepage (style Kotaku)
Structure responsive inspirée des sites gaming :
- **Featured article** : Grande carte avec GamepadDecorations
- **Sidebar desktop** : Liste "Most Commented" + emplacements pubs (300x250 + 300x600 sticky)
- **Mobile** : Pub inline 300x250 après le 2ème article

### Section "Most Commented"
- Affiche 5 articles avec compteurs likes/commentaires
- Utilise `seededRandom(slug)` pour générer des valeurs déterministes (évite hydration errors)
- Style compact avec miniatures et métadonnées

### Header
- **Logo** : GamepadIcon SVG inline (manette outline rouge)
- **Texte** : "SKILL" (accent) + "ISSUE" (foreground)
- **Tagline** : "L'actu gaming qu'on mérite (ou pas)"

### Favicon (icon.svg)
- Fond sombre `#1a1a1a` (aligné avec header-bg)
- Manette outline rouge `#dc2626` (accent)
- Cohérence visuelle avec le header

### ArticleCard
- **Featured** : aspect-auto, image pleine hauteur
- **Preview** : aspect-[16/9], `object-cover object-top` pour préserver les logos en haut d'image

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
