<script setup lang="ts">
import { MOCK_PRESENTATION } from '~/utils/mockData'

usePageSeo({
  title: 'Présentation — PDS Humanity',
  description:
    "Découvrez PDS Humanity : un marathon caritatif de 24h mêlant musique et solidarité, organisé par PDS Records / Ibé les 27 et 28 juin.",
})

const { single: content } = useFirestoreCollection(
  'content',
  [{ id: 'presentation', ...MOCK_PRESENTATION }],
  { docId: 'presentation' },
)
</script>

<template>
  <div class="home-container">
    <section class="py-12 md:py-16">
      <PageHeader
        title="Présentation"
        lead="PDS Humanity — Musique & Solidarité"
      />
    </section>

    <section class="section-divider py-12 md:py-16">
      <h2 v-reveal class="section-heading !justify-start">
        <ChalkHeart />
        L'événement
      </h2>
      <p v-reveal class="mt-6 whitespace-pre-line leading-relaxed text-white/80">
        {{ content?.eventText }}
      </p>
    </section>

    <section class="section-divider py-12 md:py-16">
      <h2 v-reveal class="section-heading">
        <ChalkHeart />
        Le concept
      </h2>
      <ul v-reveal class="mt-8 divide-y divide-white/15 md:grid md:grid-cols-3 md:gap-8 md:divide-y-0">
        <li
          v-for="(card, i) in content?.conceptCards ?? []"
          :key="i"
          class="py-6 md:py-0 md:text-center"
        >
          <div class="mx-auto flex h-14 w-14 items-center justify-center">
            <DaIcon :icon="card.icon" class="h-12 w-12" />
          </div>
          <h3 class="mt-3 font-display text-sm font-bold uppercase text-white">{{ card.title }}</h3>
          <p class="mt-2 text-sm text-white/60">{{ card.text }}</p>
        </li>
      </ul>
    </section>

    <section class="section-divider py-12 md:py-16">
      <h2 v-reveal class="section-heading !justify-start">
        <ChalkHeart />
        Le porteur du projet
      </h2>
      <p v-reveal class="mt-6 whitespace-pre-line leading-relaxed text-white/80">
        {{ content?.porteurText }}
      </p>
    </section>

    <section class="section-divider py-12 md:py-16">
      <h2 v-reveal class="section-heading">
        <ChalkHeart />
        Les plateformes de diffusion
      </h2>
      <div v-reveal class="mt-8 flex flex-wrap justify-center gap-x-12 gap-y-8">
        <div
          v-for="(p, i) in content?.platforms ?? []"
          :key="i"
          class="text-center"
        >
          <div class="mx-auto flex h-12 w-12 items-center justify-center">
            <DaIcon :icon="p.icon" class="h-10 w-10" />
          </div>
          <p class="mt-2 font-display text-sm font-bold uppercase text-white">{{ p.name }}</p>
        </div>
      </div>
    </section>

    <section class="section-divider py-12 md:py-16">
      <div v-reveal class="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6">
        <ChalkButton preset="donate" to="/donate" class="w-full max-w-[300px] sm:w-auto" />
        <PrimaryButton to="/freestyles" variant="outline" class="w-full max-w-[300px] sm:w-auto">
          Réserver un freestyle
        </PrimaryButton>
        <PrimaryButton to="/planning" variant="outline" class="w-full max-w-[300px] sm:w-auto">
          Voir le programme
        </PrimaryButton>
      </div>
    </section>
  </div>
</template>
