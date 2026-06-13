<script setup lang="ts">
import type { ScheduleItem } from '~/types'

const props = defineProps<{
  items: ScheduleItem[]
  loading?: boolean
  limit?: number
  /** Intégré sous le compteur (sans section séparée) */
  embedded?: boolean
}>()

const programmeItems = computed(() => {
  const sorted = [...props.items]
    .filter((i) => !i.title.toLowerCase().includes('freestyle'))
    .sort((a, b) => a.order - b.order)
  return props.limit ? sorted.slice(0, props.limit) : sorted
})
</script>

<template>
  <section :class="embedded ? 'w-full border-t border-white/20 pt-10' : 'section-divider py-12 md:py-16'">
    <div class="w-full">
      <div v-reveal class="flex items-center justify-center gap-3">
        <ChalkSparkles />
        <h2 class="font-display text-xl font-bold uppercase tracking-wide md:text-2xl">
          Le programme
        </h2>
        <ChalkSparkles class="scale-x-[-1]" />
      </div>

      <div v-reveal class="mt-8">
        <ScheduleTimeline :items="programmeItems" :loading="loading" />
      </div>

      <!-- Bannière freestyle nocturne (slide 3) -->
      <NuxtLink
        v-reveal
        to="/freestyles"
        class="mt-8 flex items-center gap-4 border-2 border-white/40 bg-white/5 p-4 transition hover:bg-white/10 md:p-5"
      >
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-accent-green text-accent-green">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <rect x="9" y="3" width="6" height="10" rx="3" />
            <path d="M5 11a7 7 0 0014 0M12 18v3" stroke-linecap="round" />
          </svg>
        </div>
        <div class="min-w-0 flex-1 text-left">
          <p class="font-display text-sm font-bold uppercase text-accent-green md:text-base">
            Freestyle nocturne
          </p>
          <p class="text-xs text-white/65 md:text-sm">Réservez votre créneau</p>
        </div>
        <span class="shrink-0 text-xl text-white/70" aria-hidden="true">→</span>
      </NuxtLink>

      <div v-reveal class="mt-8 text-center">
        <NuxtLink
          to="/planning"
          class="text-sm font-semibold uppercase tracking-wide text-primary-light hover:underline"
        >
          → Programme complet
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
