<script setup lang="ts">
import type { EventDoc } from '~/types'
import { formatDate } from '~/utils/format'

const props = defineProps<{
  event: EventDoc | null
  loading?: boolean
}>()

const titleParts = computed(() => {
  const full = props.event?.heroTitle ?? props.event?.name ?? 'PDS Humanity'
  const words = full.trim().split(/\s+/).filter(Boolean)
  if (words.length <= 1) {
    return { lead: [] as string[], highlight: words[0] ?? 'PDS Humanity' }
  }
  return { lead: words.slice(0, -1), highlight: words[words.length - 1]! }
})

const scrollY = ref(0)
let raf = 0
const onScroll = () => {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => (scrollY.value = window.scrollY))
}
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(raf)
})
const imgStyle = computed(() => ({
  transform: `translate3d(0, ${scrollY.value * 0.3}px, 0) scale(1.08)`,
}))
</script>

<template>
  <section class="section-dark relative flex min-h-screen items-end overflow-hidden">
    <img
      src="https://picsum.photos/seed/pdshumanity-hero/1920/1200"
      alt=""
      aria-hidden="true"
      class="absolute inset-0 h-full w-full object-cover opacity-55 will-change-transform"
      :style="imgStyle"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/20" />

    <div class="relative w-full px-4 pb-16 pt-28 md:px-8 md:pb-24 md:pt-36">
      <div class="mx-auto max-w-7xl">
        <p
          v-if="!loading"
          class="rise mb-8 text-xs font-semibold uppercase tracking-[0.35em] text-white/55"
          style="animation-delay: 0s"
        >
          Marathon caritatif 24h · {{ event?.organizerName ?? 'PDS Records / Ibé' }}
        </p>

        <h1 class="display-stacked text-[clamp(3.5rem,14vw,11rem)]">
          <span
            v-for="(w, i) in titleParts.lead"
            :key="`lead-${i}`"
            class="rise mr-4 inline-block md:mr-6"
            :style="{ animationDelay: `${0.08 + i * 0.07}s` }"
          >{{ w }}</span>
          <span
            class="rise block text-primary-light"
            style="animation-delay: 0.45s"
          >{{ titleParts.highlight }}.</span>
        </h1>

        <div class="mt-12 grid items-end gap-10 md:grid-cols-2 md:gap-16">
          <p class="rise max-w-lg text-lg text-white/75 md:text-xl" style="animation-delay: 0.55s">
            {{ event?.heroSubtitle ?? event?.tagline }}
          </p>
          <div class="rise flex flex-col items-start gap-5 md:items-end" style="animation-delay: 0.65s">
            <p v-if="event" class="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
              <span v-if="event.isLive" class="blink inline-block h-2 w-2 rounded-full bg-accent-red" />
              {{ formatDate(event.startDate) }} → {{ formatDate(event.endDate) }}
            </p>
            <div class="flex flex-wrap gap-4 md:justify-end">
              <PrimaryButton to="/donate">Faire un don</PrimaryButton>
              <PrimaryButton to="/freestyles" variant="outline">Réserver un freestyle</PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
