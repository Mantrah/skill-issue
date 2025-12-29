# Database Schema - Supabase

Schema de base de données pour la migration vers Supabase.

## Vue d'ensemble

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  articles   │────<│  comments   │     │  profiles   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   │                   │
       └───────────────────┴───────────────────┘
                           │
                    ┌──────┴──────┐
                    │    likes    │
                    └─────────────┘
```

## Tables

### articles

Table principale pour tous les articles (pending, approved, published, rejected).

```sql
CREATE TYPE article_status AS ENUM (
  'pending',           -- En attente de validation
  'approved',          -- Validé, prêt à publier
  'published',         -- Publié sur le site
  'rejected',          -- Refusé définitivement
  'needs_correction'   -- À corriger par l'IA
);

CREATE TABLE articles (
  -- Identifiants
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,

  -- Contenu multilingue
  title_fr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  content_fr TEXT NOT NULL,
  content_en TEXT NOT NULL,
  excerpt_fr TEXT,
  excerpt_en TEXT,

  -- Catégorisation
  tags TEXT[] NOT NULL,

  -- Media
  image_url TEXT,
  local_image TEXT,

  -- Workflow
  status article_status NOT NULL DEFAULT 'pending',

  -- Métadonnées
  author_id UUID REFERENCES auth.users(id),
  source_url TEXT,
  source_name TEXT,

  -- Correction
  correction_prompt TEXT,
  correction_requested_at TIMESTAMPTZ,

  -- Rejet
  rejected_reason TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,

  -- Contraintes
  CONSTRAINT tags_length CHECK (array_length(tags, 1) BETWEEN 1 AND 3)
);

-- Indexes
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published ON articles(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_articles_tags ON articles USING GIN(tags);
CREATE INDEX idx_articles_slug ON articles(slug);
```

### comments

Commentaires sur les articles (bots et utilisateurs).

```sql
CREATE TYPE comment_author_type AS ENUM ('bot', 'user', 'admin');

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,

  -- Auteur
  user_id UUID REFERENCES auth.users(id),
  author_name VARCHAR(100) NOT NULL,
  author_type comment_author_type NOT NULL DEFAULT 'user',

  -- Contenu
  content TEXT NOT NULL,

  -- Threading
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,

  -- Engagement
  likes INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_comments_article ON comments(article_id, created_at DESC);
CREATE INDEX idx_comments_parent ON comments(parent_id);
```

### profiles

Profils utilisateurs (lié à Supabase Auth).

```sql
CREATE TYPE user_role AS ENUM ('user', 'admin');

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  username VARCHAR(50) UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,

  role user_role DEFAULT 'user',
  comments_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_role ON profiles(role);
```

### categories

Table de référence pour les catégories/tags.

```sql
CREATE TABLE categories (
  id VARCHAR(50) PRIMARY KEY,

  label_fr VARCHAR(100) NOT NULL,
  label_en VARCHAR(100) NOT NULL,

  color VARCHAR(7) NOT NULL,
  icon VARCHAR(10),
  category_group VARCHAR(50),
  display_order INTEGER DEFAULT 999
);
```

### likes

Likes pour articles et commentaires.

```sql
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT like_target CHECK (
    (article_id IS NOT NULL AND comment_id IS NULL) OR
    (article_id IS NULL AND comment_id IS NOT NULL)
  ),
  CONSTRAINT unique_article_like UNIQUE (user_id, article_id),
  CONSTRAINT unique_comment_like UNIQUE (user_id, comment_id)
);
```

## Triggers

```sql
-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-set published_at
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_set_published_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION set_published_at();
```

## Row Level Security (RLS)

```sql
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Articles : public peut lire les published
CREATE POLICY "Articles published sont publics"
  ON articles FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins peuvent tout voir"
  ON articles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Commentaires : lecture publique, création authentifiée
CREATE POLICY "Commentaires sont publics"
  ON comments FOR SELECT USING (true);

CREATE POLICY "Users authentifiés peuvent commenter"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Likes
CREATE POLICY "Users peuvent liker"
  ON likes FOR ALL
  USING (user_id = auth.uid());
```

## Seed Data - Categories

```sql
INSERT INTO categories (id, label_fr, label_en, color, icon, category_group, display_order) VALUES
  ('aaa', 'AAA', 'AAA', '#dc2626', '🏢', 'Éditeurs', 1),
  ('indie', 'Indie', 'Indie', '#f59e0b', '🎨', 'Éditeurs', 2),
  ('esports', 'Esports', 'Esports', '#8b5cf6', '🏆', 'Compétitif', 3),
  ('moba', 'MOBA', 'MOBA', '#06b6d4', '⚔️', 'Genres', 4),
  ('fps', 'FPS', 'FPS', '#ef4444', '🎯', 'Genres', 5),
  ('mmorpg', 'MMORPG', 'MMORPG', '#6366f1', '🐉', 'Genres', 6),
  ('rpg', 'RPG', 'RPG', '#a855f7', '⚗️', 'Genres', 7),
  ('battle-royale', 'Battle Royale', 'Battle Royale', '#f97316', '🪂', 'Genres', 8),
  ('survival', 'Survival', 'Survival', '#84cc16', '🏕️', 'Genres', 9),
  ('nintendo', 'Nintendo', 'Nintendo', '#e11d48', '🍄', 'Plateformes', 10),
  ('playstation', 'PlayStation', 'PlayStation', '#2563eb', '🎮', 'Plateformes', 11),
  ('xbox', 'Xbox', 'Xbox', '#22c55e', '🟢', 'Plateformes', 12),
  ('pc', 'PC', 'PC', '#475569', '🖥️', 'Plateformes', 13),
  ('mobile', 'Mobile', 'Mobile', '#ec4899', '📱', 'Plateformes', 14),
  ('vr', 'VR', 'VR', '#7c3aed', '🥽', 'Plateformes', 15),
  ('retro', 'Retro', 'Retro', '#ca8a04', '👾', 'Thématiques', 16),
  ('industry', 'Industry', 'Industry', '#64748b', '📊', 'Thématiques', 17),
  ('hardware', 'Hardware', 'Hardware', '#0891b2', '🔧', 'Thématiques', 18),
  ('streaming', 'Streaming', 'Streaming', '#9333ea', '📺', 'Thématiques', 19),
  ('general', 'Gaming', 'Gaming', '#71717a', '🎲', 'Fallback', 20);
```

## Migration depuis pending.json

```typescript
import { createClient } from '@supabase/supabase-js'
import pendingData from './drafts/pending.json'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

for (const article of pendingData.articles) {
  await supabase.from('articles').insert({
    id: article.id,
    slug: article.slug,
    title_fr: article.fr.title,
    title_en: article.en.title,
    content_fr: article.fr.content,
    content_en: article.en.content,
    tags: article.tags,
    image_url: article.imageUrl,
    local_image: article.localImage,
    status: article.status,
    created_at: article.createdAt,
    updated_at: article.updatedAt,
    source_url: article.metadata?.sourceUrl,
    source_name: article.metadata?.sourceName,
    correction_prompt: article.correction?.prompt,
    rejected_reason: article.rejectedReason
  })
}
```

## Queries courantes

### Articles publiés (homepage)

```typescript
const { data } = await supabase
  .from('articles')
  .select('*')
  .eq('status', 'published')
  .order('published_at', { ascending: false })
```

### Articles pending (admin)

```typescript
const { data } = await supabase
  .from('articles')
  .select('*')
  .in('status', ['pending', 'approved', 'needs_correction'])
  .order('created_at', { ascending: false })
```

### Publier un article

```typescript
await supabase
  .from('articles')
  .update({ status: 'published' })
  .eq('slug', articleSlug)
// Note: published_at est set automatiquement par le trigger
```

### Article avec commentaires

```typescript
const { data } = await supabase
  .from('articles')
  .select(`
    *,
    comments (
      id, author_name, content, author_type,
      created_at, parent_id, likes
    )
  `)
  .eq('slug', slug)
  .eq('status', 'published')
  .single()
```
