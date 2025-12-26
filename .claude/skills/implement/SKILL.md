---
name: implement
description: Implémente une fonctionnalité après validation du plan d'analyse. Utilise ce skill quand l'utilisateur valide un plan proposé par le skill analyze, ou demande explicitement d'implémenter quelque chose de planifié.
---

# Skill d'Implémentation

Ce skill s'active après validation d'un plan d'analyse pour implémenter les fonctionnalités.

## Prérequis

Avant d'implémenter :
1. Le plan doit être validé (via le skill `analyze`)
2. La liste des fichiers à modifier/créer est connue
3. Les spécifications techniques sont claires

## Workflow

1. **Suivre le plan** validé
2. **Vérifier les dépendances** (packages, fichiers existants)
3. **Implémenter étape par étape**
4. **Tester** que le code compile (`npm run build`)
5. **Rapporter** ce qui a été fait

## Règles de code

### Style
- TypeScript strict
- Composants React fonctionnels avec hooks
- Tailwind CSS pour le styling
- Nommage en anglais, commentaires en français si nécessaire

### Structure
- Composants dans `/src/components/`
- Libs/utils dans `/src/lib/`
- Pages dans `/src/app/`
- Contenu dans `/content/`
- Données dans `/data/`

### Conventions Skill Issue
- Multilingue FR/EN (utiliser `useLanguage()` pour les textes)
- Ton satirique pour le contenu
- Pas de sur-ingénierie

## Format de sortie

```markdown
## Implémentation : [Titre court]

**Plan suivi** : [Résumé du plan validé]

**Fichiers modifiés** :
- `[fichier]` - [description des changements]

**Fichiers créés** :
- `[fichier]` - [description]

**Vérifications** :
- [ ] Build OK (`npm run build`)
- [ ] Pas d'erreurs TypeScript
- [ ] Fonctionnalité testée manuellement

**Notes** :
- [Observations, choix techniques, etc.]

**Prêt pour tests** : ✅ Oui | ❌ Non (raison)
```

## Règles strictes

1. **Suivre le plan** - Pas d'improvisation hors scope
2. **Vérifier avant de modifier** - Lire les fichiers existants
3. **Tester le build** - Toujours vérifier que ça compile
4. **Documenter les choix** - Expliquer les décisions techniques
5. **Signaler les blocages** - Si quelque chose ne va pas, le dire
