<script setup lang="ts">
import type { Participant } from '~/types'
import { formatCurrency } from '~/utils/format'
import { ROLE_LABELS } from '~/utils/mockData'

defineProps<{ participant: Participant }>()
</script>

<template>
  <article class="group text-center transition hover:opacity-90">
    <div class="relative mx-auto h-36 w-36 overflow-hidden bg-primary-dark">
      <img
        v-if="participant.avatarUrl"
        :src="participant.avatarUrl"
        :alt="`Photo de ${participant.pseudo}`"
        width="144"
        height="144"
        loading="lazy"
        decoding="async"
        class="h-full w-full object-cover"
      >
      <span
        v-else
        class="flex h-full items-center justify-center font-display text-4xl font-bold text-white/80"
      >
        {{ participant.pseudo.charAt(0) }}
      </span>
      <span
        class="absolute right-2 top-2 border border-white/40 bg-primary/90 px-2 py-0.5 text-[10px] font-bold uppercase"
      >
        {{ ROLE_LABELS[participant.role] ?? participant.role }}
      </span>
    </div>
    <h3 class="mt-4 font-display text-lg font-bold uppercase tracking-wide text-white">
      {{ participant.pseudo }}
    </h3>
    <p class="text-sm text-white/60">{{ participant.category }}</p>
    <p class="mt-2 text-sm font-semibold text-accent-green">
      {{ formatCurrency(participant.amountRaised) }} collectés
    </p>
    <div class="mt-3 flex justify-center gap-3">
      <a
        v-if="participant.twitchUrl"
        :href="participant.twitchUrl"
        target="_blank"
        rel="noopener"
        class="text-xs font-semibold uppercase text-primary-light hover:underline"
      >Twitch</a>
      <a
        v-if="participant.instagramUrl"
        :href="participant.instagramUrl"
        target="_blank"
        rel="noopener"
        class="text-xs font-semibold uppercase text-accent-rose hover:underline"
      >Instagram</a>
    </div>
  </article>
</template>
