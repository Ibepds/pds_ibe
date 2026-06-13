<script setup lang="ts">
import type { AssociationDoc } from '~/types'

defineProps<{
  associations: (AssociationDoc & { id?: string })[]
  loading?: boolean
}>()

const iconVariants = ['hand', 'drop', 'house', 'waves'] as const

const getIcon = (index: number) => iconVariants[index % iconVariants.length]
</script>

<template>
  <section class="section-divider py-12 md:py-16">
    <div class="mx-auto max-w-lg px-5 md:max-w-3xl">
      <h2 v-reveal class="section-heading">
        <ChalkHeart />
        Associations soutenues
      </h2>

      <div v-if="loading" class="mt-8 grid grid-cols-2 gap-8">
        <div v-for="n in 4" :key="n" class="h-32 animate-pulse bg-white/10" />
      </div>

      <div
        v-else
        v-reveal
        class="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4"
      >
        <article
          v-for="(asso, i) in associations"
          :key="asso.id ?? asso.name"
          class="text-center"
        >
          <div class="mx-auto flex h-16 items-center justify-center">
            <img
              v-if="asso.logoUrl"
              :src="asso.logoUrl"
              :alt="asso.name"
              loading="lazy"
              decoding="async"
              class="max-h-14 max-w-full object-contain brightness-0 invert"
            />
            <ChalkAssoIcon v-else :variant="getIcon(i)" />
          </div>
          <h3 class="mt-3 font-display text-xs font-bold uppercase leading-tight tracking-wide md:text-sm">
            {{ asso.name }}
          </h3>
          <p class="mt-2 text-[11px] leading-snug text-white/65 md:text-xs">
            {{ asso.mission || asso.description }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>
