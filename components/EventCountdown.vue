<script setup lang="ts">
import { getTimeRemaining } from '~/utils/format'

const props = defineProps<{ endDate: string }>()
const remaining = ref(getTimeRemaining(props.endDate))

onMounted(() => {
  const interval = setInterval(() => {
    remaining.value = getTimeRemaining(props.endDate)
  }, 1000)
  onUnmounted(() => clearInterval(interval))
})

watch(() => props.endDate, (d) => {
  remaining.value = getTimeRemaining(d)
})

const units = [
  { key: 'days' as const, label: 'Jours' },
  { key: 'hours' as const, label: 'Heures' },
  { key: 'minutes' as const, label: 'Minutes' },
  { key: 'seconds' as const, label: 'Secondes' },
]
</script>

<template>
  <div class="flex flex-wrap items-center justify-center divide-x divide-white/40">
    <div
      v-for="unit in units"
      :key="unit.key"
      class="px-4 text-center md:px-6"
    >
      <p class="font-display text-3xl font-bold md:text-4xl">
        {{ String(remaining[unit.key]).padStart(2, '0') }}
      </p>
      <p class="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/55 md:text-xs">
        {{ unit.label }}
      </p>
    </div>
  </div>
  <p v-if="remaining.ended" class="mt-6 text-center text-sm font-semibold uppercase text-accent-red">
    L'événement est terminé — merci pour votre soutien !
  </p>
</template>
