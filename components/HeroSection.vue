<script setup lang="ts">
import type { EventDoc } from '~/types'
import { formatHeroDate } from '~/utils/format'
import { DA } from '~/utils/daAssets'

defineProps<{
  event: EventDoc | null
  loading?: boolean
}>()
</script>

<template>
  <section class="w-full pb-8 pt-20 text-center">
    <!-- Logo + décorations -->
    <div class="rise relative mx-auto w-full max-w-md md:max-w-lg" style="animation-delay: 0.05s">
      <div class="pointer-events-none absolute -left-2 top-8 md:-left-8">
        <ChalkImage :src="DA.picto.heart" class="h-10 w-10 md:h-12 md:w-12" />
      </div>
      <div class="pointer-events-none absolute -right-2 top-6 md:-right-6">
        <ChalkDove class="!max-w-[70px] md:!max-w-[90px]" />
      </div>
      <img
        src="/images/logo-white.png"
        alt="PDS Humanity — Musique & Solidarité"
        width="320"
        height="180"
        fetchpriority="high"
        decoding="async"
        class="relative mx-auto w-full max-w-[280px] object-contain md:max-w-[360px]"
      />
    </div>

    <!-- Date + tagline (slide 1 maquette) -->
    <div v-if="!loading && event" class="rise mt-8 w-full" style="animation-delay: 0.15s">
      <div class="flex items-center justify-center gap-3">
        <ChalkSparkles />
        <p class="font-display text-2xl font-bold uppercase tracking-wide md:text-4xl lg:text-5xl">
          {{ formatHeroDate(event.startDate) }}
        </p>
        <ChalkSparkles class="scale-x-[-1]" />
      </div>
      <div class="mt-4 flex items-center justify-center gap-2">
        <ChalkHeart />
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-white/90 md:text-sm">
          Live caritatif de 24h non-stop
        </p>
      </div>
    </div>

    <!-- CTAs -->
    <div
      class="rise mx-auto mt-8 flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:justify-center md:max-w-3xl"
      style="animation-delay: 0.28s"
    >
      <PrimaryButton to="/donate" class="relative w-full flex-1 !py-3.5">
        <ChalkHeart />
        Faire un don
      </PrimaryButton>
      <PrimaryButton to="/encheres" variant="outline" class="w-full flex-1 !py-3.5">
        <ChalkGavel />
        Accéder aux enchères
      </PrimaryButton>
    </div>

    <!-- Flèche scroll -->
    <a
      href="#countdown"
      class="rise mt-10 inline-flex flex-col items-center gap-1 text-white/50 transition hover:text-white"
      style="animation-delay: 0.4s"
      aria-label="Défiler vers le contenu"
    >
      <svg class="h-6 w-6 animate-bounce" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </a>
  </section>
</template>
