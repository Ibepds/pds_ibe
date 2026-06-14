<script setup lang="ts">
/**
 * Titre « peint » réutilisable (ex. ENCHÈRES SOLIDAIRES, ASSOCIATIONS SOUTENUES).
 * Première ligne en blanc, seconde ligne en bleu clair soulignée, cœurs décoratifs.
 */
defineProps<{
  line1: string
  line2: string
  large?: boolean
  /** Si fourni, affiche le titre peint (image) au lieu du texte */
  image?: string
}>()
</script>

<template>
  <div class="relative mx-auto w-full max-w-3xl text-center">
    <!-- Cœurs décoratifs -->
    <ChalkHeart
      class="pointer-events-none absolute -left-1 top-1 -rotate-12 text-accent-rose opacity-80 md:left-4"
      :class="large ? '!h-7 !w-7 md:!h-9 md:!w-9' : '!h-5 !w-5'"
    />
    <ChalkHeart
      class="pointer-events-none absolute right-2 top-0 rotate-12 opacity-70 md:right-8"
      :class="large ? '!h-6 !w-6 md:!h-8 md:!w-8' : '!h-4 !w-4'"
    />

    <!-- Titre peint (image fournie) -->
    <img
      v-if="image"
      v-reveal
      :src="image"
      :alt="`${line1} ${line2}`"
      loading="lazy"
      decoding="async"
      class="mx-auto h-auto w-full object-contain"
      :class="large ? 'max-w-[min(100%,34rem)] md:max-w-2xl' : 'max-w-xs md:max-w-sm'"
    />

    <!-- Titre texte (repli) -->
    <h1
      v-else
      v-reveal
      class="font-display font-bold uppercase leading-[0.92] tracking-wide"
      :class="large ? 'text-4xl sm:text-5xl md:text-7xl lg:text-8xl' : 'text-3xl sm:text-4xl md:text-5xl'"
    >
      <span class="block text-white">{{ line1 }}</span>
      <span class="mt-1 inline-block border-b-4 border-primary-light pb-1 text-primary-light">
        {{ line2 }}
      </span>
    </h1>
  </div>
</template>
