// Formater la date relative (utilisable côté client)
export function formatRelativeDate(dateStr: string, locale: 'fr' | 'en'): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (locale === 'fr') {
    if (diffMins < 1) return "à l'instant"
    if (diffMins < 60) return `il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`
    if (diffHours < 24) return `il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`
    if (diffDays < 7) return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`
    return date.toLocaleDateString('fr-FR')
  } else {
    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString('en-US')
  }
}
