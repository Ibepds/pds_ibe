<script setup lang="ts">
import type { EventDoc } from '~/types'
import { formatDate } from '~/utils/format'

const props = defineProps<{
  event: EventDoc | null
  loading?: boolean
}>()
</script>

<template>
  <section class="relative overflow-hidden pt-28 pb-20">
    <!-- Léger assombrissement en bas pour la lisibilité du texte -->
    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent"
    />

    <div class="relative mx-auto max-w-7xl px-4 lg:px-8">
      <div v-if="loading" class="animate-pulse space-y-4">
        <div class="h-8 w-48 rounded bg-white/10" />
        <div class="h-16 w-full max-w-2xl rounded bg-white/10" />
        <div class="h-6 w-96 rounded bg-white/10" />
      </div>
      <div v-else class="animate-fade-in">
        <p
          class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm text-white backdrop-blur"
        >
          <span class="h-2 w-2 rounded-full bg-accent-green animate-pulse" />
          Organisé par {{ event?.organizerName ?? 'PDS Records / Ibé' }}
        </p>
        <h1 class="mt-6 font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)] md:text-7xl lg:text-8xl">
          {{ event?.heroTitle ?? event?.name }}
        </h1>
        <p class="accent-serif mt-5 max-w-2xl text-xl text-white/90 md:text-2xl">
          {{ event?.heroSubtitle ?? event?.tagline }}
        </p>
        <p v-if="event" class="mt-4 text-sm text-white/70">
          {{ formatDate(event.startDate) }} → {{ formatDate(event.endDate) }}
        </p>
        <div class="mt-8 flex flex-wrap gap-4">
          <PrimaryButton :href="event?.donationUrl" external>
            Faire un don
          </PrimaryButton>
          <PrimaryButton
            v-if="event?.isLive"
            :href="event.liveUrl"
            variant="outline"
            external
          >
            ▶ Regarder le live
          </PrimaryButton>
          <PrimaryButton v-else to="/planning" variant="outline">
            Voir le programme
          </PrimaryButton>
          <PrimaryButton to="/freestyles" variant="outline">
            Réserver un freestyle
          </PrimaryButton>
        </div>
        <div v-if="event?.isLive" class="mt-4 flex flex-wrap gap-3 text-sm text-gray-400">
          <span>Diffusion en direct :</span>
          <a v-if="event.liveUrl" :href="event.liveUrl" target="_blank" rel="noopener" class="text-primary-light hover:underline">Twitch</a>
          <a v-if="event.youtubeUrl" :href="event.youtubeUrl" target="_blank" rel="noopener" class="text-primary-light hover:underline">YouTube</a>
          <a v-if="event.tiktokUrl" :href="event.tiktokUrl" target="_blank" rel="noopener" class="text-primary-light hover:underline">TikTok</a>
          <a v-if="event.ebayLiveUrl" :href="event.ebayLiveUrl" target="_blank" rel="noopener" class="text-primary-light hover:underline">eBay Live</a>
        </div>
      </div>
    </div>
  </section>
</template>
