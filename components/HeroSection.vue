<script setup lang="ts">
import type { EventDoc } from '~/types'
import { formatHeroDate } from '~/utils/format'
import { DA } from '~/utils/daAssets'

defineProps<{
  event: EventDoc | null
  loading?: boolean
  large?: boolean
}>()
</script>

<template>
  <section class="w-full text-center">
    <!-- Logo + décorations (pictos latéraux à partir de md pour éviter le chevauchement mobile) -->
    <div
      class="rise relative mx-auto w-full"
      :class="large ? 'max-w-lg md:max-w-2xl lg:max-w-3xl' : 'max-w-md md:max-w-lg'"
      style="animation-delay: 0.05s"
    >
      <div
        class="pointer-events-none absolute top-8 hidden md:block"
        :class="large ? '-left-12 lg:-left-16' : '-left-8'"
      >
        <ChalkImage
          :src="DA.cgpt.heartOutline"
          :class="large ? 'h-20 w-20 lg:h-24 lg:w-24' : 'h-12 w-12'"
        />
      </div>
      <div
        class="pointer-events-none absolute top-6 hidden md:block"
        :class="large ? '-right-10 lg:-right-14' : '-right-6'"
      >
        <ChalkImage
          :src="DA.cgpt.dove"
          :class="large ? 'h-28 w-28 lg:h-36 lg:w-36' : 'h-20 w-20'"
        />
      </div>
      <img
        src="/images/logo-white.png"
        alt="PDS Humanity — Musique & Solidarité"
        width="320"
        height="180"
        fetchpriority="high"
        decoding="async"
        class="relative mx-auto w-full object-contain"
        :class="large ? 'max-w-[280px] sm:max-w-[320px] md:max-w-[440px] lg:max-w-[520px]' : 'max-w-[260px] sm:max-w-[280px] md:max-w-[360px]'"
      />
    </div>

    <!-- Date + tagline (slide 1 maquette) -->
    <div
      v-if="!loading && event"
      class="rise w-full"
      :class="large ? 'mt-10 md:mt-12' : 'mt-8'"
      style="animation-delay: 0.15s"
    >
      <div class="flex flex-wrap items-center justify-center gap-2 px-2 sm:gap-3 md:gap-5">
        <ChalkSparkles :class="large ? '!h-10 !w-7 sm:!h-12 sm:!w-8 md:!h-16 md:!w-10 lg:!h-20 lg:!w-12' : ''" />
        <p
          class="min-w-0 max-w-full font-display font-bold uppercase tracking-wide"
          :class="large ? 'text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl' : 'text-2xl md:text-4xl lg:text-5xl'"
        >
          {{ formatHeroDate(event.startDate) }}
        </p>
        <ChalkSparkles
          class="scale-x-[-1]"
          :class="large ? '!h-12 !w-8 md:!h-16 md:!w-10 lg:!h-20 lg:!w-12' : ''"
        />
      </div>
      <div
        class="mt-5 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-3 md:mt-6"
      >
        <ChalkHeart :class="large ? '!h-5 !w-5 md:!h-7 md:!w-7' : ''" />
        <p
          class="max-w-[18rem] text-center font-semibold uppercase text-white/90 sm:max-w-none"
          :class="large ? 'text-sm tracking-[0.2em] md:text-base md:tracking-[0.25em] lg:text-lg' : 'text-xs tracking-[0.15em] md:text-sm md:tracking-[0.2em]'"
        >
          Live caritatif de 24h non-stop
        </p>
      </div>
    </div>

    <!-- CTAs -->
    <div
      class="rise mx-auto flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center"
      :class="large ? 'mt-10 max-w-3xl px-2 md:mt-12 md:max-w-4xl md:px-0 lg:max-w-5xl' : 'mt-8 max-w-2xl px-2 md:max-w-3xl md:px-0'"
      style="animation-delay: 0.28s"
    >
      <ChalkButton
        preset="donate"
        to="/donate"
        class="w-full max-w-[300px] sm:max-w-[360px] sm:flex-1"
        :class="large ? 'md:!max-w-[480px] lg:!max-w-[540px]' : ''"
      />
      <ChalkButton
        preset="auctions"
        to="/encheres"
        class="w-full max-w-[300px] sm:max-w-[360px] sm:flex-1"
        :class="large ? 'md:!max-w-[480px] lg:!max-w-[540px]' : ''"
      />
    </div>

    <!-- Flèche scroll -->
    <a
      href="#countdown"
      class="rise inline-flex flex-col items-center gap-1 text-white/50 transition hover:text-white"
      :class="large ? 'mt-12 md:mt-14' : 'mt-10'"
      style="animation-delay: 0.4s"
      aria-label="Défiler vers le contenu"
    >
      <svg
        class="animate-bounce"
        :class="large ? 'h-8 w-8 md:h-10 md:w-10' : 'h-6 w-6'"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </a>
  </section>
</template>
