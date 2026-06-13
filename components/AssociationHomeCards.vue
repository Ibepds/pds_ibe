<script setup lang="ts">
import type { AssociationDoc } from '~/types'

const props = defineProps<{
  associations: (AssociationDoc & { id?: string })[]
  loading?: boolean
  large?: boolean
}>()

const logos = computed(() =>
  props.associations.filter((asso) => asso.logoUrl?.trim()),
)
</script>

<template>
  <section class="section-divider py-12 md:py-16">
    <div class="w-full text-center">
      <NuxtLink to="/associations" class="transition hover:opacity-90">
        <h2
          v-reveal
          class="font-display font-bold uppercase tracking-wide"
          :class="large ? 'text-2xl md:text-4xl lg:text-5xl' : 'text-lg md:text-xl'"
        >
          Pour qui ?
        </h2>
        <p
          v-reveal
          class="mt-3 font-semibold uppercase tracking-wide text-white/70"
          :class="large ? 'text-base md:text-xl lg:text-2xl' : 'mt-2 text-sm'"
        >
          100% des dons reversés
        </p>
      </NuxtLink>

      <div
        v-if="loading"
        class="flex flex-wrap items-center justify-center"
        :class="large ? 'mt-12 gap-16 md:mt-14' : 'mt-10 gap-12'"
      >
        <div
          v-for="n in 3"
          :key="n"
          class="animate-pulse bg-white/10"
          :class="large ? 'h-24 w-40 md:h-28 md:w-48' : 'h-16 w-32'"
        />
      </div>

      <div
        v-else-if="logos.length"
        v-reveal
        class="flex flex-wrap items-center justify-center"
        :class="large ? 'mt-12 gap-x-14 gap-y-12 md:mt-14 md:gap-x-20 md:gap-y-14' : 'mt-10 gap-x-12 gap-y-10 md:gap-x-16'"
      >
        <NuxtLink
          v-for="asso in logos"
          :key="asso.id ?? asso.name"
          to="/associations"
          class="flex items-center justify-center transition hover:scale-105"
          :title="asso.name"
        >
          <img
            :src="asso.logoUrl"
            :alt="asso.name"
            loading="lazy"
            decoding="async"
            class="w-auto object-contain brightness-0 invert opacity-85 transition hover:opacity-100"
            :class="large ? 'h-20 max-w-[200px] md:h-28 md:max-w-[280px] lg:h-32 lg:max-w-[320px]' : 'h-14 max-w-[160px] md:h-20 md:max-w-[200px]'"
          />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
