export type Locale = 'fr' | 'en'

export const defaultLocale: Locale = 'fr'

export const translations = {
  fr: {
    // Header
    tagline: "L'actu gaming qu'on mérite",
    articles: 'Articles',
    about: 'À propos',

    // Homepage
    allCategories: 'Tous',
    latestArticles: 'Derniers articles',
    mostCommented: 'Les plus commentés',
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

    // Likes
    beFirstToLike: 'Soyez le premier a aimer',
    likes: 'aime',
    likePlural: 'aiment',
    andName: 'et {name}',
    andOneLike: 'et 1 autre aiment',
    andOthersLike: 'et {count} autres aiment',

    // Report
    report: 'Signaler',
    reportThanks: 'Merci pour votre signalement !',

    // Footer
    disclaimer: 'Le contenu est géré par des développeurs <s>sous-payés</s> juniors. Certains ont été aperçus en train d\'ajouter des substances dans leur café. Restez donc vigilants lorsque vous nous citez dans vos sources.',

    // Categories
    categories: {
      aaa: 'AAA',
      indie: 'Indie',
      esports: 'Esports',
      moba: 'MOBA',
      fps: 'FPS',
      mmorpg: 'MMORPG',
      rpg: 'RPG',
      nintendo: 'Nintendo',
      playstation: 'PlayStation',
      xbox: 'Xbox',
      pc: 'PC',
      mobile: 'Mobile',
      'battle-royale': 'Battle Royale',
      survival: 'Survival',
      vr: 'VR',
      retro: 'Rétro',
      industry: 'Industrie',
      hardware: 'Hardware',
      streaming: 'Streaming',
      general: 'Gaming',
    },
  },
  en: {
    // Header
    tagline: "The gaming news we deserve",
    articles: 'Articles',
    about: 'About',

    // Homepage
    allCategories: 'All',
    latestArticles: 'Latest articles',
    mostCommented: 'Most commented',
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

    // Likes
    beFirstToLike: 'Be the first to like',
    likes: 'likes this',
    likePlural: 'like this',
    andName: 'and {name}',
    andOneLike: 'and 1 other like this',
    andOthersLike: 'and {count} others like this',

    // Report
    report: 'Report',
    reportThanks: 'Thanks for your report!',

    // Footer
    disclaimer: 'Content is managed by <s>underpaid</s> junior developers. Some have been spotted adding substances to their coffee. Stay vigilant when citing us in your sources.',

    // Categories
    categories: {
      aaa: 'AAA',
      indie: 'Indie',
      esports: 'Esports',
      moba: 'MOBA',
      fps: 'FPS',
      mmorpg: 'MMORPG',
      rpg: 'RPG',
      nintendo: 'Nintendo',
      playstation: 'PlayStation',
      xbox: 'Xbox',
      pc: 'PC',
      mobile: 'Mobile',
      'battle-royale': 'Battle Royale',
      survival: 'Survival',
      vr: 'VR',
      retro: 'Retro',
      industry: 'Industry',
      hardware: 'Hardware',
      streaming: 'Streaming',
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
