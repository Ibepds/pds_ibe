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
</script>

<template>
  <div class="flex flex-wrap justify-center gap-8 md:gap-14">
    <div
      v-for="(label, key) in { days: 'Jours', hours: 'Heures', minutes: 'Min', seconds: 'Sec' }"
      :key="key"
      class="min-w-[80px] text-center"
    >
      <p class="stat-editorial text-ink">
        {{ String(remaining[key as keyof typeof remaining]).padStart(2, '0') }}
      </p>
      <p class="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-ink/45">{{ label }}</p>
    </div>
  </div>
  <p v-if="remaining.ended" class="mt-8 text-center text-sm font-semibold uppercase tracking-wide text-accent-red">
    L'événement est terminé — merci pour votre soutien !
  </p>
</template>
