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

definePageMeta({ pageBackground: 'cyan' })

usePageSeo({
  title: 'Programme — PDS Humanity',
  description:
    'Le déroulé du marathon de 24h de PDS Humanity (27 juin 18h → 28 juin 18h) : performances, freestyles, enchères et temps forts.',
})
</script>

<template>
  <div class="py-20 md:py-28">
    <div class="mx-auto max-w-4xl px-4 lg:px-8">
      <h1 v-reveal class="section-title gradient-text">Programme</h1>
      <p class="accent-serif mt-4 text-lg text-ink/70 md:text-xl">{{ programme?.subtitle }}</p>
      <p v-if="error" class="mt-4 text-accent-rose">{{ error }}</p>
      <div v-reveal class="mt-10">
        <ScheduleTimeline :items="schedule" :loading="loading" />
      </div>
    </div>
  </div>
</template>
