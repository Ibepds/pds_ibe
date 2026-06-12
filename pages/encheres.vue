<script setup lang="ts">
import { MOCK_ENCHERES } from '~/utils/mockData'

definePageMeta({ pageBackground: 'blue' })

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
  <div class="py-20 md:py-28">
    <div class="mx-auto max-w-4xl px-4 lg:px-8">
      <h1 v-reveal class="section-title gradient-text">Enchères solidaires</h1>
      <p class="accent-serif mt-4 text-lg text-ink/75 md:text-xl">Des lots exclusifs pour soutenir nos associations partenaires</p>

      <div class="mt-10 space-y-8">
        <div v-reveal class="card-glow p-8">
          <h2 class="font-display text-2xl font-bold text-ink">Comment ça fonctionne ?</h2>
          <p class="mt-4 whitespace-pre-line text-ink/80 leading-relaxed">{{ encheres?.intro }}</p>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          <div v-reveal class="card-glow p-6 text-center">
            <div class="text-4xl">🎤</div>
            <h3 class="mt-3 font-semibold text-ink">Lots exclusifs</h3>
            <p class="mt-2 text-sm text-ink/60">
              Objets dédicacés, expériences uniques, pièces de collection — les lots seront annoncés avant l'événement.
            </p>
          </div>
          <div v-reveal class="card-glow p-6 text-center">
            <div class="text-4xl">📱</div>
            <h3 class="mt-3 font-semibold text-ink">eBay Live</h3>
            <p class="mt-2 text-sm text-ink/60">
              Les enchères se déroulent en direct sur eBay Live. Créez votre compte eBay pour enchérir.
            </p>
          </div>
          <div v-reveal class="card-glow p-6 text-center">
            <div class="text-4xl">❤️</div>
            <h3 class="mt-3 font-semibold text-ink">100% solidaire</h3>
            <p class="mt-2 text-sm text-ink/60">
              Tous les fonds récoltés lors des enchères sont intégralement reversés aux associations.
            </p>
          </div>
        </div>

        <div v-reveal class="card-glow p-8">
          <h2 class="font-display text-xl font-bold text-ink">Aperçu des lots</h2>
          <div v-if="encheres?.lots?.length" class="mt-4 grid gap-4 sm:grid-cols-2">
            <div
              v-for="(lot, i) in encheres.lots"
              :key="i"
              class="rounded-xl bg-paper-alt p-5"
            >
              <h3 class="font-semibold text-ink">{{ lot.title }}</h3>
              <p class="mt-2 text-sm text-ink/60">{{ lot.description }}</p>
            </div>
          </div>
          <div v-else class="mt-4 rounded-xl bg-paper-alt p-6 text-center">
            <p class="text-ink/60">
              Les lots seront dévoilés prochainement. Suivez-nous sur les réseaux sociaux pour ne rien manquer !
            </p>
          </div>
        </div>

        <div v-reveal class="card-glow p-8">
          <h2 class="font-display text-xl font-bold text-ink">Planning des enchères</h2>
          <div class="mt-4 rounded-xl bg-paper-alt p-6 text-center">
            <p class="whitespace-pre-line text-ink/60">{{ encheres?.planningText }}</p>
          </div>
        </div>

        <div v-reveal class="card-glow p-8 text-center">
          <h2 class="font-display text-xl font-bold text-ink">Rejoindre les enchères en direct</h2>
          <p class="mt-3 text-ink/60">
            Le lien eBay Live sera disponible ici le jour de l'événement.
          </p>
          <div class="mt-6">
            <PrimaryButton
              v-if="event?.ebayLiveUrl"
              :href="event.ebayLiveUrl"
              external
            >
              Accéder aux enchères eBay Live
            </PrimaryButton>
            <div v-else-if="loading" class="h-10 w-48 mx-auto rounded-lg bg-white/10 animate-pulse" />
            <span v-else class="inline-block rounded-full border border-white/20 px-6 py-2 text-sm text-ink/60">
              Disponible le 27 juin à partir de 18h
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
