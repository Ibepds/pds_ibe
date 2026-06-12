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
  <div class="flex flex-wrap justify-center gap-4 md:gap-6">
    <div
      v-for="(label, key) in { days: 'Jours', hours: 'Heures', minutes: 'Min', seconds: 'Sec' }"
      :key="key"
      class="card-glow min-w-[72px] px-4 py-3 text-center"
    >
      <p class="font-display text-3xl font-bold text-ink md:text-4xl">
        {{ String(remaining[key as keyof typeof remaining]).padStart(2, '0') }}
      </p>
      <p class="text-xs uppercase tracking-wide text-ink/50">{{ label }}</p>
    </div>
  </div>
  <p v-if="remaining.ended" class="mt-4 text-center text-accent-red">
    L'événement est terminé — merci pour votre soutien !
  </p>
</template>
