<script setup lang="ts">
import { FILTER_OPTIONS, MOCK_PARTICIPANTS } from '~/utils/mockData'

const activeFilter = ref('all')

const { data: participants, loading, error } = useFirestoreCollection(
  'participants',
  MOCK_PARTICIPANTS,
)

usePageSeo({
  title: 'Participants — PDS Humanity',
  description:
    'Les artistes, streamers et invités qui font vibrer PDS Humanity pendant le marathon caritatif de 24h.',
})

const filtered = computed(() => {
  if (activeFilter.value === 'all') return participants.value
  return participants.value.filter((p) => p.role === activeFilter.value)
})
</script>

<template>
  <div class="home-container">
    <section class="py-12 md:py-16">
      <PageHeader
        title="Participants"
        lead="Streamers, artistes et invités — organisé par PDS Records / Ibé"
      />

      <div class="mt-8 flex flex-wrap justify-center gap-2">
        <button
          v-for="opt in FILTER_OPTIONS"
          :key="opt.value"
          class="chip"
          :class="activeFilter === opt.value ? 'chip-active' : 'chip-idle'"
          @click="activeFilter = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </section>

    <section class="section-divider py-12 md:py-16">
      <p v-if="error" class="mb-6 text-center text-accent-rose">{{ error }}</p>
      <ParticipantsGrid
        :participants="filtered"
        :loading="loading"
      />
    </section>
  </div>
</template>
