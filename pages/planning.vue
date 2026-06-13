<script setup lang="ts">
import { MOCK_SCHEDULE, MOCK_PROGRAMME } from '~/utils/mockData'
import { getTimeRemaining } from '~/utils/format'

const { event, loading: eventLoading } = useEvent()

const { data: schedule, loading, error } = useFirestoreCollection(
  'schedule',
  MOCK_SCHEDULE,
  { orderField: 'order', orderDirection: 'asc' },
)

const { single: programme } = useFirestoreCollection(
  'content',
  [{ id: 'programme', ...MOCK_PROGRAMME }],
  { docId: 'programme' },
)

const remaining = ref({ ended: false })
onMounted(() => {
  if (!event.value) return
  remaining.value = getTimeRemaining(event.value.startDate)
  const interval = setInterval(() => {
    if (event.value) remaining.value = getTimeRemaining(event.value.startDate)
  }, 1000)
  onUnmounted(() => clearInterval(interval))
})
watch(event, (e) => {
  if (e) remaining.value = getTimeRemaining(e.startDate)
})

usePageSeo({
  title: 'Programme — PDS Humanity',
  description:
    'Le déroulé du marathon de 24h de PDS Humanity : performances, freestyles, enchères et temps forts.',
})
</script>

<template>
  <div class="home-container">
    <section class="py-12 md:py-16">
      <div v-reveal class="mb-10">
        <ChalkChildren class="mx-auto max-w-xs opacity-90 md:max-w-md" />
      </div>

      <PageHeader
        title="Le programme"
        lead="24h de live pour faire la différence."
        :subtitle="programme?.subtitle ?? 'Concepts, échanges, freestyles et enchères solidaires.'"
      />

      <p v-if="error" class="mt-4 text-accent-rose">{{ error }}</p>

      <div v-reveal class="mt-10">
        <ScheduleTimeline :items="schedule" :loading="loading" />
      </div>
    </section>

    <section v-if="event" class="section-divider py-12 text-center md:py-16">
      <template v-if="!eventLoading && remaining.ended">
        <div v-reveal class="flex items-center justify-center gap-2">
          <ChalkSparkles />
          <ChalkHeart />
          <p class="font-display text-sm font-bold uppercase tracking-wide">
            Le live est en cours
          </p>
          <ChalkSparkles class="scale-x-[-1]" />
        </div>
        <div v-reveal class="mt-8">
          <TwitchLiveEmbed v-if="event.liveUrl" :live-url="event.liveUrl" />
        </div>
      </template>
      <template v-else>
        <div v-reveal class="flex items-center justify-center gap-2">
          <ChalkSparkles />
          <ChalkHeart />
          <p class="font-display text-sm font-bold uppercase tracking-wide">
            L'événement commence dans
          </p>
          <ChalkSparkles class="scale-x-[-1]" />
        </div>
        <div v-if="!eventLoading" v-reveal class="mt-8">
          <EventCountdown :end-date="event.startDate" />
        </div>
      </template>
    </section>
  </div>
</template>
