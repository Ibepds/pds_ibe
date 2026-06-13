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
  <div class="w-full border-t border-white/20 pt-10">
    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="h-10 bg-white/10" />
      <div class="h-4 bg-white/10" />
    </div>
    <div v-else v-reveal>
      <p class="font-display text-2xl font-bold uppercase md:text-3xl">
        {{ formatCurrency(displayAmount) }}
        <span class="text-white/45"> / {{ formatCurrency(goal) }}</span>
      </p>
      <div class="progress-chalk mt-5">
        <div class="progress-chalk-fill" :style="{ width: `${progress}%` }" />
      </div>
      <p class="mt-4 text-sm font-semibold uppercase tracking-wide text-primary-light">
        Déjà {{ formatCurrency(displayAmount) }} récoltés grâce à vous !
      </p>
    </div>
  </div>
</template>
