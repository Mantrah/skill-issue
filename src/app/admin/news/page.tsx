export default function NewsAdminPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">News RSS</h1>
        <p className="text-muted text-sm mt-1">Collecte d&apos;actualites gaming</p>
      </div>

      {/* Coming soon placeholder */}
      <div className="text-center py-16 bg-card border border-card-border rounded-xl">
        <div className="text-4xl mb-4">📰</div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h2>
        <p className="text-muted max-w-md mx-auto">
          Le systeme de collecte d&apos;actualites RSS sera disponible dans une prochaine version.
          Il permettra de :
        </p>
        <ul className="text-sm text-muted mt-4 space-y-1">
          <li>• Configurer des flux RSS (IGN, Kotaku, PC Gamer...)</li>
          <li>• Scorer les news par potentiel satirique</li>
          <li>• Alimenter automatiquement le topic-finder</li>
        </ul>
      </div>

      {/* Sources config preview */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Sources prevues</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'IGN', url: 'https://www.ign.com/rss/articles/feed', lang: 'en' },
            { name: 'Kotaku', url: 'https://kotaku.com/rss', lang: 'en' },
            { name: 'PC Gamer', url: 'https://www.pcgamer.com/rss/', lang: 'en' },
            { name: 'JeuxVideo.com', url: 'https://www.jeuxvideo.com/rss/rss.xml', lang: 'fr' },
          ].map(source => (
            <div key={source.name} className="p-4 bg-card border border-card-border rounded-lg opacity-50">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{source.name}</span>
                <span className="text-xs px-2 py-0.5 bg-card-border rounded text-muted">{source.lang}</span>
              </div>
              <p className="text-xs text-muted mt-1 truncate">{source.url}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
