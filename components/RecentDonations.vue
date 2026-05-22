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
  <section class="py-16">
    <div class="mx-auto max-w-7xl px-4 lg:px-8">
      <h2 class="section-title">Derniers dons</h2>
      <div v-if="loading" class="mt-6 space-y-3">
        <div v-for="i in 4" :key="i" class="h-16 animate-pulse rounded-xl bg-white/5" />
      </div>
      <ul v-else class="mt-6 space-y-3">
        <li
          v-for="d in (limit ? donations.slice(0, limit) : donations)"
          :key="d.id"
          class="card-glow flex items-center justify-between gap-4 p-4"
        >
          <div>
            <p class="font-semibold">{{ d.username }}</p>
            <p v-if="d.message" class="text-sm text-gray-400">{{ d.message }}</p>
          </div>
          <div class="text-right">
            <p class="font-bold text-accent-green">{{ formatCurrency(d.amount) }}</p>
            <p class="text-xs text-gray-500">{{ formatTime(d.createdAt) }}</p>
          </div>
        </li>
      </ul>
      <p
        v-if="!loading && !donations.length"
        class="mt-6 text-center text-gray-400"
      >
        Soyez le premier à faire un don !
      </p>
    </div>
  </section>
</template>
