<script setup lang="ts">
import type { Participant } from '~/types'
import { formatCurrency } from '~/utils/format'
import { ROLE_LABELS } from '~/utils/mockData'

defineProps<{ participant: Participant }>()
</script>

<template>
  <article class="card-glow group overflow-hidden transition hover:scale-[1.02]">
    <div
      class="relative flex h-40 items-center justify-center bg-gradient-to-br from-primary/30 via-surface-elevated to-accent-cyan/20"
    >
      <img
        v-if="participant.avatarUrl"
        :src="participant.avatarUrl"
        :alt="participant.pseudo"
        class="h-full w-full object-cover"
      >
      <span
        v-else
        class="font-display text-4xl font-bold text-white/80"
      >
        {{ participant.pseudo.charAt(0) }}
      </span>
      <span
        class="absolute right-3 top-3 rounded-full bg-primary/80 px-2 py-0.5 text-xs font-medium"
      >
        {{ ROLE_LABELS[participant.role] ?? participant.role }}
      </span>
    </div>
    <div class="p-5">
      <h3 class="font-display text-lg font-bold">{{ participant.pseudo }}</h3>
      <p class="text-sm text-gray-400">{{ participant.category }}</p>
      <p class="mt-2 text-sm text-accent-green">
        {{ formatCurrency(participant.amountRaised) }} collectés
      </p>
      <div class="mt-3 flex gap-2">
        <a
          v-if="participant.twitchUrl"
          :href="participant.twitchUrl"
          target="_blank"
          rel="noopener"
          class="text-xs text-primary-light hover:underline"
        >Twitch</a>
        <a
          v-if="participant.instagramUrl"
          :href="participant.instagramUrl"
          target="_blank"
          rel="noopener"
          class="text-xs text-accent-rose hover:underline"
        >Instagram</a>
      </div>
    </div>
  </article>
</template>
