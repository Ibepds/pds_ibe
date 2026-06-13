<script setup lang="ts">
import type { EncheresLot } from '~/types'
import { DA } from '~/utils/daAssets'

const props = defineProps<{
  lots?: EncheresLot[]
  loading?: boolean
}>()

const DEFAULT_LOTS = [
  { title: 'Objet mystère', description: '27 juin à 19h30' },
  { title: 'Objet mystère', description: '27 juin à 20h45' },
  { title: 'Objet mystère', description: '28 juin à 03h00' },
]

const items = computed(() =>
  props.lots?.length ? props.lots : DEFAULT_LOTS,
)

const scrollRef = ref<HTMLElement | null>(null)

const scroll = (dir: -1 | 1) => {
  scrollRef.value?.scrollBy({ left: dir * 280, behavior: 'smooth' })
}
</script>

<template>
  <section class="section-divider py-12 md:py-16">
    <div class="w-full">
      <h2 v-reveal class="section-heading">
        <ChalkHeart />
        Objets mystères
      </h2>

      <div v-if="loading" class="mt-8 flex gap-4 overflow-hidden">
        <div v-for="n in 3" :key="n" class="h-48 w-56 shrink-0 animate-pulse bg-white/10" />
      </div>

      <div v-else v-reveal class="relative mt-8">
        <button
          type="button"
          class="absolute -left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border-2 border-white/40 bg-primary/90 p-2 text-white transition hover:bg-primary md:flex"
          aria-label="Lot précédent"
          @click="scroll(-1)"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          ref="scrollRef"
          class="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scrollbar-none md:gap-6"
        >
          <article
            v-for="(lot, i) in items"
            :key="i"
            class="flex w-52 shrink-0 snap-center flex-col items-center border-2 border-white/35 bg-white/5 p-5 text-center md:w-56"
          >
            <div class="relative flex h-28 w-full items-center justify-center">
              <ChalkImage :src="DA.picto.gift" class="h-24 w-24 opacity-90" />
            </div>
            <p class="mt-3 font-display text-sm font-bold uppercase">{{ lot.title }}</p>
            <p class="mt-1 text-xs text-white/55">{{ lot.description }}</p>
          </article>
        </div>

        <button
          type="button"
          class="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border-2 border-white/40 bg-primary/90 p-2 text-white transition hover:bg-primary md:flex"
          aria-label="Lot suivant"
          @click="scroll(1)"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div v-reveal class="mt-8 text-center">
        <PrimaryButton to="/encheres" variant="outline">
          Accéder aux enchères
        </PrimaryButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.scrollbar-none {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
</style>
