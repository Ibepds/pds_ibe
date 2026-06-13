<script setup lang="ts">
import { DA } from '~/utils/daAssets'

defineProps<{
  large?: boolean
}>()
</script>

<template>
  <div v-reveal class="text-center" :class="large ? 'mt-10 md:mt-12' : 'mt-8'">
    <NuxtLink
      to="/planning"
      class="inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-wide text-primary-light hover:underline"
      :class="large ? 'text-base md:text-lg lg:text-xl' : 'text-sm'"
    >
      <ChalkSparkles class="!h-4 !w-3" />
      Programme complet
    </NuxtLink>
  </div>

  <NuxtLink
    v-reveal
    to="/freestyles"
    class="flex flex-col items-center gap-4 border-2 border-white/40 bg-white/5 text-center transition hover:bg-white/10 sm:flex-row sm:items-center sm:gap-4 sm:text-left"
    :class="large ? 'mt-10 p-5 md:mt-12 md:p-7 lg:p-8' : 'mt-8 p-4 md:p-5'"
  >
    <div
      class="flex shrink-0 items-center justify-center rounded-full border-2 border-accent-green text-accent-green"
      :class="large ? 'h-16 w-16 md:h-20 md:w-20' : 'h-12 w-12'"
    >
      <ChalkImage
        :src="DA.cgpt.microphone"
        class="chalk-picto"
        :class="large ? 'h-7 w-7 md:h-9 md:w-9' : 'h-5 w-5'"
      />
    </div>
    <div class="min-w-0 flex-1">
      <p
        class="font-display font-bold uppercase text-accent-green"
        :class="large ? 'text-base md:text-xl lg:text-2xl' : 'text-sm md:text-base'"
      >
        Freestyle nocturne
      </p>
      <p class="text-white/65" :class="large ? 'text-sm md:text-base lg:text-lg' : 'text-xs md:text-sm'">
        Réservez votre créneau
      </p>
    </div>
    <svg
      class="shrink-0 text-white/70"
      :class="large ? 'h-6 w-6 md:h-7 md:w-7' : 'h-5 w-5'"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </NuxtLink>
</template>
