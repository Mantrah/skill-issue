import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-8xl font-black text-accent mb-4">404</h1>
      <h2 className="text-2xl font-bold text-foreground mb-4">
        Page introuvable
      </h2>
      <p className="text-muted mb-8 max-w-md">
        Cette page a probablement été supprimée par un développeur junior
        après avoir ajouté des &quot;substances&quot; à son café.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  )
}
