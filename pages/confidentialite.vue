<script setup lang="ts">
import { MOCK_LEGAL } from '~/utils/mockData'

usePageSeo({
  title: 'Politique de confidentialité — PDS Humanity',
  description:
    'Politique de confidentialité de PDS Humanity : données collectées, finalités, durée de conservation et vos droits (RGPD).',
})

const { single: legal } = useFirestoreCollection(
  'content',
  [{ id: 'legal', ...MOCK_LEGAL }],
  { docId: 'legal' },
)

const val = (v?: string) => (v && v.trim() ? v : 'À préciser')
</script>

<template>
  <div class="home-container">
    <section class="py-12 md:py-16">
      <PageHeader title="Politique de confidentialité" />
      <p class="mt-2 text-sm text-white/60">Dernière mise à jour : {{ val(legal?.privacyUpdatedAt) }}</p>
    </section>

    <section class="section-divider py-12 md:py-16">
      <div class="mx-auto max-w-3xl space-y-10 leading-relaxed text-white/80">
        <article v-reveal>
          <h2 class="font-display text-xl font-bold uppercase text-white">1. Responsable du traitement</h2>
          <p class="mt-3 text-sm text-white/60">
            Les données collectées sur ce site sont traitées par <strong class="text-white">PDS Records / Ibé</strong>,
            responsable du traitement. Pour toute question : <span class="text-white/80">{{ val(legal?.contactEmail) }}</span>.
          </p>
        </article>

        <article v-reveal class="border-t border-white/15 pt-10">
          <h2 class="font-display text-xl font-bold uppercase text-white">2. Données collectées</h2>
          <p class="mt-3 text-sm text-white/60">Nous collectons uniquement les données que vous nous transmettez via nos formulaires :</p>
          <ul class="mt-3 space-y-2 text-sm text-white/60">
            <li>
              <strong class="text-white">Formulaire de contact :</strong> nom/pseudo, adresse e-mail, objet et contenu du message.
            </li>
            <li>
              <strong class="text-white">Réservation de freestyle :</strong> nom/pseudo, adresse e-mail, réseaux sociaux,
              créneau souhaité, lien vers un morceau et message éventuel.
            </li>
          </ul>
        </article>

        <article v-reveal class="border-t border-white/15 pt-10">
          <h2 class="font-display text-xl font-bold uppercase text-white">3. Finalités & base légale</h2>
          <p class="mt-3 text-sm text-white/60">
            Vos données sont utilisées pour traiter vos demandes (contact) et organiser votre
            participation aux freestyles (gestion des créneaux, validation, communication par e-mail).
            La base légale du traitement est votre <strong class="text-white">consentement</strong>,
            recueilli lors de l'envoi du formulaire.
          </p>
        </article>

        <article v-reveal class="border-t border-white/15 pt-10">
          <h2 class="font-display text-xl font-bold uppercase text-white">4. Durée de conservation</h2>
          <p class="mt-3 text-sm text-white/60">
            Vos données sont conservées pour la durée nécessaire à l'organisation de l'événement,
            puis supprimées au maximum <strong class="text-white">{{ val(legal?.retentionMonths) }} mois</strong> après la fin de
            l'édition concernée, sauf obligation légale contraire.
          </p>
        </article>

        <article v-reveal class="border-t border-white/15 pt-10">
          <h2 class="font-display text-xl font-bold uppercase text-white">5. Destinataires & hébergement</h2>
          <p class="mt-3 text-sm text-white/60">
            Vos données sont accessibles uniquement à l'équipe organisatrice de PDS Humanity. Elles
            ne sont ni vendues, ni cédées à des tiers à des fins commerciales. Elles sont stockées via
            <strong class="text-white">Google Firebase (Firestore)</strong>. Un transfert de données
            hors Union européenne peut intervenir ; Google met en œuvre des garanties appropriées
            (clauses contractuelles types).
          </p>
        </article>

        <article v-reveal class="border-t border-white/15 pt-10">
          <h2 class="font-display text-xl font-bold uppercase text-white">6. Cookies</h2>
          <p class="mt-3 text-sm text-white/60">
            Le site utilise des cookies strictement nécessaires à son fonctionnement (notamment pour
            l'espace d'administration). Des outils de mesure d'audience peuvent être utilisés
            uniquement après votre consentement, recueilli via le bandeau cookies. Vous pouvez
            modifier votre choix à tout moment.
          </p>
        </article>

        <article v-reveal class="border-t border-white/15 pt-10">
          <h2 class="font-display text-xl font-bold uppercase text-white">7. Vos droits</h2>
          <p class="mt-3 text-sm text-white/60">
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement,
            d'opposition, de limitation et de portabilité de vos données. Pour exercer ces droits,
            contactez-nous à <span class="text-white/80">{{ val(legal?.contactEmail) }}</span>.
          </p>
          <p class="mt-2 text-sm text-white/60">
            Vous pouvez également introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener" class="text-primary-light hover:underline">www.cnil.fr</a>).
          </p>
        </article>
      </div>
    </section>
  </div>
</template>
