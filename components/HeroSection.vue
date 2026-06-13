<script setup lang="ts">
import type { EventDoc } from '~/types'
import { formatHeroDate } from '~/utils/format'

defineProps<{
  event: EventDoc | null
  loading?: boolean
}>()
</script>

<template>
  <section class="w-full pb-10 pt-20 text-center">
    <!-- Logo + décorations cœur / colombe -->
    <div class="rise relative mx-auto w-full max-w-md md:max-w-lg" style="animation-delay: 0.05s">
      <div class="pointer-events-none absolute -left-2 top-8 md:-left-8">
        <svg class="h-10 w-10 text-white opacity-90 md:h-12 md:w-12" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M20 32C12 24 6 18 6 12a6 6 0 0112 0 6 6 0 0112 0c0 6-6 12-14 20z" />
        </svg>
      </div>
      <div class="pointer-events-none absolute -right-2 top-6 md:-right-6">
        <ChalkDove class="!max-w-[70px] md:!max-w-[90px]" />
      </div>
      <img
        src="/images/logo-white.png"
        alt="PDS Humanity"
        width="320"
        height="180"
        fetchpriority="high"
        decoding="async"
        class="relative mx-auto w-full max-w-[280px] object-contain md:max-w-[360px]"
      />
    </div>

    <!-- CTAs -->
    <div
      class="rise mx-auto mt-8 flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:justify-center md:max-w-3xl"
      style="animation-delay: 0.15s"
    >
      <PrimaryButton to="/donate" class="relative w-full flex-1 !py-3.5 sm:max-w-none">
        <span class="pointer-events-none absolute -left-3 top-1/2 hidden -translate-y-1/2 lg:block">
          <ChalkSparkles />
        </span>
        <ChalkHeart class="!text-primary" />
        Faire un don
        <span class="pointer-events-none absolute -right-3 top-1/2 hidden -translate-y-1/2 lg:block">
          <ChalkSparkles />
        </span>
      </PrimaryButton>
      <PrimaryButton to="/encheres" variant="outline" class="w-full flex-1 !py-3.5 sm:max-w-none">
        <ChalkGavel />
        Accéder aux enchères
      </PrimaryButton>
    </div>

    <!-- Date + tagline -->
    <div v-if="!loading && event" class="rise mt-10 w-full" style="animation-delay: 0.3s">
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

    <!-- Illustration enfants -->
    <div class="rise mx-auto mt-10 w-full max-w-xl md:max-w-2xl" style="animation-delay: 0.45s">
      <ChalkChildren />
    </div>
  </section>
</template>
