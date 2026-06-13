<script setup lang="ts">
import type { Donation } from '~/types'
import { formatCurrency } from '~/utils/format'

defineProps<{
  donations: Donation[]
  loading?: boolean
  limit?: number
  large?: boolean
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
      <h2
        v-reveal
        class="flex items-center justify-center gap-3 font-display font-bold uppercase tracking-wide"
        :class="large ? 'text-2xl md:text-4xl lg:text-5xl' : 'section-heading'"
      >
        <ChalkHeart :class="large ? '!h-6 !w-6 md:!h-8 md:!w-8 lg:!h-10 lg:!w-10' : ''" />
        Merci pour votre soutien
      </h2>

      <div v-if="loading" :class="large ? 'mt-10 space-y-4 md:mt-12' : 'mt-8 space-y-3'">
        <div
          v-for="i in 5"
          :key="i"
          class="animate-pulse bg-white/10"
          :class="large ? 'h-12' : 'h-8'"
        />
      </div>

      <ul v-else v-reveal :class="large ? 'mt-10 space-y-4 md:mt-12 md:space-y-5' : 'mt-8 space-y-3'">
        <li
          v-for="(d, i) in (limit ? donations.slice(0, limit) : donations)"
          :key="d.id"
          class="flex gap-3 border-b border-white/15"
          :class="large ? 'flex-col items-start py-3 sm:flex-row sm:items-center sm:justify-between sm:py-4' : 'items-center justify-between pb-2'"
        >
          <span
            class="flex min-w-0 items-center gap-2 font-semibold"
            :class="large ? 'text-base md:text-xl lg:text-2xl' : ''"
          >
            <ChalkHeart
              :class="[
                heartOpacities[i % heartOpacities.length],
                large ? '!h-5 !w-5 md:!h-6 md:!w-6' : '!h-3.5 !w-3.5',
              ]"
            />
            <span class="truncate">{{ d.username }}</span>
          </span>
          <span
            class="shrink-0 text-left sm:text-right"
            :class="large ? 'text-base md:text-lg' : 'text-sm'"
          >
            <span
              class="font-display font-bold text-primary-light"
              :class="large ? 'text-xl md:text-2xl lg:text-3xl' : ''"
            >
              {{ formatCurrency(d.amount) }}
            </span>
            <span class="ml-2 text-white/45" :class="large ? 'text-sm md:text-base' : ''">
              {{ formatTime(d.createdAt) }}
            </span>
          </span>
        </li>
      </ul>

      <p
        v-if="!loading && !donations.length"
        class="text-white/50"
        :class="large ? 'mt-8 text-base md:text-lg' : 'mt-6 text-sm'"
      >
        Soyez le premier à faire un don !
      </p>
    </div>
  </section>
</template>
