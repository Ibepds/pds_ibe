<script setup lang="ts">
import { DA } from '~/utils/daAssets'

const pictos = [
  { src: DA.cgpt.gift, alt: 'Cadeau' },
  { src: DA.picto.heart, alt: 'Cœur' },
  { src: DA.cgpt.heartOutline, alt: 'Cœur' },
  { src: DA.cgpt.check, alt: 'Validation' },
] as const
</script>

<template>
  <section class="text-center">
    <div v-reveal class="mx-auto w-full max-w-4xl lg:max-w-5xl">
      <div class="flex flex-wrap items-end justify-center gap-6 sm:gap-10 md:gap-12 lg:gap-16">
        <ChalkImage
          v-for="(picto, i) in pictos"
          :key="picto.src"
          :src="picto.src"
          :alt="picto.alt"
          class="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 xl:h-44 xl:w-44"
          :class="i === 2 ? 'md:mb-2' : ''"
        />
      </div>

      <p
        class="mt-10 font-display text-xl font-bold uppercase leading-tight tracking-wide sm:mt-12 sm:text-3xl md:mt-14 md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
      >
        Merci de faire la différence
      </p>
    </div>
  </section>
</template>
