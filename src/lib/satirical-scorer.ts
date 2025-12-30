import newsSourcesData from '@/data/news-sources.json'

export interface SatiricalKeywords {
  high: string[]
  medium: string[]
  low: string[]
}

const keywords = newsSourcesData.satiricalKeywords as SatiricalKeywords

export interface ScoreResult {
  score: number // 0-10
  reasons: string[]
  category: 'excellent' | 'good' | 'average' | 'low'
}

/**
 * Score une news par son potentiel satirique
 * @param title - Le titre de la news
 * @param description - La description/extrait de la news
 * @returns Score et raisons
 */
export function scoreSatiricalPotential(title: string, description: string = ''): ScoreResult {
  const content = `${title} ${description}`.toLowerCase()
  const reasons: string[] = []
  let score = 0

  // Check high-value keywords (3 points each, max 6 points)
  let highMatches = 0
  for (const keyword of keywords.high) {
    if (content.includes(keyword.toLowerCase())) {
      if (highMatches < 2) {
        score += 3
        reasons.push(keyword)
      }
      highMatches++
    }
  }

  // Check medium-value keywords (1.5 points each, max 3 points)
  let mediumMatches = 0
  for (const keyword of keywords.medium) {
    if (content.includes(keyword.toLowerCase())) {
      if (mediumMatches < 2) {
        score += 1.5
        reasons.push(keyword)
      }
      mediumMatches++
    }
  }

  // Check low-value keywords (0.5 points each, max 1 point)
  let lowMatches = 0
  for (const keyword of keywords.low) {
    if (content.includes(keyword.toLowerCase())) {
      if (lowMatches < 2) {
        score += 0.5
        reasons.push(keyword)
      }
      lowMatches++
    }
  }

  // Bonus for specific patterns
  const patterns = [
    { regex: /(\$|€|£)\d+/i, bonus: 1, reason: 'money-mentioned' },
    { regex: /\b(billions?|millions?)\b/i, bonus: 1.5, reason: 'big-numbers' },
    { regex: /\b(EA|Ubisoft|Activision|Blizzard)\b/i, bonus: 0.5, reason: 'controversial-publisher' },
    { regex: /\b(bethesda|todd howard)\b/i, bonus: 1, reason: 'it-just-works' },
    { regex: /\b(again|another|yet another)\b/i, bonus: 0.5, reason: 'repetition' },
    { regex: /\b(worst|disaster|failure|flop)\b/i, bonus: 1.5, reason: 'negative-sentiment' },
    { regex: /\?$/, bonus: 0.5, reason: 'question-title' },
  ]

  for (const pattern of patterns) {
    if (pattern.regex.test(content)) {
      score += pattern.bonus
      if (!reasons.includes(pattern.reason)) {
        reasons.push(pattern.reason)
      }
    }
  }

  // Normalize to 0-10
  score = Math.min(10, Math.round(score * 10) / 10)

  // Determine category
  let category: ScoreResult['category']
  if (score >= 7) {
    category = 'excellent'
  } else if (score >= 5) {
    category = 'good'
  } else if (score >= 3) {
    category = 'average'
  } else {
    category = 'low'
  }

  return { score, reasons, category }
}

/**
 * Retourne tous les mots-cles satiriques
 */
export function getAllKeywords(): SatiricalKeywords {
  return keywords
}
