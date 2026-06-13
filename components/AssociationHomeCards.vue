<script setup lang="ts">
import type { AssociationDoc } from '~/types'

const props = defineProps<{
  associations: (AssociationDoc & { id?: string })[]
  loading?: boolean
}>()

const logos = computed(() =>
  props.associations.filter((asso) => asso.logoUrl?.trim()),
)
</script>

<template>
  <section class="section-divider py-12 md:py-16">
    <div class="w-full">
      <NuxtLink to="/associations" class="section-heading transition hover:opacity-90">
        <ChalkHeart />
        Associations soutenues
      </NuxtLink>

      <div v-if="loading" class="mt-10 flex flex-wrap items-center justify-center gap-12">
        <div v-for="n in 4" :key="n" class="h-16 w-32 animate-pulse bg-white/10" />
      </div>

      <div
        v-else-if="logos.length"
        v-reveal
        class="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-10 md:gap-x-16"
      >
        <NuxtLink
          v-for="asso in logos"
          :key="asso.id ?? asso.name"
          to="/associations"
          class="flex items-center justify-center outline-none transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-white/40"
          :title="asso.name"
        >
          <img
            :src="asso.logoUrl"
            :alt="asso.name"
            loading="lazy"
            decoding="async"
            class="h-14 w-auto max-w-[160px] object-contain brightness-0 invert opacity-85 transition hover:opacity-100 md:h-20 md:max-w-[200px]"
          />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
