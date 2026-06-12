<script setup lang="ts">
import type { Donation } from '~/types'
import { formatCurrency } from '~/utils/format'

defineProps<{
  donations: Donation[]
  loading?: boolean
  limit?: number
}>()

const formatTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'À l\'instant'
  if (hours < 24) return `Il y a ${hours}h`
  return `Il y a ${Math.floor(hours / 24)}j`
}
</script>

<template>
  <section class="py-24 md:py-32">
    <div class="mx-auto max-w-7xl px-4 lg:px-8">
      <h2 class="section-title">Derniers dons</h2>
      <div v-if="loading" class="mt-8 space-y-3">
        <div v-for="i in 4" :key="i" class="h-16 animate-pulse rounded-xl bg-ink/5" />
      </div>
      <ul v-else class="mt-8 space-y-3">
        <li
          v-for="d in (limit ? donations.slice(0, limit) : donations)"
          :key="d.id"
          class="card-glow flex items-center justify-between gap-4 p-5"
        >
          <div>
            <p class="font-semibold text-ink">{{ d.username }}</p>
            <p v-if="d.message" class="accent-serif text-sm text-ink/60">« {{ d.message }} »</p>
          </div>
          <div class="text-right">
            <p class="font-display text-lg font-bold text-primary">{{ formatCurrency(d.amount) }}</p>
            <p class="text-xs text-ink/40">{{ formatTime(d.createdAt) }}</p>
          </div>
        </li>
      </ul>
      <p
        v-if="!loading && !donations.length"
        class="mt-8 text-center text-ink/50"
      >
        Soyez le premier à faire un don !
      </p>
    </div>
  </section>
</template>
