<script setup lang="ts">
import type { Donation } from '~/types'
import { formatCurrency } from '~/utils/format'

const props = defineProps<{
  donations: Donation[]
  loading?: boolean
  limit?: number
  large?: boolean
}>()

const heartOpacities = ['opacity-100', 'opacity-90', 'opacity-80', 'opacity-70', 'opacity-60']

const formatTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'il y a 1 min'
  if (mins < 60) return `il y a ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `il y a ${hours}h`
  return `il y a ${Math.floor(hours / 24)}j`
}

/** Au-delà de ce seuil, la liste défile automatiquement en boucle */
const SCROLL_THRESHOLD = 6

const list = computed(() => props.donations ?? [])

// Défilement auto seulement s'il y a beaucoup de dons (et pas de limite fixe imposée)
const isScrolling = computed(() => !props.limit && list.value.length > SCROLL_THRESHOLD)

const visible = computed(() =>
  props.limit ? list.value.slice(0, props.limit) : list.value,
)

// Durée proportionnelle au nombre de dons
const marqueeStyle = computed(() => ({
  '--marquee-duration': `${Math.max(12, list.value.length * 2.4)}s`,
}))
</script>

<template>
  <section class="section-divider py-12 md:py-16">
    <div class="w-full">
      <h2
        v-reveal
        class="flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center font-display font-bold uppercase tracking-wide"
        :class="large ? 'text-2xl md:text-4xl lg:text-5xl' : 'section-heading'"
      >
        <ChalkHeart :class="large ? '!h-6 !w-6 md:!h-8 md:!w-8 lg:!h-10 lg:!w-10' : '!h-5 !w-5'" />
        Merci pour votre soutien
      </h2>

      <div v-if="loading" :class="large ? 'mt-10 space-y-4 md:mt-12' : 'mt-8 space-y-3'">
        <div
          v-for="i in 5"
          :key="i"
          class="animate-pulse bg-white/10"
          :class="large ? 'h-10' : 'h-8'"
        />
      </div>

      <!-- Liste défilante (beaucoup de dons) -->
      <div
        v-else-if="isScrolling"
        v-reveal
        class="marquee-y-mask mx-auto mt-10 w-full max-w-lg overflow-hidden md:max-w-2xl"
        :class="large ? 'h-[22rem] md:h-[26rem]' : 'h-72'"
        :style="marqueeStyle"
      >
        <ul class="animate-marquee-y">
          <li
            v-for="(d, i) in [...list, ...list]"
            :key="d.id + '-' + i"
            class="flex items-center justify-between gap-3 border-b border-white/15 py-3"
          >
            <span class="flex min-w-0 items-center gap-2 font-semibold" :class="large ? 'md:text-lg' : ''">
              <ChalkHeart :class="[heartOpacities[i % heartOpacities.length], large ? '!h-5 !w-5' : '!h-3.5 !w-3.5']" />
              <span class="truncate">{{ d.username }}</span>
            </span>
            <span class="flex shrink-0 items-baseline gap-2">
              <span class="font-display font-bold text-primary-light" :class="large ? 'text-lg md:text-xl' : 'text-sm'">
                {{ formatCurrency(d.amount) }}
              </span>
              <span class="text-white/45" :class="large ? 'text-sm' : 'text-xs'">{{ formatTime(d.createdAt) }}</span>
            </span>
          </li>
        </ul>
      </div>

      <!-- Liste statique (peu de dons) — une ligne : Nom · Montant · Date -->
      <ul
        v-else
        v-reveal
        class="mx-auto w-full max-w-lg md:max-w-2xl"
        :class="large ? 'mt-10 md:mt-12' : 'mt-8'"
      >
        <li
          v-for="(d, i) in visible"
          :key="d.id"
          class="flex items-center justify-between gap-3 border-b border-white/15"
          :class="large ? 'py-3 md:py-4' : 'py-2.5'"
        >
          <span class="flex min-w-0 items-center gap-2 font-semibold" :class="large ? 'text-base md:text-xl' : ''">
            <ChalkHeart :class="[heartOpacities[i % heartOpacities.length], large ? '!h-5 !w-5 md:!h-6 md:!w-6' : '!h-3.5 !w-3.5']" />
            <span class="truncate">{{ d.username }}</span>
          </span>
          <span class="flex shrink-0 items-baseline gap-2">
            <span class="font-display font-bold text-primary-light" :class="large ? 'text-xl md:text-2xl' : 'text-sm'">
              {{ formatCurrency(d.amount) }}
            </span>
            <span class="text-white/45" :class="large ? 'text-sm md:text-base' : 'text-xs'">
              {{ formatTime(d.createdAt) }}
            </span>
          </span>
        </li>
      </ul>

      <p
        v-if="!loading && !list.length"
        class="text-center text-white/50"
        :class="large ? 'mt-8 text-base md:text-lg' : 'mt-6 text-sm'"
      >
        Soyez le premier à faire un don !
      </p>
    </div>
  </section>
</template>
