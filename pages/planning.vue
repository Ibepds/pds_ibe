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

usePageBackground('cyan')

usePageSeo({
  title: 'Programme — PDS Humanity',
  description:
    'Le déroulé du marathon de 24h de PDS Humanity (27 juin 18h → 28 juin 18h) : performances, freestyles, enchères et temps forts.',
})
</script>

<template>
  <div class="py-12">
    <div class="mx-auto max-w-4xl px-4 lg:px-8">
      <h1 class="section-title gradient-text">Programme</h1>
      <p class="mt-2 text-gray-400">{{ programme?.subtitle }}</p>
      <p v-if="error" class="mt-4 text-accent-rose">{{ error }}</p>
      <div class="mt-10">
        <ScheduleTimeline :items="schedule" :loading="loading" />
      </div>
    </div>
  </div>
</template>
