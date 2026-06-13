<script setup lang="ts">
import type { EncheresLot } from '~/types'
import { DA } from '~/utils/daAssets'

const props = defineProps<{
  lots?: EncheresLot[]
  loading?: boolean
  large?: boolean
}>()

const SLOT_COUNT = 10

const SECTION_DESCRIPTION =
  'Liste des objets mis aux enchères par des personnalités au profit des associations'

type DisplaySlot =
  | { locked: true }
  | { locked: false; title: string; description: string }

const items = computed((): DisplaySlot[] => {
  const lots = props.lots ?? []
  return Array.from({ length: SLOT_COUNT }, (_, i) => {
    const lot = lots[i]
    if (lot?.title) {
      return {
        locked: false,
        title: lot.title,
        description: lot.description ?? '',
      }
    }
    return { locked: true }
  })
})

const scrollRef = ref<HTMLElement | null>(null)

const scroll = (dir: -1 | 1) => {
  scrollRef.value?.scrollBy({ left: dir * (props.large ? 340 : 280), behavior: 'smooth' })
}
</script>

<template>
  <section class="section-divider py-12 md:py-16">
    <div class="w-full text-center">
      <h2
        v-reveal
        class="flex items-center justify-center gap-3 font-display font-bold uppercase tracking-wide"
        :class="large ? 'text-2xl md:text-4xl lg:text-5xl' : 'section-heading'"
      >
        <ChalkImage
          :src="DA.cgpt.gift"
          class="chalk-picto shrink-0 opacity-90"
          :class="large ? '!h-8 !w-8 md:!h-10 md:!w-10 lg:!h-12 lg:!w-12' : '!h-6 !w-6 md:!inline-block'"
        />
        Les enchères
      </h2>

      <p
        v-reveal
        class="mx-auto mt-4 max-w-2xl leading-relaxed text-white/70"
        :class="large ? 'text-sm md:text-base lg:text-lg' : 'text-xs md:text-sm'"
      >
        {{ SECTION_DESCRIPTION }}
      </p>

      <div v-if="loading" class="mt-8 flex gap-4 overflow-hidden md:mt-10">
        <div
          v-for="n in SLOT_COUNT"
          :key="n"
          class="shrink-0 animate-pulse bg-white/10"
          :class="large ? 'h-56 w-64 md:h-64 md:w-72' : 'h-48 w-56'"
        />
      </div>

      <div v-else v-reveal class="relative" :class="large ? 'mt-10 md:mt-12' : 'mt-8'">
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
            v-for="(slot, i) in items"
            :key="i"
            class="flex shrink-0 snap-center flex-col items-center border-2 border-white/35 bg-white/5 text-center"
            :class="large ? 'w-[min(85vw,15rem)] p-6 md:w-72 md:p-7 lg:w-80' : 'w-[min(85vw,13rem)] p-5 md:w-56'"
          >
            <div
              class="relative flex w-full items-center justify-center overflow-hidden border-2 border-white/25 bg-white/[0.04]"
              :class="large ? 'aspect-[4/5] min-h-[9rem] md:min-h-[10rem]' : 'aspect-[4/5] min-h-[7rem]'"
            >
              <template v-if="slot.locked">
                <ChalkImage
                  :src="DA.cgpt.gift"
                  class="pointer-events-none opacity-15"
                  :class="large ? 'h-24 w-24 md:h-28 md:w-28' : 'h-20 w-20'"
                />
                <div
                  class="absolute inset-0 flex flex-col items-center justify-center gap-2"
                  aria-hidden="true"
                >
                  <ChalkImage
                    :src="DA.cgpt.padlock"
                    class="chalk-picto opacity-95"
                    :class="large ? 'h-16 w-16 md:h-20 md:w-20' : 'h-12 w-12'"
                  />
                  <span
                    class="font-display font-bold uppercase tracking-wide text-white/75"
                    :class="large ? 'text-[10px] md:text-xs' : 'text-[9px]'"
                  >
                    À dévoiler
                  </span>
                </div>
              </template>

              <template v-else>
                <ChalkImage
                  :src="DA.cgpt.gift"
                  class="opacity-90"
                  :class="large ? 'h-32 w-32 md:h-36 md:w-36' : 'h-24 w-24'"
                />
              </template>
            </div>

            <template v-if="!slot.locked">
              <p
                class="mt-3 font-display font-bold uppercase"
                :class="large ? 'text-base md:text-lg' : 'text-sm'"
              >
                {{ slot.title }}
              </p>
              <p
                v-if="slot.description"
                class="mt-1 text-white/55"
                :class="large ? 'text-sm md:text-base' : 'text-xs'"
              >
                {{ slot.description }}
              </p>
            </template>
            <p
              v-else
              class="mt-3 font-display text-xs font-bold uppercase tracking-wide text-white/45"
              :class="large ? 'md:text-sm' : ''"
            >
              Lot {{ i + 1 }}
            </p>
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

      <div v-reveal class="text-center" :class="large ? 'mt-10 md:mt-12' : 'mt-8'">
        <ChalkButton
          preset="auctions"
          to="/encheres"
          class="mx-auto"
          :class="large ? '!max-w-[400px] md:!max-w-[480px] lg:!max-w-[540px]' : ''"
        />
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
