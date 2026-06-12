<script setup lang="ts">
import { FILTER_OPTIONS, MOCK_PARTICIPANTS } from '~/utils/mockData'

const activeFilter = ref('all')

const { data: participants, loading, error } = useFirestoreCollection(
  'participants',
  MOCK_PARTICIPANTS,
)

definePageMeta({ pageBackground: 'dark' })

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
  <div class="py-20 md:py-28">
    <div class="mx-auto max-w-7xl px-4 lg:px-8">
      <h1 v-reveal class="section-title gradient-text">Participants</h1>
      <p class="accent-serif mt-4 text-lg text-ink/70 md:text-xl">
        Streamers, artistes et invités — organisé par PDS Records / Ibé
      </p>

      <div class="mt-8 flex flex-wrap gap-2">
        <button
          v-for="opt in FILTER_OPTIONS"
          :key="opt.value"
          class="rounded-full px-4 py-2 text-sm font-medium transition"
          :class="
            activeFilter === opt.value
              ? 'bg-primary text-white shadow-glow'
              : 'bg-ink/5 text-ink/70 hover:bg-ink/10'
          "
          @click="activeFilter = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>

      <p v-if="error" class="mt-6 text-accent-rose">{{ error }}</p>

      <div v-reveal class="mt-8">
        <ParticipantsGrid
          :participants="filtered"
          :loading="loading"
        />
      </div>
    </div>
  </div>
</template>
