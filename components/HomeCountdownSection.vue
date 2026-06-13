<script setup lang="ts">
import { getTimeRemaining } from '~/utils/format'

const props = defineProps<{
  endDate: string
  liveUrl?: string
  youtubeUrl?: string
  tiktokUrl?: string
  loading?: boolean
  large?: boolean
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
      <div
        v-if="!hasStarted"
        v-reveal
        class="mx-auto w-full"
        :class="large ? 'mb-12 max-w-3xl md:mb-16 md:max-w-4xl lg:max-w-5xl' : 'mb-10 max-w-xl md:max-w-2xl'"
      >
        <ChalkTrophyHero :large="large" />
      </div>

      <div v-if="loading" class="animate-pulse space-y-6">
        <div
          class="mx-auto bg-white/10"
          :class="large ? 'h-10 w-72 md:h-12 md:w-96' : 'h-6 w-56'"
        />
        <div :class="large ? 'h-20 bg-white/10 md:h-24' : 'h-12 bg-white/10'" />
      </div>

      <div v-else-if="hasStarted" v-reveal>
        <h2
          class="flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center font-display font-bold uppercase tracking-wide"
          :class="large ? 'text-2xl md:text-4xl lg:text-5xl' : 'section-heading'"
        >
          <ChalkHeart :class="large ? '!h-6 !w-6 md:!h-8 md:!w-8 lg:!h-10 lg:!w-10' : '!h-5 !w-5'" />
          Le live est en cours
        </h2>
        <p
          class="mt-4 text-center font-semibold uppercase tracking-wide text-white/70"
          :class="large ? 'text-base md:text-xl' : 'text-sm'"
        >
          Rejoignez-nous en direct sur Twitch
        </p>
        <div :class="large ? 'mt-10' : 'mt-8'">
          <TwitchLiveEmbed
            v-if="liveUrl"
            :live-url="liveUrl"
            :youtube-url="youtubeUrl"
            :tiktok-url="tiktokUrl"
          />
          <p v-else class="text-center text-white/60" :class="large ? 'text-lg' : ''">
            Le stream démarre bientôt — revenez dans quelques instants.
          </p>
        </div>
      </div>

      <div v-else v-reveal>
        <h2
          class="flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center font-display font-bold uppercase tracking-wide"
          :class="large ? 'text-2xl md:text-4xl lg:text-5xl' : 'section-heading'"
        >
          <ChalkHeart :class="large ? '!h-6 !w-6 md:!h-8 md:!w-8 lg:!h-10 lg:!w-10' : '!h-5 !w-5'" />
          L'événement commence dans
        </h2>
        <div :class="large ? 'mt-10 md:mt-14' : 'mt-8'">
          <EventCountdown :end-date="endDate" :large="large" />
        </div>
      </div>
    </div>
  </section>
</template>
