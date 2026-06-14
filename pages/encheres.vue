<script setup lang="ts">
import { MOCK_ENCHERES } from '~/utils/mockData'
import { DA } from '~/utils/daAssets'
import { formatHeroDate } from '~/utils/format'

usePageSeo({
  title: 'Enchères solidaires — PDS Humanity',
  description:
    'Participez aux ventes aux enchères solidaires de PDS Humanity en direct sur eBay Live. Des lots exclusifs au profit des associations partenaires.',
})

const { event } = useEvent()

const { single: encheres } = useFirestoreCollection(
  'content',
  [{ id: 'encheres', ...MOCK_ENCHERES }],
  { docId: 'encheres' },
)

const SLOT_COUNT = 10

const ebayUrl = computed(() => event.value?.ebayLiveUrl || '')

/** Lien d'un lot : eBay dédié sinon eBay global de l'événement */
const lotLink = (lot?: { ebayUrl?: string }) => lot?.ebayUrl || ebayUrl.value

type DisplaySlot =
  | { locked: true; href: string }
  | { locked: false; title: string; description: string; href: string }

const slots = computed((): DisplaySlot[] => {
  const lots = encheres.value?.lots ?? []
  return Array.from({ length: SLOT_COUNT }, (_, i) => {
    const lot = lots[i]
    const href = lotLink(lot)
    if (lot?.title) {
      return { locked: false, title: lot.title, description: lot.description ?? '', href }
    }
    return { locked: true, href }
  })
})

/** Date « LIVE LE 27 JUIN 2026 » */
const liveDate = computed(() =>
  event.value?.startDate ? formatHeroDate(event.value.startDate).toUpperCase() : '',
)
</script>

<template>
  <div class="home-container pb-16">
    <!-- Hero -->
    <section class="pt-8 text-center md:pt-12">
      <p
        v-if="liveDate"
        class="accent-serif text-sm font-semibold uppercase tracking-[0.2em] text-primary-light md:text-base"
      >
        Live le {{ liveDate }}
      </p>
      <div class="mt-6">
        <ChalkTitleHero line1="Enchères" line2="Solidaires" :image="DA.retours.titreEncheres" large />
      </div>
    </section>

    <!-- Intro -->
    <section class="mx-auto mt-12 max-w-2xl space-y-6 md:mt-16">
      <div v-reveal class="flex items-start gap-3">
        <ChalkHeart class="mt-1 shrink-0 !h-6 !w-6 text-accent-rose opacity-90" />
        <p class="leading-relaxed text-white/80 md:text-lg">
          Pendant le PDS Humanity, des ventes aux enchères solidaires sont organisées en direct sur
          <strong class="font-semibold text-white">eBay Live</strong>. Les lots exclusifs sont mis
          aux enchères à des horaires précis.
        </p>
      </div>
      <div v-reveal class="flex items-start gap-3">
        <ChalkHeart class="mt-1 shrink-0 !h-6 !w-6 opacity-90" />
        <p class="leading-relaxed text-white/80 md:text-lg">
          <strong class="font-semibold text-white">100% des fonds récoltés</strong> sont reversés
          aux associations partenaires de l'événement.
        </p>
      </div>
    </section>

    <!-- Grille des lots -->
    <section class="mt-12 md:mt-16">
      <div v-reveal class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
        <component
          :is="slot.href ? 'a' : 'div'"
          v-for="(slot, i) in slots"
          :key="i"
          :href="slot.href || undefined"
          :target="slot.href ? '_blank' : undefined"
          :rel="slot.href ? 'noopener noreferrer' : undefined"
          class="flex flex-col items-center border-2 border-white/35 bg-white/5 p-4 text-center transition"
          :class="slot.href ? 'hover:border-white/60 hover:bg-white/10' : ''"
        >
          <div
            class="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden border-2 border-white/25 bg-white/[0.04]"
          >
            <template v-if="slot.locked">
              <ChalkImage :src="DA.cgpt.gift" class="pointer-events-none h-16 w-16 opacity-15 md:h-20 md:w-20" />
              <div class="absolute inset-0 flex flex-col items-center justify-center gap-2" aria-hidden="true">
                <ChalkImage :src="DA.cgpt.padlock" class="chalk-picto h-12 w-12 opacity-95 md:h-14 md:w-14" />
                <span class="font-display text-[10px] font-bold uppercase tracking-wide text-white/75 md:text-xs">
                  À dévoiler
                </span>
              </div>
            </template>
            <template v-else>
              <ChalkImage :src="DA.cgpt.gift" class="h-20 w-20 opacity-90 md:h-24 md:w-24" />
            </template>
          </div>

          <p v-if="!slot.locked" class="mt-3 font-display text-sm font-bold uppercase md:text-base">
            {{ slot.title }}
          </p>
          <p v-else class="mt-3 font-display text-xs font-bold uppercase tracking-wide text-white/45">
            Lot {{ i + 1 }}
          </p>
          <p v-if="!slot.locked && slot.description" class="mt-1 text-xs text-white/55">
            {{ slot.description }}
          </p>
        </component>
      </div>
    </section>

    <!-- CTA eBay Live -->
    <section class="mt-12 text-center md:mt-16">
      <ChalkButton
        v-if="ebayUrl"
        preset="auctions"
        :href="ebayUrl"
        external
        class="mx-auto !max-w-[400px] md:!max-w-[480px]"
      />
      <p v-else class="font-display text-sm uppercase tracking-wide text-white/50">
        Le lien eBay Live sera disponible le jour de l'événement
      </p>
      <p v-if="encheres?.planningText" class="mx-auto mt-6 max-w-xl whitespace-pre-line text-sm text-white/50">
        {{ encheres.planningText }}
      </p>
    </section>
  </div>
</template>
