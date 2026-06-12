<script setup lang="ts">
import type { Participant } from '~/types'
import { formatCurrency } from '~/utils/format'
import { ROLE_LABELS } from '~/utils/mockData'

defineProps<{ participant: Participant }>()
</script>

<template>
  <article class="card-glow group overflow-hidden transition hover:scale-[1.02]">
    <div
      class="relative flex h-40 items-center justify-center bg-ink"
    >
      <img
        v-if="participant.avatarUrl"
        :src="participant.avatarUrl"
        :alt="`Photo de ${participant.pseudo}`"
        width="320"
        height="160"
        loading="lazy"
        decoding="async"
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
      <h3 class="font-display text-lg font-bold uppercase tracking-wide text-ink">{{ participant.pseudo }}</h3>
      <p class="text-sm text-ink/60">{{ participant.category }}</p>
      <p class="mt-2 text-sm font-semibold text-primary">
        {{ formatCurrency(participant.amountRaised) }} collectés
      </p>
      <div class="mt-3 flex gap-3">
        <a
          v-if="participant.twitchUrl"
          :href="participant.twitchUrl"
          target="_blank"
          rel="noopener"
          class="text-xs font-semibold uppercase text-primary hover:underline"
        >Twitch</a>
        <a
          v-if="participant.instagramUrl"
          :href="participant.instagramUrl"
          target="_blank"
          rel="noopener"
          class="text-xs font-semibold uppercase text-accent-red hover:underline"
        >Instagram</a>
      </div>
    </div>
  </article>
</template>
