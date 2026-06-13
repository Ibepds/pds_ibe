<script setup lang="ts">
import type { AssociationDoc } from '~/types'

const props = defineProps<{
  associations: (AssociationDoc & { id?: string })[]
  loading?: boolean
  large?: boolean
}>()

const items = computed(() => props.associations)
</script>

<template>
  <section class="section-divider py-12 md:py-16">
    <div class="mx-auto w-full max-w-5xl text-center">
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
        class="mx-auto flex flex-wrap items-center justify-center"
        :class="large ? 'mt-12 gap-16 md:mt-14' : 'mt-10 gap-12'"
      >
        <div
          v-for="n in 3"
          :key="n"
          class="animate-pulse bg-white/10"
          :class="large ? 'h-28 w-44 md:h-32 md:w-52' : 'h-20 w-36'"
        />
      </div>

      <div
        v-else-if="items.length"
        v-reveal
        class="mx-auto flex flex-wrap items-end justify-center"
        :class="large ? 'mt-12 gap-x-10 gap-y-10 md:mt-14 md:gap-x-16 md:gap-y-12' : 'mt-10 gap-x-8 gap-y-8 md:gap-x-12'"
      >
        <NuxtLink
          v-for="asso in items"
          :key="asso.id ?? asso.name"
          to="/associations"
          class="flex flex-col items-center justify-center text-center transition hover:scale-105"
          :title="asso.name"
        >
          <AssoChalkLogo :large="large" :alt="asso.name" />
          <span
            class="mt-3 font-display font-bold uppercase tracking-wide text-white/75"
            :class="large ? 'text-xs md:text-sm' : 'text-[10px] md:text-xs'"
          >
            {{ asso.name }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
