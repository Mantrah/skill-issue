/**
 * Comment Scheduler - Timing intelligent pour les commentaires de bots
 *
 * Chaque bot a une fenêtre horaire réaliste. Si l'article est publié
 * hors fenêtre, le commentaire est reporté à la prochaine fenêtre.
 */

export interface BotConfig {
  id: string
  name: string
  author: string // Nom affiché dans les commentaires
  windowStart: number // Heure de début (0-23)
  windowEnd: number // Heure de fin (0-23, peut être < start pour les plages nocturnes)
  baseDelayMinutes: number // Délai de base après publication
  varianceMinutes: number // Variance +/-
  probability: number // Probabilité de commenter (0-1)
}

// Configuration des 4 bots existants
export const BOT_CONFIGS: BotConfig[] = [
  {
    id: 'boomer-gamer',
    name: 'Michel_DuBureau',
    author: 'Michel_DuBureau',
    windowStart: 9,
    windowEnd: 18,
    baseDelayMinutes: 5,
    varianceMinutes: 10,
    probability: 0.8
  },
  {
    id: 'retro-gamer',
    name: 'RetroGamer_1987',
    author: 'RetroGamer_1987',
    windowStart: 19,
    windowEnd: 23,
    baseDelayMinutes: 30,
    varianceMinutes: 20,
    probability: 0.7
  },
  {
    id: 'pro-gamer',
    name: 'xX_ProGamer_Xx',
    author: 'xX_ProGamer_Xx',
    windowStart: 14,
    windowEnd: 4, // Jusqu'à 4h du matin (plage nocturne)
    baseDelayMinutes: 90,
    varianceMinutes: 45,
    probability: 0.6
  },
  {
    id: 'e-girl',
    name: 'xKawaiiGamer_Chan',
    author: 'xKawaiiGamer_Chan',
    windowStart: 10,
    windowEnd: 2, // Jusqu'à 2h du matin
    baseDelayMinutes: 120,
    varianceMinutes: 60,
    probability: 0.5
  }
]

/**
 * Vérifie si une heure est dans la fenêtre du bot
 */
export function isInWindow(hour: number, windowStart: number, windowEnd: number): boolean {
  if (windowEnd >= windowStart) {
    // Fenêtre normale (ex: 9h-18h)
    return hour >= windowStart && hour < windowEnd
  } else {
    // Fenêtre nocturne (ex: 14h-4h = 14h->23h59 OU 0h->4h)
    return hour >= windowStart || hour < windowEnd
  }
}

/**
 * Trouve la prochaine heure valide dans la fenêtre du bot
 */
export function getNextWindowStart(currentDate: Date, windowStart: number, windowEnd: number): Date {
  const result = new Date(currentDate)
  const currentHour = result.getHours()

  if (isInWindow(currentHour, windowStart, windowEnd)) {
    // Déjà dans la fenêtre
    return result
  }

  // Trouver le prochain windowStart
  if (currentHour < windowStart) {
    // Le windowStart est plus tard dans la journée
    result.setHours(windowStart, 0, 0, 0)
  } else {
    // Le windowStart est demain
    result.setDate(result.getDate() + 1)
    result.setHours(windowStart, 0, 0, 0)
  }

  return result
}

/**
 * Génère une variance aléatoire
 */
export function getRandomVariance(varianceMinutes: number): number {
  // Génère un nombre entre -variance et +variance
  return Math.floor(Math.random() * (varianceMinutes * 2 + 1)) - varianceMinutes
}

/**
 * Décide si un bot doit commenter (basé sur probabilité)
 */
export function shouldBotComment(probability: number): boolean {
  return Math.random() < probability
}

export interface ScheduledComment {
  botId: string
  botName: string
  author: string
  scheduledAt: Date
  willComment: boolean
}

/**
 * Planifie les commentaires pour tous les bots
 * @param articlePublishedAt - Date de publication de l'article
 * @returns Liste des commentaires planifiés
 */
export function scheduleComments(articlePublishedAt: Date): ScheduledComment[] {
  const scheduled: ScheduledComment[] = []

  for (const bot of BOT_CONFIGS) {
    const willComment = shouldBotComment(bot.probability)

    if (!willComment) {
      scheduled.push({
        botId: bot.id,
        botName: bot.name,
        author: bot.author,
        scheduledAt: articlePublishedAt,
        willComment: false
      })
      continue
    }

    // Calculer la date de publication du commentaire
    let scheduledAt = new Date(articlePublishedAt)
    const currentHour = scheduledAt.getHours()

    // Si hors fenêtre, reporter au début de la prochaine fenêtre
    if (!isInWindow(currentHour, bot.windowStart, bot.windowEnd)) {
      scheduledAt = getNextWindowStart(scheduledAt, bot.windowStart, bot.windowEnd)
    }

    // Ajouter le délai de base + variance
    const totalDelayMinutes = bot.baseDelayMinutes + getRandomVariance(bot.varianceMinutes)
    scheduledAt = new Date(scheduledAt.getTime() + totalDelayMinutes * 60 * 1000)

    scheduled.push({
      botId: bot.id,
      botName: bot.name,
      author: bot.author,
      scheduledAt,
      willComment: true
    })
  }

  // Trier par date croissante
  return scheduled.sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())
}

/**
 * Formate une date de planification pour affichage
 */
export function formatScheduledTime(date: Date, locale: 'fr' | 'en' = 'fr'): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }
  return date.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US', options)
}

/**
 * Récupère la config d'un bot par son ID
 */
export function getBotConfig(botId: string): BotConfig | undefined {
  return BOT_CONFIGS.find(b => b.id === botId)
}
