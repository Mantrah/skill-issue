---
name: create-article
description: Orchestre la création d'un article satirique gaming. Gère automatiquement la recherche de sujet, génération de contenu, et téléchargement d'image jusqu'à l'écriture dans pending.json.
---

# Skill Orchestrateur de Création d'Article

Ce skill orchestre le workflow complet de création d'article en appelant les agents appropriés.

## Invocation

```
/create-article                     # Recherche auto de sujet
/create-article [sujet]             # Avec sujet fourni
/create-article FaZe Clan exodus    # Exemple
```

## Workflow

```
┌─────────────────────────────────────────────────────┐
│              SKILL: create-article                   │
└─────────────────────────────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
   ┌───────────┐              ┌───────────┐
   │  Mode 1   │              │  Mode 2   │
   │  Sujet    │              │ Recherche │
   │  fourni   │              │   auto    │
   └─────┬─────┘              └─────┬─────┘
         │                          │
         │                   ┌──────▼──────┐
         │                   │topic-finder │
         │                   └──────┬──────┘
         │                          │
         │                   ┌──────▼──────┐
         │                   │ Auto-select │
         │                   │ (1er valide)│
         │                   └──────┬──────┘
         │                          │
         └──────────┬───────────────┘
                    ▼
          ┌─────────────────┐
          │content-generator│
          └────────┬────────┘
                   │
          ┌────────▼────────┐
          │ Image trouvée ? │
          └────────┬────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
   ┌───────────┐      ┌───────────┐
   │    OK     │      │image-finder│
   └─────┬─────┘      └─────┬─────┘
         │                  │
         └────────┬─────────┘
                  ▼
          ┌───────────────┐
          │ pending.json  │
          │ (status:      │
          │  pending)     │
          └───────────────┘
```

## Processus détaillé

### Étape 1 : Déterminer le mode

**Si argument fourni** → Mode 1 (sujet fourni)
**Sinon** → Mode 2 (recherche auto)

### Étape 2 : Obtenir le sujet (Mode 2 uniquement)

Appeler l'agent `topic-finder` :

```
Recherche des sujets d'actualité gaming récents avec potentiel satirique.
Évite les sujets déjà couverts : [lister depuis pending.json et articles publiés]
Classe les propositions par potentiel satirique (meilleur en premier).
```

**Sélectionner automatiquement le premier sujet** de la liste (celui avec le meilleur potentiel).

### Étape 3 : Générer l'article

Appeler l'agent `content-generator` avec le sujet :

```
Génère un article satirique sur : [SUJET]

Rappels :
- Écris dans /drafts/pending.json avec status: "pending"
- Télécharge l'image dans /public/images/[slug].jpg
- Max 400 mots, humour accessible, signature sans italique
```

### Étape 4 : Vérifier l'image

Après le retour de content-generator :

1. **Vérifier** que l'image a été téléchargée (`/public/images/[slug].jpg` existe)
2. **Vérifier** que c'est une vraie image (pas un fichier HTML d'erreur)

**Si image manquante ou invalide** → Appeler `image-finder` :

```
Trouve une image pour l'article : [TITRE]
Slug : [SLUG]
Thématique : [TAGS]
```

### Étape 5 : Confirmer le résultat

Afficher un résumé :

```
## Article créé avec succès

**Titre FR** : [titre]
**Titre EN** : [titre EN]
**Slug** : [slug]
**Tags** : [tags]
**Image** : [chemin]
**Status** : pending

→ Visualise dans /admin pour valider
→ Puis lance /publish [slug] pour publier
```

## Gestion d'erreurs

### topic-finder échoue
→ Demander à l'utilisateur de fournir un sujet manuellement

### content-generator échoue
→ Afficher l'erreur et proposer de réessayer

### Image non trouvée
→ Appeler image-finder automatiquement
→ Si toujours pas d'image → Signaler et continuer (article créé sans image)

### Slug déjà existant
→ Signaler le conflit
→ Proposer de modifier le slug ou d'écraser

## Règles

1. **Toujours vérifier** que l'article est bien dans pending.json avant de confirmer
2. **Ne jamais publier** directement (c'est le job de article-creator)
3. **Ne jamais s'arrêter** pour demander validation - le workflow est 100% automatique
4. **Afficher un résumé clair** à la fin du processus

## Agents utilisés

| Agent | Rôle | Quand |
|-------|------|-------|
| `topic-finder` | Recherche sujets d'actu | Mode 2 (recherche auto) |
| `content-generator` | Génère article FR+EN + image | Toujours |
| `image-finder` | Recherche image avancée | Si image manquante |

## Exemples

### Exemple 1 : Avec sujet fourni

```
User: /create-article FaZe Clan exodus des influenceurs

[Appelle content-generator directement]
[Vérifie image]
[Confirme création]
```

### Exemple 2 : Recherche auto

```
User: /create-article

[Appelle topic-finder]
[Sélectionne automatiquement le meilleur sujet]
[Appelle content-generator avec ce sujet]
[Vérifie image]
[Confirme création]
→ Article dans pending.json, prêt à valider dans /admin
```
