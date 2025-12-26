---
name: analyze
description: TOUJOURS utiliser ce skill AVANT toute modification du projet. S'applique à TOUTE demande impliquant du code, des fichiers, de l'architecture, des agents, des skills, ou de la configuration. Analyse d'abord, implémente après validation.
---

# Skill Déclencheur d'Analyse

Ce skill filtre les demandes et appelle l'agent `analyste` si nécessaire.

## Quand ce skill se déclenche

- Création de fichier, composant, agent, skill
- Modification de code existant
- Changement d'architecture
- Ajout de fonctionnalité
- Refactoring
- Question sur la structure du projet

## Processus

### Étape 1 : Évaluer la demande

**Changements TRIVIAUX** (ne pas appeler l'analyste) :
- Changement de couleur, gradient, spacing
- Correction de typo
- Ajustement de texte
- Modification de valeur numérique simple

**Changements NON-TRIVIAUX** (appeler l'analyste) :
- Nouveau fichier ou composant
- Modification de logique métier
- Changement d'architecture
- Création/modification d'agent ou skill
- Tout ce qui touche plusieurs fichiers

### Étape 2 : Si non-trivial, appeler l'agent analyste

Utilise le Task tool avec l'agent `analyste` :

```
Analyse cette demande : [demande utilisateur]

Contexte additionnel : [si pertinent]
```

### Étape 3 : Présenter l'analyse à l'utilisateur

Affiche le résultat de l'agent et demande validation avant d'implémenter.

## Règles

1. **Filtrer intelligemment** - Les changements triviaux peuvent être faits directement
2. **Toujours analyser** les modifications structurelles
3. **Ne jamais implémenter** sans validation pour les changements non-triviaux
4. **L'agent analyste** lit la doc et a le contexte complet
