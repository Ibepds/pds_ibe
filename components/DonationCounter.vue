<script setup lang="ts">
import { animateValue, formatCurrency, getProgressPercent } from '~/utils/format'

const props = defineProps<{
  current: number
  goal: number
  loading?: boolean
}>()

const displayAmount = ref(0)
const progress = computed(() => getProgressPercent(props.current, props.goal))

watch(
  () => props.current,
  (val) => {
    if (import.meta.client) {
      animateValue(displayAmount.value, val, 1200, (v) => {
        displayAmount.value = v
      })
    } else {
      displayAmount.value = val
    }
  },
  { immediate: true },
)
</script>

<template>
  <section class="section-divider py-12 md:py-16">
    <div class="w-full">
      <div v-if="loading" class="animate-pulse space-y-6">
        <div class="mx-auto h-5 w-40 bg-white/10" />
        <div class="h-10 bg-white/10" />
        <div class="h-4 bg-white/10" />
      </div>
      <div v-else v-reveal class="section-split text-center md:text-left">
        <div>
          <h2 class="section-heading section-heading-left">
            <ChalkHeart class="chalk-picto !h-6 !w-6" />
            Objectif de collecte
          </h2>
          <p class="mt-5 font-display text-3xl font-bold uppercase md:text-4xl">
            {{ formatCurrency(displayAmount) }}
            <span class="text-white/45"> / {{ formatCurrency(goal) }}</span>
          </p>
          <div class="progress-chalk mt-6">
            <div class="progress-chalk-fill" :style="{ width: `${progress}%` }" />
          </div>
          <p class="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-primary-light">
            {{ progress }}% de l'objectif atteint
          </p>
        </div>
        <div class="section-art">
          <ChalkGlobe />
        </div>
      </div>
    </div>
  </section>
</template>
