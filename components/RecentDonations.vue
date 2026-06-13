<script setup lang="ts">
import type { Donation } from '~/types'
import { formatCurrency } from '~/utils/format'

defineProps<{
  donations: Donation[]
  loading?: boolean
  limit?: number
}>()

const heartOpacities = ['opacity-100', 'opacity-90', 'opacity-80', 'opacity-70', 'opacity-60']

const formatTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'il y a 1 min'
  if (mins < 60) return `il y a ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `il y a ${hours}h`
  return `il y a ${Math.floor(hours / 24)}j`
}
</script>

<template>
  <section class="section-divider py-12 md:py-16">
    <div class="w-full">
      <h2 v-reveal class="section-heading">
        <ChalkHeart />
        Merci pour votre soutien
      </h2>

      <div v-if="loading" class="mt-8 space-y-3">
        <div v-for="i in 5" :key="i" class="h-8 animate-pulse bg-white/10" />
      </div>

      <ul v-else v-reveal class="mt-8 space-y-3">
        <li
          v-for="(d, i) in (limit ? donations.slice(0, limit) : donations)"
          :key="d.id"
          class="flex items-center justify-between gap-3 border-b border-white/15 pb-2"
        >
          <span class="flex items-center gap-2 font-semibold">
            <ChalkHeart :class="['!h-3.5 !w-3.5', heartOpacities[i % heartOpacities.length]]" />
            {{ d.username }}
          </span>
          <span class="shrink-0 text-right text-sm">
            <span class="font-display font-bold text-primary-light">{{ formatCurrency(d.amount) }}</span>
            <span class="ml-2 text-white/45">{{ formatTime(d.createdAt) }}</span>
          </span>
        </li>
      </ul>

      <p v-if="!loading && !donations.length" class="mt-6 text-sm text-white/50">
        Soyez le premier à faire un don !
      </p>
    </div>
  </section>
</template>
