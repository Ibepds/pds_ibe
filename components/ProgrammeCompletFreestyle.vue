<script setup lang="ts">
import { DA } from '~/utils/daAssets'

defineProps<{
  large?: boolean
  compact?: boolean
  /** Afficher le lien vers /planning (uniquement s’il reste des entrées non listées) */
  showProgrammeComplet?: boolean
}>()
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

  <!-- Zone artistes « TU ES ARTISTE ? » -->
  <NuxtLink
    v-reveal
    to="/freestyles"
    class="mx-auto flex max-w-xl flex-col items-center border-2 border-white/40 bg-white/5 text-center transition hover:bg-white/10"
    :class="
      compact
        ? 'mt-6 gap-3 p-5 md:mt-8'
        : large
          ? 'mt-10 gap-5 p-7 md:mt-12 md:p-10'
          : 'mt-8 gap-4 p-6'
    "
  >
    <!-- Picto profil + étoile -->
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
      <p
        class="inline-block border-b-2 border-primary-light pb-1 font-display font-bold uppercase tracking-wide text-primary-light"
        :class="compact ? 'text-lg' : large ? 'text-2xl md:text-4xl lg:text-5xl' : 'text-xl md:text-2xl'"
      >
        Tu es artiste ?
      </p>
      <p
        class="mx-auto mt-4 max-w-md text-white/70"
        :class="compact ? 'text-xs' : large ? 'text-sm md:text-base lg:text-lg' : 'text-xs md:text-sm'"
      >
        Rejoins l'aventure et viens performer lors de notre live caritatif !
      </p>
    </div>

    <!-- Bouton réserver un freestyle -->
    <span
      class="mt-2 inline-flex items-center gap-3 border-2 border-primary-light text-primary-light transition group-hover:bg-primary-light/10"
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
</template>
