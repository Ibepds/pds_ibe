<script setup lang="ts">
import { DA } from '~/utils/daAssets'

defineProps<{
  large?: boolean
  compact?: boolean
  /** Afficher le lien vers /planning (uniquement s’il reste des entrées non listées) */
  showProgrammeComplet?: boolean
}>()

const { battles } = useBattles()
</script>

<template>
  <div
    v-if="showProgrammeComplet"
    v-reveal
    class="text-center"
    :class="large ? 'mt-10 md:mt-12' : 'mt-8'"
  >
    <NuxtLink
      to="/planning"
      class="inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-wide text-primary-light hover:underline"
      :class="large ? 'text-base md:text-lg lg:text-xl' : 'text-sm'"
    >
      <ChalkSparkles class="!h-4 !w-3" />
      Programme complet
    </NuxtLink>
  </div>

  <!-- Zone artistes : « TU ES ARTISTE ? » + « Battles » côte à côte (accueil) -->
  <div
    v-reveal
    :class="large ? 'mt-10 grid items-stretch gap-6 md:mt-12 md:grid-cols-2' : 'mt-8'"
  >
    <!-- « TU ES ARTISTE ? » → freestyles -->
    <NuxtLink
      to="/freestyles"
      class="flex flex-col items-center border-2 border-white/40 bg-white/5 text-center transition hover:bg-white/10"
      :class="
        compact
          ? 'mx-auto max-w-xl gap-3 p-5'
          : large
            ? 'h-full gap-5 p-7 md:p-10'
            : 'mx-auto max-w-xl gap-4 p-6'
      "
    >
      <div class="relative">
        <ChalkImage
          :src="DA.cgpt.user"
          class="chalk-picto"
          :class="compact ? 'h-12 w-12' : large ? 'h-16 w-16 md:h-20 md:w-20' : 'h-14 w-14'"
        />
        <ChalkImage
          :src="DA.cgpt.star"
          class="chalk-picto absolute -right-2 -top-1 opacity-90"
          :class="compact ? 'h-5 w-5' : large ? 'h-7 w-7 md:h-8 md:w-8' : 'h-6 w-6'"
        />
      </div>

      <div>
        <img
          :src="DA.retours.titreArtiste"
          alt="Tu es artiste ?"
          loading="lazy"
          decoding="async"
          class="mx-auto h-auto w-full object-contain"
          :class="compact ? 'max-w-[12rem]' : large ? 'max-w-[18rem] md:max-w-sm' : 'max-w-[14rem]'"
        />
        <p
          class="mx-auto mt-4 max-w-md text-white/70"
          :class="compact ? 'text-xs' : large ? 'text-sm md:text-base lg:text-lg' : 'text-xs md:text-sm'"
        >
          Rejoins l'aventure et viens performer lors de notre live caritatif !
        </p>
      </div>

      <span
        class="mt-auto inline-flex items-center gap-3 border-2 border-primary-light text-primary-light transition"
        :class="compact ? 'px-4 py-2 text-xs' : large ? 'px-6 py-3 text-sm md:text-base' : 'px-5 py-2.5 text-sm'"
      >
        <ChalkImage
          :src="DA.cgpt.microphone"
          class="chalk-inline shrink-0"
          :class="compact ? 'h-4 w-4' : 'h-5 w-5 md:h-6 md:w-6'"
        />
        <span class="font-display font-bold uppercase tracking-wide">Réserver un freestyle</span>
        <svg
          class="shrink-0"
          :class="large ? 'h-5 w-5 md:h-6 md:w-6' : 'h-4 w-4'"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </NuxtLink>

    <!-- « Battles » → inscription (accueil uniquement) -->
    <NuxtLink
      v-if="large"
      to="/battles"
      class="flex h-full flex-col items-center gap-5 border-2 border-white/40 bg-white/5 p-7 text-center transition hover:bg-white/10 md:p-10"
    >
      <div class="relative">
        <ChalkImage :src="DA.cgpt.musicNote" class="chalk-picto h-16 w-16 md:h-20 md:w-20" />
        <ChalkImage :src="DA.cgpt.star" class="chalk-picto absolute -right-2 -top-1 h-7 w-7 opacity-90 md:h-8 md:w-8" />
      </div>

      <div>
        <p class="font-display text-2xl font-bold uppercase tracking-wide text-primary-light md:text-4xl">
          {{ battles.ctaTitle }}
        </p>
        <p class="mx-auto mt-4 max-w-md text-white/70 md:text-base lg:text-lg">
          {{ battles.ctaText }}
        </p>
      </div>

      <span
        class="mt-auto inline-flex items-center gap-3 border-2 border-primary-light px-6 py-3 text-sm text-primary-light transition md:text-base"
      >
        <ChalkImage :src="DA.cgpt.musicNote" class="chalk-inline h-5 w-5 shrink-0 md:h-6 md:w-6" />
        <span class="font-display font-bold uppercase tracking-wide">{{ battles.ctaButton }}</span>
        <svg class="h-5 w-5 shrink-0 md:h-6 md:w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </NuxtLink>
  </div>
</template>
