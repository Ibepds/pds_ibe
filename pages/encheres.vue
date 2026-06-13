<script setup lang="ts">
import { MOCK_ENCHERES } from '~/utils/mockData'
import { DA } from '~/utils/daAssets'

usePageSeo({
  title: 'Enchères solidaires — PDS Humanity',
  description:
    'Participez aux ventes aux enchères solidaires de PDS Humanity en direct sur eBay Live. Des lots exclusifs au profit des associations partenaires.',
})

const { event, loading } = useEvent()

const { single: encheres } = useFirestoreCollection(
  'content',
  [{ id: 'encheres', ...MOCK_ENCHERES }],
  { docId: 'encheres' },
)
</script>

<template>
  <div class="home-container">
    <section class="py-12 md:py-16">
      <PageHeader
        title="Enchères solidaires"
        lead="Des lots exclusifs pour soutenir nos associations partenaires"
      />
    </section>

    <section class="section-divider py-12 md:py-16">
      <h2 v-reveal class="section-heading !justify-start">
        <ChalkHeart />
        Comment ça fonctionne ?
      </h2>
      <p v-reveal class="mt-6 whitespace-pre-line leading-relaxed text-white/80">
        {{ encheres?.intro }}
      </p>
    </section>

    <section class="section-divider py-12 md:py-16">
      <div class="grid gap-10 md:grid-cols-3">
        <div v-reveal class="text-center">
          <ChalkImage :src="DA.picto.trophy" class="mx-auto h-14 w-14" />
          <h3 class="mt-4 font-display text-sm font-bold uppercase text-white">Lots exclusifs</h3>
          <p class="mt-2 text-sm text-white/60">
            Objets dédicacés, expériences uniques, pièces de collection.
          </p>
        </div>
        <div v-reveal class="text-center">
          <ChalkImage :src="DA.picto.plane" class="mx-auto h-14 w-14" />
          <h3 class="mt-4 font-display text-sm font-bold uppercase text-white">eBay Live</h3>
          <p class="mt-2 text-sm text-white/60">
            Les enchères se déroulent en direct sur eBay Live.
          </p>
        </div>
        <div v-reveal class="text-center">
          <ChalkImage :src="DA.picto.gift" class="mx-auto h-14 w-14" />
          <h3 class="mt-4 font-display text-sm font-bold uppercase text-white">100% solidaire</h3>
          <p class="mt-2 text-sm text-white/60">
            Tous les fonds sont intégralement reversés aux associations.
          </p>
        </div>
      </div>
    </section>

    <section class="section-divider py-12 md:py-16">
      <h2 v-reveal class="section-heading">
        <ChalkHeart />
        Aperçu des lots
      </h2>
      <ul v-if="encheres?.lots?.length" v-reveal class="mt-8 divide-y divide-white/15">
        <li
          v-for="(lot, i) in encheres.lots"
          :key="i"
          class="flex items-start gap-4 py-4"
        >
          <ChalkImage :src="DA.picto.gift" class="h-10 w-10 shrink-0" />
          <div>
            <h3 class="font-display text-sm font-bold uppercase text-white">{{ lot.title }}</h3>
            <p class="mt-1 text-sm text-white/60">{{ lot.description }}</p>
          </div>
        </li>
      </ul>
      <p v-else v-reveal class="mt-6 text-center text-white/60">
        Les lots seront dévoilés prochainement. Suivez-nous sur les réseaux sociaux !
      </p>
    </section>

    <section class="section-divider py-12 md:py-16">
      <h2 v-reveal class="section-heading !justify-start">
        <ChalkHeart />
        Planning des enchères
      </h2>
      <p v-reveal class="mt-6 whitespace-pre-line text-center text-white/60">
        {{ encheres?.planningText }}
      </p>
    </section>

    <section class="section-divider py-12 text-center md:py-16">
      <h2 v-reveal class="section-heading">
        <ChalkGavel />
        Rejoindre les enchères en direct
      </h2>
      <p v-reveal class="mt-4 text-white/60">
        Le lien eBay Live sera disponible ici le jour de l'événement.
      </p>
      <div v-reveal class="mt-8">
        <PrimaryButton
          v-if="event?.ebayLiveUrl"
          :href="event.ebayLiveUrl"
          external
        >
          <ChalkGavel />
          Accéder aux enchères eBay Live
        </PrimaryButton>
        <div v-else-if="loading" class="mx-auto h-10 w-48 animate-pulse bg-white/10" />
        <p v-else class="text-sm uppercase tracking-wide text-white/50">
          Disponible le 27 juin à partir de 18h
        </p>
      </div>
    </section>
  </div>
</template>
