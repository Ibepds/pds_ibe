<script setup lang="ts">
import { FILTER_OPTIONS, MOCK_PARTICIPANTS } from '~/utils/mockData'

const activeFilter = ref('all')

const { data: participants, loading, error } = useFirestoreCollection(
  'participants',
  MOCK_PARTICIPANTS,
)

const filtered = computed(() => {
  if (activeFilter.value === 'all') return participants.value
  return participants.value.filter((p) => p.role === activeFilter.value)
})
</script>

<template>
  <div class="py-12">
    <div class="mx-auto max-w-7xl px-4 lg:px-8">
      <h1 class="section-title gradient-text">Participants</h1>
      <p class="mt-2 text-gray-400">
        Streamers, artistes et invités — organisé par Ibé PDS
      </p>

      <div class="mt-8 flex flex-wrap gap-2">
        <button
          v-for="opt in FILTER_OPTIONS"
          :key="opt.value"
          class="rounded-full px-4 py-2 text-sm font-medium transition"
          :class="
            activeFilter === opt.value
              ? 'bg-primary text-white shadow-glow'
              : 'bg-white/5 text-gray-300 hover:bg-white/10'
          "
          @click="activeFilter = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>

      <p v-if="error" class="mt-6 text-accent-rose">{{ error }}</p>

      <div class="mt-8">
        <ParticipantsGrid
          :participants="filtered"
          :loading="loading"
        />
      </div>
    </div>
  </div>
</template>
