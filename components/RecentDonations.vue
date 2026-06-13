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
  if (hours < 1) return 'à l\'instant'
  if (hours < 24) return `il y a ${hours}h`
  return `il y a ${Math.floor(hours / 24)}j`
}
</script>

<template>
  <section class="section-divider py-12 md:py-16">
    <div class="mx-auto max-w-lg px-5 md:max-w-2xl">
      <h2 v-reveal class="section-heading !justify-start">
        <ChalkHeart />
        Derniers dons
      </h2>

      <div v-if="loading" class="mt-6 space-y-3">
        <div v-for="i in 5" :key="i" class="h-8 animate-pulse bg-white/10" />
      </div>

      <div v-else v-reveal class="section-split mt-6">
        <ul class="min-w-0 flex-1 space-y-3">
          <li
            v-for="d in (limit ? donations.slice(0, limit) : donations)"
            :key="d.id"
            class="flex items-baseline justify-between gap-3 border-b border-white/15 pb-2"
          >
            <span class="font-semibold">{{ d.username }}</span>
            <span class="shrink-0 text-right text-sm">
              <span class="font-display font-bold text-primary-light">{{ formatCurrency(d.amount) }}</span>
              <span class="ml-2 text-white/45">{{ formatTime(d.createdAt) }}</span>
            </span>
          </li>
        </ul>
        <div class="section-art self-center">
          <ChalkBigHeart />
        </div>
      </div>

      <p v-if="!loading && !donations.length" class="mt-6 text-sm text-white/50">
        Soyez le premier à faire un don !
      </p>
    </div>
  </section>
</template>
