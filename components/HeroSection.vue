<script setup lang="ts">
import type { EventDoc } from '~/types'
import { formatDate } from '~/utils/format'

defineProps<{
  event: EventDoc | null
  loading?: boolean
}>()
</script>

<template>
  <section class="section-dark relative overflow-hidden">
    <!-- Halos animés discrets (dynamisme) -->
    <div class="floaty pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
    <div class="floaty pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-accent-red/15 blur-3xl" style="animation-delay: -2s" />

    <div class="relative mx-auto max-w-7xl px-4 pt-36 pb-28 md:pt-44 md:pb-36 lg:px-8">
      <div v-if="loading" class="animate-pulse space-y-4">
        <div class="h-16 w-full max-w-2xl rounded bg-white/10" />
        <div class="h-6 w-96 rounded bg-white/10" />
      </div>
      <div v-else>
        <div class="rise mb-8" style="animation-delay: 0s">
          <img
            src="/images/logo-white.png"
            alt=""
            aria-hidden="true"
            class="floaty h-16 w-auto opacity-90 md:h-20"
          />
        </div>
        <h1
          class="rise font-display text-6xl font-bold uppercase leading-[0.9] tracking-tight md:text-8xl lg:text-9xl"
          style="animation-delay: 0.12s"
        >
          {{ event?.heroTitle ?? event?.name }}
        </h1>
        <p
          class="rise accent-serif mt-7 max-w-2xl text-xl text-white/85 md:text-3xl"
          style="animation-delay: 0.26s"
        >
          {{ event?.heroSubtitle ?? event?.tagline }}
        </p>
        <p
          v-if="event"
          class="rise mt-6 flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-white/60"
          style="animation-delay: 0.38s"
        >
          <span v-if="event.isLive" class="blink inline-block h-2 w-2 rounded-full bg-accent-red" />
          {{ formatDate(event.startDate) }} → {{ formatDate(event.endDate) }}
        </p>
        <div class="rise mt-10 flex flex-wrap gap-4" style="animation-delay: 0.5s">
          <PrimaryButton to="/donate">Faire un don</PrimaryButton>
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
        <div v-if="event?.isLive" class="rise mt-6 flex flex-wrap gap-3 text-sm text-white/60" style="animation-delay: 0.62s">
          <span class="uppercase tracking-wide">En direct :</span>
          <a v-if="event.liveUrl" :href="event.liveUrl" target="_blank" rel="noopener" class="hover:text-white">Twitch</a>
          <a v-if="event.youtubeUrl" :href="event.youtubeUrl" target="_blank" rel="noopener" class="hover:text-white">YouTube</a>
          <a v-if="event.tiktokUrl" :href="event.tiktokUrl" target="_blank" rel="noopener" class="hover:text-white">TikTok</a>
          <a v-if="event.ebayLiveUrl" :href="event.ebayLiveUrl" target="_blank" rel="noopener" class="hover:text-white">eBay Live</a>
        </div>
      </div>
    </div>
  </section>
</template>
