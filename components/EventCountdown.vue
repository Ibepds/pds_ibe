<script setup lang="ts">
import { getTimeRemaining } from '~/utils/format'

const props = defineProps<{ endDate: string; large?: boolean }>()
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
  <div
    class="grid grid-cols-2 items-center justify-items-center gap-x-2 gap-y-4 sm:flex sm:flex-wrap sm:justify-center"
    :class="large ? 'sm:gap-y-4 sm:divide-x sm:divide-white/40' : 'divide-x divide-white/40'"
  >
    <div
      v-for="unit in units"
      :key="unit.key"
      class="w-full text-center sm:w-auto"
      :class="large ? 'px-3 sm:px-8 md:px-10 lg:px-14' : 'px-4 md:px-6'"
    >
      <p
        class="font-display font-bold tabular-nums leading-none"
        :class="large ? 'text-4xl sm:text-6xl md:text-7xl lg:text-8xl' : 'text-3xl md:text-4xl'"
      >
        {{ String(remaining[unit.key]).padStart(2, '0') }}
      </p>
      <p
        class="mt-2 font-semibold uppercase text-white/55"
        :class="
          large
            ? 'text-xs tracking-[0.2em] sm:text-sm md:text-base md:tracking-[0.25em]'
            : 'text-[10px] tracking-[0.15em] md:text-xs'
        "
      >
        {{ unit.label }}
      </p>
    </div>
  </div>
  <p
    v-if="remaining.ended"
    class="mt-6 text-center font-semibold uppercase text-primary-light"
    :class="large ? 'text-lg md:text-xl' : 'text-sm'"
  >
    C'est parti !
  </p>
</template>
