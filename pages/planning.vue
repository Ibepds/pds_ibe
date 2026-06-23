<script setup lang="ts">
import { MOCK_SCHEDULE, MOCK_PROGRAMME } from '~/utils/mockData'
import { getTimeRemaining } from '~/utils/format'
import { DA } from '~/utils/daAssets'

const { event, loading: eventLoading } = useEvent()

const { data: schedule, loading, error } = useFirestoreCollection(
  'schedule',
  MOCK_SCHEDULE,
  { orderField: 'order', orderDirection: 'asc' },
)

const programmeItems = computed(() =>
  [...schedule.value]
    .filter((i) => !i.title.toLowerCase().includes('freestyle'))
    .sort((a, b) => a.order - b.order),
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
    <section class="py-8 md:py-10">
      <div v-reveal class="mb-5 md:mb-6">
        <ChalkChildren class="mx-auto max-w-[180px] opacity-90 md:max-w-[220px]" />
      </div>

      <PageHeader
        compact
        title="Le programme"
        lead="24h de live pour faire la différence."
        :subtitle="programme?.subtitle ?? 'Concepts, échanges, freestyles et enchères solidaires.'"
      />

      <p v-if="error" class="mt-3 text-center text-sm text-accent-rose">{{ error }}</p>

      <div v-reveal class="mt-6 md:mt-8">
        <ScheduleTimeline :items="programmeItems" :loading="loading" compact />
      </div>

      <ProgrammeCompletFreestyle compact :show-programme-complet="false" />
    </section>

    <!-- Inscription aux battles (DJ / Versus) -->
    <section class="section-divider py-10 text-center md:py-14">
      <NuxtLink
        to="/battles"
        v-reveal
        class="mx-auto flex max-w-xl flex-col items-center border-2 border-white/40 bg-white/5 p-6 transition hover:bg-white/10 md:p-8"
      >
        <ChalkImage :src="DA.cgpt.microphone" class="chalk-picto h-12 w-12 md:h-14 md:w-14" />
        <p class="mt-4 font-display text-lg font-bold uppercase tracking-wide text-primary-light md:text-2xl">
          Battle de DJ &amp; Battle Versus
        </p>
        <p class="mt-2 max-w-md text-sm text-white/70 md:text-base">
          Viens assister aux battles en direct ! Inscris-toi pour y participer en tant que spectateur.
        </p>
        <span class="mt-5 inline-flex items-center gap-2 border-2 border-primary-light px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-primary-light">
          Assister aux battles
          <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </NuxtLink>
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
          <TwitchLiveEmbed
            v-if="event.liveUrl"
            :live-url="event.liveUrl"
            :youtube-url="event.youtubeUrl"
            :tiktok-url="event.tiktokUrl"
          />
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
