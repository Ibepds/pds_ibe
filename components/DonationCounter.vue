<script setup lang="ts">
import { animateValue, formatCurrency, getProgressPercent } from '~/utils/format'

const props = defineProps<{
  current: number
  goal: number
  donorsCount: number
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
  <section class="border-y border-ink/10 py-24 md:py-32">
    <div class="mx-auto max-w-7xl px-4 lg:px-8">
      <div v-if="loading" class="animate-pulse space-y-8">
        <div class="h-6 w-48 rounded bg-ink/10" />
        <div class="grid gap-8 md:grid-cols-3">
          <div v-for="n in 3" :key="n" class="h-24 rounded bg-ink/10" />
        </div>
      </div>
      <div v-else class="animate-slide-up">
        <p class="section-label">( Objectif de collecte )</p>
        <div class="grid gap-12 md:grid-cols-3 md:gap-8">
          <div>
            <p class="stat-editorial">{{ formatCurrency(displayAmount) }}</p>
            <p class="mt-3 text-sm uppercase tracking-[0.2em] text-ink/50">Collecté</p>
          </div>
          <div>
            <p class="stat-editorial">{{ formatCurrency(goal) }}</p>
            <p class="mt-3 text-sm uppercase tracking-[0.2em] text-ink/50">Objectif</p>
          </div>
          <div>
            <p class="stat-editorial">{{ donorsCount }}</p>
            <p class="mt-3 text-sm uppercase tracking-[0.2em] text-ink/50">Donateurs</p>
          </div>
        </div>
        <div class="mt-12 h-1 overflow-hidden bg-ink/10">
          <div
            class="h-full bg-primary transition-all duration-1000 ease-out"
            :style="{ width: `${progress}%` }"
          />
        </div>
        <p class="mt-4 text-sm uppercase tracking-[0.15em] text-ink/45">
          {{ progress }}% de l'objectif atteint
        </p>
      </div>
    </div>
  </section>
</template>
