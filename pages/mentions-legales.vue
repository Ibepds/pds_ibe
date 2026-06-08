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
  <div class="py-12">
    <div class="mx-auto max-w-3xl px-4 lg:px-8">
      <h1 class="section-title gradient-text">Mentions légales</h1>

      <div class="mt-8 space-y-8 text-gray-300 leading-relaxed">
        <section class="card-glow p-6">
          <h2 class="font-display text-xl font-bold text-white">Éditeur du site</h2>
          <p class="mt-3">
            Le site <strong class="text-white">pdshumanity.fr</strong> est édité par
            <strong class="text-white">PDS Records / Ibé</strong>.
          </p>
          <ul class="mt-3 space-y-1 text-sm text-gray-400">
            <li>Forme juridique : <span class="text-gray-300">{{ val(legal?.editorLegalForm) }}</span></li>
            <li>Adresse : <span class="text-gray-300">{{ val(legal?.editorAddress) }}</span></li>
            <li>SIRET : <span class="text-gray-300">{{ val(legal?.editorSiret) }}</span></li>
            <li>E-mail : <span class="text-gray-300">{{ val(legal?.contactEmail) }}</span></li>
            <li>Directeur de la publication : <span class="text-gray-300">{{ val(legal?.publicationDirector) }}</span></li>
          </ul>
        </section>

        <section class="card-glow p-6">
          <h2 class="font-display text-xl font-bold text-white">Hébergement</h2>
          <p class="mt-3 text-sm text-gray-400">
            Le site est hébergé par <span class="text-gray-300">{{ val(legal?.hostName) }}</span>,
            <span class="text-gray-300">{{ val(legal?.hostAddress) }}</span>.
          </p>
          <p class="mt-2 text-sm text-gray-400">
            Les données applicatives (réservations, messages) sont stockées via Google Firebase
            (Google Ireland Limited / Google LLC).
          </p>
        </section>

        <section class="card-glow p-6">
          <h2 class="font-display text-xl font-bold text-white">Propriété intellectuelle</h2>
          <p class="mt-3 text-sm text-gray-400">
            L'ensemble des contenus présents sur ce site (textes, visuels, logos, musiques) est
            protégé par le droit d'auteur et reste la propriété de PDS Records / Ibé ou de leurs
            ayants droit respectifs. Toute reproduction ou utilisation sans autorisation préalable
            est interdite.
          </p>
        </section>

        <section class="card-glow p-6">
          <h2 class="font-display text-xl font-bold text-white">Données personnelles & cookies</h2>
          <p class="mt-3 text-sm text-gray-400">
            Le traitement de vos données personnelles est détaillé dans notre
            <NuxtLink to="/confidentialite" class="text-primary-light hover:underline">politique de confidentialité</NuxtLink>.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>
