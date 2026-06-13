<script setup lang="ts">
import { animateValue, formatCurrency, getProgressPercent } from '~/utils/format'

const props = defineProps<{
  current: number
  goal: number
  loading?: boolean
  large?: boolean
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
  <div class="w-full">
    <div v-if="loading" class="animate-pulse space-y-4">
      <div :class="large ? 'h-16 bg-white/10 md:h-20' : 'h-10 bg-white/10'" />
      <div :class="large ? 'h-8 bg-white/10 md:h-10' : 'h-4 bg-white/10'" />
    </div>
    <div v-else v-reveal class="text-center">
      <p
        class="font-display font-bold uppercase leading-tight"
        :class="large ? 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl' : 'text-2xl md:text-3xl'"
      >
        {{ formatCurrency(displayAmount) }}
        <span class="text-white/45"> / {{ formatCurrency(goal) }}</span>
      </p>
      <div
        class="progress-chalk mx-auto w-full"
        :class="large ? 'mt-8 max-w-4xl !h-7 p-1 md:mt-10 md:!h-10 md:p-1.5 lg:max-w-5xl lg:!h-12' : 'mt-5'"
      >
        <div class="progress-chalk-fill" :style="{ width: `${progress}%` }" />
      </div>
      <p
        class="font-semibold uppercase tracking-wide text-primary-light"
        :class="large ? 'mt-6 text-base md:mt-8 md:text-xl lg:text-2xl' : 'mt-4 text-sm'"
      >
        Déjà {{ formatCurrency(displayAmount) }} récoltés grâce à vous !
      </p>
    </div>
  </div>
</template>
