import fakeLikersData from '@/data/fake-likers.json'

export interface Liker {
  id: string
  name: string
  avatar: string | null
  triggers: string[]
}

export interface LikersData {
  likers: Liker[]
}

const data = fakeLikersData as LikersData

/**
 * Trouve les likers qui matchent avec un contenu donné
 * @param content - Le texte à analyser (titre + contenu de l'article)
 * @param tags - Les tags de l'article
 * @param maxLikers - Nombre max de likers à retourner
 * @returns Liste des likers qui matchent
 */
export function matchLikers(
  content: string,
  tags: string[] = [],
  maxLikers: number = 5
): Liker[] {
  const contentLower = content.toLowerCase()
  const tagsLower = tags.map(t => t.toLowerCase())

  // Score chaque liker
  const scoredLikers = data.likers.map(liker => {
    let score = 0

    for (const trigger of liker.triggers) {
      const triggerLower = trigger.toLowerCase()

      // Match dans le contenu
      if (contentLower.includes(triggerLower)) {
        score += 2
      }

      // Match dans les tags (bonus)
      if (tagsLower.some(tag => tag.includes(triggerLower) || triggerLower.includes(tag))) {
        score += 3
      }
    }

    return { liker, score }
  })

  // Trier par score décroissant et prendre les meilleurs
  return scoredLikers
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxLikers)
    .map(({ liker }) => liker)
}

/**
 * Génère un nombre de likes aléatoire mais déterministe basé sur le slug
 * @param slug - Le slug de l'article
 * @param baseMin - Minimum de likes
 * @param baseMax - Maximum de likes
 */
export function generateLikeCount(slug: string, baseMin: number = 15, baseMax: number = 150): number {
  // Hash simple du slug pour avoir un nombre déterministe
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    const char = slug.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }

  // Convertir en nombre dans la plage voulue
  const range = baseMax - baseMin
  const normalized = Math.abs(hash) % range
  return baseMin + normalized
}

/**
 * Retourne tous les likers disponibles
 */
export function getAllLikers(): Liker[] {
  return data.likers
}

/**
 * Trouve un liker par son ID
 */
export function getLikerById(id: string): Liker | undefined {
  return data.likers.find(l => l.id === id)
}
