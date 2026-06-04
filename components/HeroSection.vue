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
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.25),_transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(34,211,238,0.15),_transparent_40%)]"
    />
    <div
      class="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-accent-rose/20 blur-3xl"
    />
    <div
      class="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-primary/20 blur-3xl"
    />

    <div class="relative mx-auto max-w-7xl px-4 lg:px-8">
      <div v-if="loading" class="animate-pulse space-y-4">
        <div class="h-8 w-48 rounded bg-white/10" />
        <div class="h-16 w-full max-w-2xl rounded bg-white/10" />
        <div class="h-6 w-96 rounded bg-white/10" />
      </div>
      <div v-else class="animate-fade-in">
        <p
          class="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm text-primary-light"
        >
          <span class="h-2 w-2 rounded-full bg-accent-green animate-pulse" />
          Organisé par {{ event?.organizerName ?? 'Ibé PDS' }}
        </p>
        <h1 class="mt-6 font-display text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
          <span class="gradient-text">{{ event?.heroTitle ?? event?.name }}</span>
        </h1>
        <p class="mt-4 max-w-2xl text-lg text-gray-300 md:text-xl">
          {{ event?.heroSubtitle ?? event?.tagline }}
        </p>
        <p v-if="event" class="mt-4 text-sm text-gray-400">
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
