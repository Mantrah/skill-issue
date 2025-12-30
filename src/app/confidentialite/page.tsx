import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de confidentialité - Skill Issue',
  description: 'Politique de confidentialité du site Skill Issue',
}

export default function ConfidentialitePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-8">Politique de confidentialité</h1>

      <div className="prose prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Données collectées</h2>
          <p className="text-muted">
            Skill Issue ne collecte <strong className="text-foreground">aucune donnée personnelle</strong>.
          </p>
          <p className="text-muted mt-2">
            Nous n&apos;utilisons pas de formulaires d&apos;inscription, de newsletter, ni de système de commentaires
            nécessitant une identification.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Cookies</h2>
          <p className="text-muted">
            Ce site utilise uniquement des <strong className="text-foreground">cookies techniques</strong> nécessaires
            au bon fonctionnement du site :
          </p>
          <ul className="list-disc list-inside text-muted mt-2 space-y-1">
            <li>Préférence de langue (FR/EN)</li>
          </ul>
          <p className="text-muted mt-4">
            Ces cookies ne nécessitent pas votre consentement car ils sont strictement nécessaires
            à la fourniture du service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Analyse d&apos;audience</h2>
          <p className="text-muted">
            Nous n&apos;utilisons <strong className="text-foreground">aucun outil d&apos;analyse d&apos;audience</strong> (pas de Google Analytics,
            ni aucun autre tracker).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Services tiers</h2>
          <p className="text-muted">
            Le site est hébergé par <strong className="text-foreground">Vercel</strong>, qui peut collecter
            des données techniques (adresse IP, logs serveur) dans le cadre de son service d&apos;hébergement.
            Consultez la <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >politique de confidentialité de Vercel</a> pour plus d&apos;informations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Vos droits</h2>
          <p className="text-muted">
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression
            de vos données personnelles.
          </p>
          <p className="text-muted mt-2">
            Étant donné que nous ne collectons aucune donnée, il n&apos;y a rien à supprimer.
            Si vous avez des questions, contactez-nous à <a
              href="mailto:[VOTRE EMAIL]"
              className="text-accent hover:underline"
            >[VOTRE EMAIL]</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Mise à jour</h2>
          <p className="text-muted">
            Cette politique de confidentialité peut être mise à jour. La date de dernière modification
            sera indiquée en haut de cette page.
          </p>
          <p className="text-muted mt-2 text-sm">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </section>
      </div>
    </div>
  )
}
