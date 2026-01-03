---
name: bot-tuner
description: Améliore ou crée un bot commentateur en suivant la méthodologie validée. Workflow interactif avec validations.
---

# Skill : Bot Tuner

Améliore ou crée un bot commentateur en suivant la méthodologie validée.

## Usage

```
/bot-tuner [bot-name]           # Améliorer un bot existant
/bot-tuner --new [bot-name]     # Créer un nouveau bot
```

## Workflow (avec validations)

### 1. Analyse du bot ⏸️ VALIDATION

Si le bot existe, lis son fichier dans `.claude/agents/bots/[bot-name].md`.

Présente à l'utilisateur :
- **Trait principal** : LE trait qui définit le bot
- **Manques actuels** : Ce qui pourrait être amélioré
- **Proposition** : Ce qu'on va améliorer

**⏸️ Attendre validation utilisateur avant de continuer.**

---

### 2. Recherche de références

Cherche sur le web des exemples réels du comportement cible :
- Commentaires authentiques de ce type de personne
- Patterns de langage, tics, formulations
- Ce qui les rend drôles MALGRÉ eux (pas intentionnellement)

Présente les findings à l'utilisateur (pas de validation requise, juste informatif).

---

### 3. Analyse des patterns ⏸️ VALIDATION

Extrais les patterns observés et propose :
- Les **techniques** identifiées (5-8)
- Ce qui rend le personnage drôle **malgré lui**
- Les **anti-patterns** (ce qu'il ne fait jamais)

**⏸️ Attendre validation utilisateur avant de continuer.**

---

### 4. Table des techniques ⏸️ VALIDATION

Propose la table des techniques :

```markdown
## Comment [verbe lié au trait]

| Technique | Quand l'utiliser |
|-----------|------------------|
| **Nom technique 1** | Description courte |
| **Nom technique 2** | ... |
```

**⏸️ Attendre validation utilisateur avant de continuer.**

---

### 5. Exemples génériques ⏸️ VALIDATION

Propose 5-7 exemples **GÉNÉRIQUES** (pas liés à un article) :

```markdown
## Exemples de commentaires

1. "Exemple générique montrant le ton" *(technique)*
2. "Autre exemple" *(autre_technique)*
```

**Les exemples doivent montrer le TON et le STYLE, pas réagir à un article spécifique.**

**⏸️ Attendre validation utilisateur avant de continuer.**

---

### 6. Instructions de variété ⏸️ VALIDATION

Propose les instructions de variété :

```markdown
⚠️ **VARIER les techniques. Ne pas répéter la même structure.**

💡 **Occasionnellement** : [comportement spécifique au bot]

🎲 **CRÉATIVITÉ** : Sois imprévisible. Varie tes formulations. Surprends.
```

+ Table d'angles variés si pertinent.

**⏸️ Attendre validation utilisateur avant de continuer.**

---

### 7. Règles / Anti-patterns ⏸️ VALIDATION

Propose les règles spécifiques :

```markdown
## Règles

1. **TRAITE L'ARTICLE COMME UNE VRAIE NEWS.**
2. Maximum 2-3 phrases.
3. [Règle spécifique au bot]
4. **Pertinence > Présence**
```

**⏸️ Attendre validation utilisateur avant de continuer.**

---

### 8. Implémentation

Après toutes les validations, applique les modifications au fichier bot.

Configuration :
```yaml
---
name: [bot-name]
description: [description courte]
model: sonnet
---
```

---

### 9. Test de validation ⏸️ VALIDATION

Teste le bot sur 3-4 articles différents :

1. Lis 3-4 articles dans `/content/fr/`
2. Lance l'agent bot sur chaque article
3. Présente les résultats :
   - Variété des techniques utilisées
   - Ton cohérent avec la personnalité
   - Self-filtering correct
   - Drôle MALGRÉ lui

**⏸️ Attendre validation utilisateur. Si problèmes → itérer.**

---

## Référence : Michel (boomer-gamer)

Voir `.claude/agents/bots/boomer-gamer.md` comme exemple de bot bien structuré.

## Principes fondamentaux

| Principe | Description |
|----------|-------------|
| **Drôle malgré lui** | Le bot n'essaie JAMAIS de faire rire |
| **Pertinence > Présence** | Mieux vaut ne pas commenter que forcer |
| **Variété** | Jamais deux commentaires avec la même structure |
| **Authenticité** | Le bot croit vraiment ce qu'il dit |
| **Self-filtering** | Le bot sait quand NE PAS commenter |
