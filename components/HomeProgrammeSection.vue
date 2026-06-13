<script setup lang="ts">
import type { ScheduleItem } from '~/types'

const props = defineProps<{
  items: ScheduleItem[]
  loading?: boolean
  limit?: number
  /** Intégré sous le compteur (sans section séparée) */
  embedded?: boolean
  large?: boolean
}>()

const programmeItems = computed(() => {
  const sorted = [...props.items]
    .filter((i) => !i.title.toLowerCase().includes('freestyle'))
    .sort((a, b) => a.order - b.order)
  return props.limit ? sorted.slice(0, props.limit) : sorted
})
</script>

<template>
  <section :class="embedded ? 'w-full' : 'section-divider py-12 md:py-16'">
    <div class="w-full">
      <div v-reveal class="flex items-center justify-center gap-3 md:gap-5">
        <ChalkSparkles :class="large ? '!h-10 !w-7 md:!h-14 md:!w-9 lg:!h-16 lg:!w-10' : ''" />
        <h2
          class="font-display font-bold uppercase tracking-wide"
          :class="large ? 'text-2xl md:text-4xl lg:text-5xl' : 'text-xl md:text-2xl'"
        >
          Le programme
        </h2>
        <ChalkSparkles
          class="scale-x-[-1]"
          :class="large ? '!h-10 !w-7 md:!h-14 md:!w-9 lg:!h-16 lg:!w-10' : ''"
        />
      </div>

      <div v-reveal :class="large ? 'mt-10 md:mt-12' : 'mt-8'">
        <ScheduleTimeline :items="programmeItems" :loading="loading" :large="large" />
      </div>

      <!-- Bannière freestyle nocturne (slide 3) -->
      <NuxtLink
        v-reveal
        to="/freestyles"
        class="flex items-center gap-4 border-2 border-white/40 bg-white/5 transition hover:bg-white/10"
        :class="large ? 'mt-10 p-5 md:mt-12 md:p-7 lg:p-8' : 'mt-8 p-4 md:p-5'"
      >
        <div
          class="flex shrink-0 items-center justify-center rounded-full border-2 border-accent-green text-accent-green"
          :class="large ? 'h-16 w-16 md:h-20 md:w-20' : 'h-12 w-12'"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            :class="large ? 'h-7 w-7 md:h-9 md:w-9' : 'h-5 w-5'"
          >
            <rect x="9" y="3" width="6" height="10" rx="3" />
            <path d="M5 11a7 7 0 0014 0M12 18v3" stroke-linecap="round" />
          </svg>
        </div>
        <div class="min-w-0 flex-1 text-left">
          <p
            class="font-display font-bold uppercase text-accent-green"
            :class="large ? 'text-base md:text-xl lg:text-2xl' : 'text-sm md:text-base'"
          >
            Freestyle nocturne
          </p>
          <p class="text-white/65" :class="large ? 'text-sm md:text-base lg:text-lg' : 'text-xs md:text-sm'">
            Réservez votre créneau
          </p>
        </div>
        <span
          class="shrink-0 text-white/70"
          :class="large ? 'text-2xl md:text-3xl' : 'text-xl'"
          aria-hidden="true"
        >→</span>
      </NuxtLink>

      <div v-reveal class="text-center" :class="large ? 'mt-10 md:mt-12' : 'mt-8'">
        <NuxtLink
          to="/planning"
          class="font-semibold uppercase tracking-wide text-primary-light hover:underline"
          :class="large ? 'text-base md:text-lg lg:text-xl' : 'text-sm'"
        >
          → Programme complet
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
