<script setup lang="ts">
import { getTimeRemaining } from '~/utils/format'

const props = defineProps<{
  endDate: string
  liveUrl?: string
  loading?: boolean
}>()

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

const hasStarted = computed(() => remaining.value.ended)
</script>

<template>
  <section id="countdown" class="section-divider py-12 md:py-16">
    <div class="w-full">
      <div v-if="!hasStarted" v-reveal class="mx-auto mb-10 w-full max-w-xl md:max-w-2xl">
        <ChalkChildren />
      </div>

      <div v-if="loading" class="animate-pulse space-y-6">
        <div class="mx-auto h-6 w-56 bg-white/10" />
        <div class="h-12 bg-white/10" />
      </div>

      <div v-else-if="hasStarted" v-reveal>
        <h2 class="section-heading">
          <ChalkHeart />
          Le live est en cours
        </h2>
        <p class="mt-3 text-center text-sm font-semibold uppercase tracking-wide text-white/70">
          Rejoignez-nous en direct sur Twitch
        </p>
        <div class="mt-8">
          <TwitchLiveEmbed v-if="liveUrl" :live-url="liveUrl" />
          <p v-else class="text-center text-white/60">
            Le stream démarre bientôt — revenez dans quelques instants.
          </p>
        </div>
      </div>

      <div v-else v-reveal>
        <h2 class="section-heading">
          <ChalkHeart />
          L'événement commence dans
        </h2>
        <div class="mt-8">
          <EventCountdown :end-date="endDate" />
        </div>
      </div>

      <slot />
    </div>
  </section>
</template>
