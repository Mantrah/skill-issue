# Suivi du projet - Skill Issue

## État actuel

**Phase** : Setup initial terminé, prêt pour Phase 2

## Phases d'implémentation

### Phase 1 : Setup projet ✅
- [x] Créer projet Next.js 14 avec App Router
- [x] Configurer Tailwind CSS
- [x] Migrer agents depuis geek-lol
- [x] Migrer articles validés
- [x] Setup .env.local.example
- [x] Mettre à jour README
- [x] Créer documentation (CLAUDE.md, ARCHITECTURE.md)

### Phase 2 : Auth & Base (À faire)
- [ ] Créer projet Supabase
- [ ] Configurer tables (voir ARCHITECTURE.md)
- [ ] Intégrer Supabase Auth
- [ ] Configurer OAuth Google
- [ ] Configurer OAuth Meta/Facebook
- [ ] Créer middleware d'authentification
- [ ] Page login/callback

### Phase 3 : Articles public (À faire)
- [ ] Page d'accueil avec liste articles
- [ ] Page article individuelle
- [ ] Composants ArticleCard, ArticleList
- [ ] SEO meta tags + Open Graph

### Phase 4 : Admin (À faire)
- [ ] Dashboard admin (route protégée)
- [ ] CRUD articles
- [ ] Éditeur markdown
- [ ] Upload images

### Phase 5 : Commentaires (À faire)
- [ ] Section commentaires sur articles
- [ ] Formulaire ajout commentaire (auth required)
- [ ] Modération admin

### Phase 6 : Multilingue (À faire)
- [ ] Setup next-intl
- [ ] Dictionnaires EN/FR
- [ ] Switcher de langue
- [ ] Routes localisées

### Phase 7 : Polish (À faire)
- [ ] Partage social
- [ ] Design responsive
- [ ] Dark mode (optionnel)
- [ ] Tests de performance

## Articles validés (4)

| Fichier | Sujet | Status |
|---------|-------|--------|
| metroid-prime-4-attente.md | Nintendo / Metroid Prime 4 | ✅ Validé |
| nintendo-fuite-cartouches.md | Nintendo / Fuite Switch 2 | ✅ Validé |
| ea-fc25-microtransactions.md | EA / Microtransactions | ✅ Validé |
| ubisoft-ac-shadows.md | Ubisoft / AC Shadows | ✅ Validé |

## Guidelines content-generator

Règles clés établies pendant les tests :
- **Faits de base vrais** : Ne pas inventer scores, dates, événements réels
- **Pas de punchlines évidentes** : Éviter "à quoi bon", "c'est la fin"
- **Chutes sèches** : Pas de "avant de préciser qu'il plaisantait"
- **Ton pince-sans-rire** : Énoncer l'absurde comme des faits
- **Cruauté douce** : Témoignages pathétiques, contraste ton neutre

## À noter pour plus tard

- Prévoir agent "content-checker" pour détecter répétitions entre articles (nécessite MCP + DB)
- Domaine skillissue.gg (~50€/an) quand le site sera prêt

## Dernière mise à jour

2025-12-21 - Setup initial terminé
