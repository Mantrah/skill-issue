---
description: Planifie les commentaires bots pour un article
arguments: slug de l'article
---

Utilise l'agent `comment-orchestrator` pour planifier les commentaires de l'article **$ARGUMENTS**.

Processus :
1. Lis l'article `content/fr/$ARGUMENTS.md`
2. Regarde l'image `public/images/$ARGUMENTS.*`
3. Consulte les profils bots dans `.claude/agents/bots/`
4. Produis le plan JSON selon le format défini dans l'agent
