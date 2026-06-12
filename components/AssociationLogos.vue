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
  <div v-if="loading" class="flex flex-wrap items-center justify-center gap-12">
    <div v-for="n in 3" :key="n" class="h-16 w-40 animate-pulse rounded bg-ink/10" />
  </div>
  <div
    v-else-if="logos.length"
    class="flex flex-wrap items-center justify-center gap-x-16 gap-y-10"
  >
    <template v-for="asso in logos" :key="asso.id ?? asso.name">
      <a
        v-if="asso.websiteUrl"
        :href="asso.websiteUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-center outline-none transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <img
          :src="asso.logoUrl"
          :alt="asso.name"
          loading="lazy"
          decoding="async"
          class="h-14 w-auto max-w-[180px] object-contain grayscale transition duration-300 hover:scale-105 hover:grayscale-0 md:h-20 md:max-w-[220px]"
        />
      </a>
      <div v-else class="flex items-center justify-center">
        <img
          :src="asso.logoUrl"
          :alt="asso.name"
          loading="lazy"
          decoding="async"
          class="h-14 w-auto max-w-[180px] object-contain grayscale md:h-20 md:max-w-[220px]"
        />
      </div>
    </template>
  </div>
</template>
