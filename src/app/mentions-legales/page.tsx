import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions légales - Skill Issue',
  description: 'Mentions légales du site Skill Issue',
}

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-8">Mentions légales</h1>

      <div className="prose prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Éditeur du site</h2>
          <p className="text-muted">
            <strong className="text-foreground">[VOTRE NOM]</strong><br />
            Email : <a href="mailto:[VOTRE EMAIL]" className="text-accent hover:underline">[VOTRE EMAIL]</a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Directeur de la publication</h2>
          <p className="text-muted">
            [VOTRE NOM]
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Hébergement</h2>
          <p className="text-muted">
            <strong className="text-foreground">Vercel Inc.</strong><br />
            440 N Barranca Ave #4133<br />
            Covina, CA 91723<br />
            États-Unis
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Nature du site</h2>
          <p className="text-muted">
            Skill Issue est un site satirique et humoristique traitant de l&apos;actualité du jeu vidéo.
            Tous les articles publiés sont fictifs et à but parodique.
            Toute ressemblance avec des événements réels serait purement fortuite (ou pas).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Propriété intellectuelle</h2>
          <p className="text-muted">
            Le contenu de ce site (textes, images, logo) est protégé par le droit d&apos;auteur.
            Toute reproduction sans autorisation est interdite.
          </p>
          <p className="text-muted mt-2">
            Les marques et logos des entreprises mentionnées appartiennent à leurs propriétaires respectifs.
            Leur utilisation sur ce site relève de la parodie et du droit à la caricature.
          </p>
        </section>
      </div>
    </div>
  )
}
