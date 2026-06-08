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
  <div class="py-12">
    <div class="mx-auto max-w-4xl px-4 lg:px-8">
      <h1 class="section-title gradient-text">Présentation</h1>
      <p class="mt-2 text-gray-400">PDS Humanity — Musique & Solidarité</p>

      <div class="mt-10 space-y-10">
        <div class="card-glow p-8">
          <h2 class="font-display text-2xl font-bold text-white">L'événement</h2>
          <p class="mt-4 whitespace-pre-line text-gray-300 leading-relaxed">{{ content?.eventText }}</p>
        </div>

        <div class="card-glow p-8">
          <h2 class="font-display text-2xl font-bold text-white">Le concept</h2>
          <div class="mt-4 grid gap-6 md:grid-cols-3">
            <div
              v-for="(card, i) in content?.conceptCards ?? []"
              :key="i"
              class="rounded-xl bg-white/5 p-5"
            >
              <div class="text-3xl">{{ card.icon }}</div>
              <h3 class="mt-3 font-semibold text-white">{{ card.title }}</h3>
              <p class="mt-2 text-sm text-gray-400">{{ card.text }}</p>
            </div>
          </div>
        </div>

        <div class="card-glow p-8">
          <h2 class="font-display text-2xl font-bold text-white">Le porteur du projet</h2>
          <p class="mt-4 whitespace-pre-line text-gray-300 leading-relaxed">{{ content?.porteurText }}</p>
        </div>

        <div class="card-glow p-8">
          <h2 class="font-display text-2xl font-bold text-white">Les plateformes de diffusion</h2>
          <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="(p, i) in content?.platforms ?? []"
              :key="i"
              class="rounded-xl bg-white/5 p-4 text-center"
            >
              <div class="text-2xl">{{ p.icon }}</div>
              <p class="mt-2 font-semibold text-white" >{{ p.name }}</p>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-4">
          <PrimaryButton to="/donate">Faire un don</PrimaryButton>
          <PrimaryButton to="/freestyles" variant="outline">Réserver un freestyle</PrimaryButton>
          <PrimaryButton to="/planning" variant="outline">Voir le programme</PrimaryButton>
        </div>
      </div>
    </div>
  </div>
</template>
