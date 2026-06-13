<script setup lang="ts">
import { MOCK_SCHEDULE, MOCK_PROGRAMME } from '~/utils/mockData'

const { data: schedule, loading, error } = useFirestoreCollection(
  'schedule',
  MOCK_SCHEDULE,
  { orderField: 'order', orderDirection: 'asc' },
)

const { single: programme } = useFirestoreCollection(
  'content',
  [{ id: 'programme', ...MOCK_PROGRAMME }],
  { docId: 'programme' },
)

usePageSeo({
  title: 'Programme — PDS Humanity',
  description:
    'Le déroulé du marathon de 24h de PDS Humanity : performances, freestyles, enchères et temps forts.',
})
</script>

<template>
  <div class="mx-auto max-w-lg md:max-w-2xl">
    <!-- Illustration haut de page (maquette) -->
    <div class="px-5 pt-20">
      <ChalkChildren class="mx-auto max-w-xs opacity-80" />
    </div>

    <div class="px-5 py-10">
      <h1 v-reveal class="section-heading !justify-start">
        <ChalkHeart />
        Le programme
      </h1>
      <p v-reveal class="mt-4 text-sm font-semibold uppercase leading-relaxed tracking-wide text-white/85 md:text-base">
        24h de live pour faire la différence.
      </p>
      <p v-reveal class="mt-2 text-xs uppercase tracking-wide text-white/60 md:text-sm">
        {{ programme?.subtitle ?? 'Concepts, échanges, freestyles et enchères solidaires.' }}
      </p>
      <p v-if="error" class="mt-4 text-accent-rose">{{ error }}</p>
      <div v-reveal class="mt-8">
        <ScheduleTimeline :items="schedule" :loading="loading" />
      </div>
    </div>

    <!-- Rappel compte à rebours (maquette bas de page) -->
    <section class="section-divider px-5 py-12 text-center">
      <div class="flex items-center justify-center gap-2">
        <ChalkSparkles />
        <ChalkHeart />
        <p class="font-display text-sm font-bold uppercase tracking-wide">
          L'événement commence dans
        </p>
        <ChalkSparkles class="scale-x-[-1]" />
      </div>
    </section>
  </div>
</template>
