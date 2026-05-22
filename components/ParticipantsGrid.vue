<script setup lang="ts">
import type { Participant } from '~/types'

defineProps<{
  participants: Participant[]
  loading?: boolean
  emptyMessage?: string
}>()
</script>

<template>
  <div v-if="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <div v-for="i in 6" :key="i" class="card-glow h-64 animate-pulse" />
  </div>
  <div
    v-else-if="participants.length"
    class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
  >
    <ParticipantCard
      v-for="p in participants"
      :key="p.id"
      :participant="p"
    />
  </div>
  <p v-else class="rounded-xl border border-white/10 bg-surface-card p-8 text-center text-gray-400">
    {{ emptyMessage ?? 'Aucun participant pour le moment.' }}
  </p>
</template>
