<script setup lang="ts">
import type { Participant } from '~/types'

defineProps<{
  participants: Participant[]
  loading?: boolean
  emptyMessage?: string
}>()
</script>

<template>
  <div v-if="loading" class="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
    <div v-for="i in 6" :key="i" class="h-64 animate-pulse bg-white/10" />
  </div>
  <div
    v-else-if="participants.length"
    class="grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
  >
    <ParticipantCard
      v-for="p in participants"
      :key="p.id"
      :participant="p"
    />
  </div>
  <p v-else class="py-8 text-center text-white/60">
    {{ emptyMessage ?? 'Aucun participant pour le moment.' }}
  </p>
</template>
