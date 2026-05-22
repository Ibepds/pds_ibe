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
  <section class="py-16">
    <div class="mx-auto max-w-7xl px-4 lg:px-8">
      <div class="card-glow overflow-hidden p-8 md:p-12">
        <div v-if="loading" class="animate-pulse space-y-4">
          <div class="h-12 w-64 rounded bg-white/10" />
          <div class="h-4 w-full rounded bg-white/10" />
        </div>
        <div v-else class="animate-slide-up">
          <p class="text-sm uppercase tracking-wider text-accent-cyan">
            Objectif de collecte
          </p>
          <div class="mt-2 flex flex-wrap items-end gap-4">
            <span class="font-display text-5xl font-bold text-white md:text-6xl">
              {{ formatCurrency(displayAmount) }}
            </span>
            <span class="pb-2 text-xl text-gray-400">
              / {{ formatCurrency(goal) }}
            </span>
          </div>
          <div class="mt-6 h-4 overflow-hidden rounded-full bg-surface">
            <div
              class="h-full rounded-full bg-gradient-to-r from-primary via-accent-cyan to-accent-green transition-all duration-1000 ease-out"
              :style="{ width: `${progress}%` }"
            />
          </div>
          <div class="mt-4 flex flex-wrap justify-between gap-4 text-sm text-gray-400">
            <span>{{ progress }}% de l'objectif atteint</span>
            <span>{{ donorsCount }} donateurs</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
