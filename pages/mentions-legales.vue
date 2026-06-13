<script setup lang="ts">
import { MOCK_LEGAL } from '~/utils/mockData'

usePageSeo({
  title: 'Mentions légales — PDS Humanity',
  description: 'Mentions légales du site PDS Humanity (éditeur, hébergeur, propriété intellectuelle).',
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
      <PageHeader title="Mentions légales" />
    </section>

    <section class="section-divider py-12 md:py-16">
      <div class="mx-auto max-w-3xl space-y-10 leading-relaxed text-white/80">
        <article v-reveal>
          <h2 class="font-display text-xl font-bold uppercase text-white">Éditeur du site</h2>
          <p class="mt-3">
            Le site <strong class="text-white">pdshumanity.fr</strong> est édité par
            <strong class="text-white">PDS Records / Ibé</strong>.
          </p>
          <ul class="mt-3 space-y-1 text-sm text-white/60">
            <li>Forme juridique : <span class="text-white/80">{{ val(legal?.editorLegalForm) }}</span></li>
            <li>Adresse : <span class="text-white/80">{{ val(legal?.editorAddress) }}</span></li>
            <li>SIRET : <span class="text-white/80">{{ val(legal?.editorSiret) }}</span></li>
            <li>E-mail : <span class="text-white/80">{{ val(legal?.contactEmail) }}</span></li>
            <li>Directeur de la publication : <span class="text-white/80">{{ val(legal?.publicationDirector) }}</span></li>
          </ul>
        </article>

        <article v-reveal class="border-t border-white/15 pt-10">
          <h2 class="font-display text-xl font-bold uppercase text-white">Hébergement</h2>
          <p class="mt-3 text-sm text-white/60">
            Le site est hébergé par <span class="text-white/80">{{ val(legal?.hostName) }}</span>,
            <span class="text-white/80">{{ val(legal?.hostAddress) }}</span>.
          </p>
          <p class="mt-2 text-sm text-white/60">
            Les données applicatives (réservations, messages) sont stockées via Google Firebase
            (Google Ireland Limited / Google LLC).
          </p>
        </article>

        <article v-reveal class="border-t border-white/15 pt-10">
          <h2 class="font-display text-xl font-bold uppercase text-white">Propriété intellectuelle</h2>
          <p class="mt-3 text-sm text-white/60">
            L'ensemble des contenus présents sur ce site (textes, visuels, logos, musiques) est
            protégé par le droit d'auteur et reste la propriété de PDS Records / Ibé ou de leurs
            ayants droit respectifs. Toute reproduction ou utilisation sans autorisation préalable
            est interdite.
          </p>
        </article>

        <article v-reveal class="border-t border-white/15 pt-10">
          <h2 class="font-display text-xl font-bold uppercase text-white">Données personnelles & cookies</h2>
          <p class="mt-3 text-sm text-white/60">
            Le traitement de vos données personnelles est détaillé dans notre
            <NuxtLink to="/confidentialite" class="text-primary-light hover:underline">politique de confidentialité</NuxtLink>.
          </p>
        </article>
      </div>
    </section>
  </div>
</template>
