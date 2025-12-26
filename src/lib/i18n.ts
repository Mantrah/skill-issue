export type Locale = 'fr' | 'en'

export const defaultLocale: Locale = 'fr'

export const translations = {
  fr: {
    // Header
    tagline: "L'actu gaming qu'on mérite (ou pas)",
    articles: 'Articles',
    about: 'À propos',

    // Homepage
    allCategories: 'Tous',
    latestArticles: 'Derniers articles',
    noArticles: 'Aucun article pour le moment.',
    noArticlesInCategory: 'Aucun article dans cette catégorie.',

    // Article
    backToArticles: 'Retour aux articles',
    share: 'Partager :',
    copyLink: 'Copier le lien',
    linkCopied: 'Lien copié !',

    // Comments
    comments: 'Commentaires',
    loginToComment: 'Connectez-vous pour commenter...',
    comment: 'Commenter',
    reply: 'Répondre',

    // Report
    report: 'Signaler',
    reportThanks: 'Merci pour votre signalement !',

    // Footer
    disclaimer: 'Le contenu est géré par des développeurs <s>sous-payés</s> juniors. Certains ont été aperçus en train d\'ajouter des substances dans leur café. Restez donc vigilants lorsque vous nous citez dans vos sources.',

    // Categories
    categories: {
      nintendo: 'Nintendo',
      ea: 'EA Sports',
      ubisoft: 'Ubisoft',
      sony: 'PlayStation',
      microsoft: 'Xbox',
      general: 'Gaming',
    },
  },
  en: {
    // Header
    tagline: "The gaming news we deserve (or not)",
    articles: 'Articles',
    about: 'About',

    // Homepage
    allCategories: 'All',
    latestArticles: 'Latest articles',
    noArticles: 'No articles yet.',
    noArticlesInCategory: 'No articles in this category.',

    // Article
    backToArticles: 'Back to articles',
    share: 'Share:',
    copyLink: 'Copy link',
    linkCopied: 'Link copied!',

    // Comments
    comments: 'Comments',
    loginToComment: 'Log in to comment...',
    comment: 'Comment',
    reply: 'Reply',

    // Report
    report: 'Report',
    reportThanks: 'Thanks for your report!',

    // Footer
    disclaimer: 'Content is managed by <s>underpaid</s> junior developers. Some have been spotted adding substances to their coffee. Stay vigilant when citing us in your sources.',

    // Categories
    categories: {
      nintendo: 'Nintendo',
      ea: 'EA Sports',
      ubisoft: 'Ubisoft',
      sony: 'PlayStation',
      microsoft: 'Xbox',
      general: 'Gaming',
    },
  },
} as const

export type Translations = (typeof translations)[Locale]

export function getTranslations(locale: Locale): Translations {
  return translations[locale]
}

export function formatDateLocale(dateStr: string, locale: Locale): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
