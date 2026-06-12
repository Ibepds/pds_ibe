<script setup lang="ts">
import { doc, onSnapshot } from 'firebase/firestore'
import {
  MOCK_ASSOCIATIONS,
  MOCK_DONATIONS,
  MOCK_FAQ,
  MOCK_SCHEDULE,
} from '~/utils/mockData'

const { event, loading: eventLoading } = useEvent()

// Compteur de collecte en temps réel : on écoute le document event/main
// pour que le montant/donateurs se mettent à jour live à chaque don.
const { db, ready } = useFirebase()
let unsubEvent: (() => void) | null = null
onMounted(() => {
  if (!ready || !db) return
  unsubEvent = onSnapshot(doc(db, 'event', 'main'), (snap) => {
    if (!snap.exists()) return
    const d = snap.data()
    if (event.value) {
      event.value = {
        ...event.value,
        currentAmount: d.currentAmount ?? event.value.currentAmount,
        donorsCount: d.donorsCount ?? event.value.donorsCount,
        isLive: d.isLive ?? event.value.isLive,
      }
    } else {
      event.value = { id: 'main', ...d } as unknown as NonNullable<typeof event.value>
    }
  })
})
onUnmounted(() => unsubEvent?.())

const { data: schedule, loading: sLoading } = useFirestoreCollection(
  'schedule',
  MOCK_SCHEDULE,
  { orderField: 'order', orderDirection: 'asc' },
)

const { data: donations, loading: dLoading } = useFirestoreCollection(
  'donations',
  MOCK_DONATIONS,
  { orderField: 'createdAt', orderDirection: 'desc' },
)

const { data: faq, loading: fLoading } = useFirestoreCollection('faq', MOCK_FAQ, {
  orderField: 'order',
  orderDirection: 'asc',
})

const { data: associations, loading: aLoading } = useFirestoreCollection(
  'associations',
  MOCK_ASSOCIATIONS,
)

definePageMeta({ pageBackground: 'dark' })

const leviers = [
  {
    num: '1',
    title: 'Faire un don',
    text: "Chaque euro compte. 100% des dons sont reversés aux associations partenaires, en direct pendant les 24h.",
    cta: 'Faire un don',
    to: '/donate',
    img: 'https://picsum.photos/seed/pds-dons/900/700',
  },
  {
    num: '2',
    title: 'Freestyles nocturnes',
    text: '56 créneaux de 6 minutes ouverts au public dans la nuit. Réserve le tien et passe au micro en live.',
    cta: 'Réserver un créneau',
    to: '/freestyles',
    img: 'https://picsum.photos/seed/pds-freestyle/900/700',
  },
  {
    num: '3',
    title: 'Enchères solidaires',
    text: 'Des lots exclusifs mis aux enchères en direct sur eBay Live, au profit des associations.',
    cta: 'Voir les enchères',
    to: '/encheres',
    img: 'https://picsum.photos/seed/pds-encheres/900/700',
  },
]

usePageSeo({
  title: 'PDS Humanity — Musique & Solidarité',
  description:
    'Marathon caritatif de 24h organisé par PDS Records / Ibé les 27 et 28 juin. Dons en direct, freestyles nocturnes et enchères solidaires sur Twitch, YouTube, TikTok et eBay Live.',
  path: '/',
})
</script>

<template>
  <div>
    <HeroSection :event="event" :loading="eventLoading" />

    <BrandTicker :items="event?.tickerItems" />

    <section v-if="event" class="py-24 md:py-32">
      <div v-reveal class="mx-auto max-w-7xl px-4 text-center lg:px-8">
        <p class="section-label">( Compte à rebours )</p>
        <h2 class="display-stacked text-4xl text-ink md:text-6xl">L'événement commence</h2>
        <p class="display-stacked mt-1 text-4xl text-primary md:text-6xl">dans.</p>
        <div class="mt-12">
          <EventCountdown :end-date="event.startDate" />
        </div>
      </div>
    </section>

    <DonationCounter
      v-if="event"
      v-reveal
      :current="event.currentAmount"
      :goal="event.donationGoal"
      :donors-count="event.donorsCount"
      :loading="eventLoading"
    />

    <LiveSection
      v-if="event"
      v-reveal
      :is-live="event.isLive"
      :live-url="event.liveUrl"
    />

    <!-- Trois leviers (agencement asymétrique numéroté) -->
    <section class="py-24 md:py-32">
      <div class="mx-auto max-w-7xl px-4 lg:px-8">
        <p v-reveal class="section-label">( Trois leviers )</p>
        <h2 v-reveal class="section-title max-w-4xl">
          Trois façons
          <span class="block text-primary">de soutenir.</span>
        </h2>
        <div class="mt-20 space-y-24 md:space-y-32">
          <div
            v-for="(l, i) in leviers"
            :key="l.num"
            v-reveal
            class="grid items-center gap-10 md:grid-cols-2 md:gap-16"
          >
            <div class="overflow-hidden" :class="i % 2 === 1 ? 'md:order-2' : ''">
              <img
                :src="l.img"
                :alt="l.title"
                loading="lazy"
                class="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-[1.03]"
              />
            </div>
            <div>
              <p class="section-label">( {{ l.num }} )</p>
              <h3 class="display-stacked text-4xl text-ink md:text-6xl">
                {{ l.title }}
              </h3>
              <p class="mt-6 max-w-md text-lg leading-relaxed text-ink/70">{{ l.text }}</p>
              <PrimaryButton :to="l.to" variant="outline" class="mt-8">{{ l.cta }}</PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bande photo plein écran en parallax -->
    <div
      class="relative flex min-h-[65vh] items-center justify-center overflow-hidden bg-fixed bg-center bg-cover"
      style="background-image: url('https://picsum.photos/seed/pdshumanity-crowd/1920/900')"
    >
      <div class="absolute inset-0 bg-ink/60" />
      <div v-reveal class="relative px-6 text-center text-white">
        <p class="section-label text-white/45">( Notre mission )</p>
        <p class="display-stacked text-[clamp(2.5rem,8vw,6rem)]">24 heures</p>
        <p class="display-stacked text-[clamp(2.5rem,8vw,6rem)]">de musique,</p>
        <p class="display-stacked text-[clamp(2.5rem,8vw,6rem)] text-primary-light">une seule cause.</p>
      </div>
    </div>

    <!-- Associations soutenues -->
    <section class="py-24 md:py-32 bg-paper-alt">
      <div class="mx-auto max-w-7xl px-4 lg:px-8">
        <p v-reveal class="section-label">( Partenaires )</p>
        <h2 v-reveal class="section-title">Associations soutenues</h2>
        <p v-reveal="80" class="mt-4 max-w-xl text-lg text-ink/60">L'ensemble des fonds reversés à ces organisations.</p>
        <div v-reveal class="mt-14">
          <AssociationLogos :associations="associations" :loading="aLoading" />
        </div>
        <div v-reveal class="mt-14 text-center">
          <PrimaryButton to="/associations" variant="outline">Découvrir les associations</PrimaryButton>
        </div>
      </div>
    </section>

    <!-- Programme -->
    <section class="py-24 md:py-32">
      <div class="mx-auto max-w-7xl px-4 lg:px-8">
        <p v-reveal class="section-label">( Programme )</p>
        <h2 v-reveal class="section-title">Les temps forts</h2>
        <p v-reveal="80" class="mt-4 text-lg text-ink/60">Le marathon de 24h, heure par heure.</p>
        <div v-reveal="160">
          <ScheduleTimeline :items="schedule" :loading="sLoading" :limit="4" />
        </div>
        <div v-reveal class="mt-12 text-center">
          <PrimaryButton to="/planning" variant="outline">Programme complet</PrimaryButton>
        </div>
      </div>
    </section>

    <BrandTicker :items="event?.tickerItems" variant="outline" />

    <!-- Freestyles CTA -->
    <section class="section-dark py-24 md:py-32">
      <div v-reveal class="mx-auto max-w-7xl px-4 lg:px-8 text-center">
        <p class="section-label">( Freestyles )</p>
        <h2 class="section-title">Freestyles nocturnes</h2>
        <p class="mx-auto mt-6 max-w-2xl text-lg text-white/75">
          56 créneaux de 8 minutes ouverts au public dans la nuit du 27 au 28 juin (03h00 → 10h29).
          Réservez le vôtre dès maintenant.
        </p>
        <div class="mt-10 flex flex-wrap justify-center gap-4">
          <PrimaryButton to="/freestyles">Réserver un créneau</PrimaryButton>
          <PrimaryButton to="/encheres" variant="outline">Voir les enchères</PrimaryButton>
        </div>
      </div>
    </section>

    <RecentDonations v-reveal :donations="donations" :loading="dLoading" :limit="5" />
    <FaqSection v-reveal :items="faq" :loading="fLoading" :limit="4" />
  </div>
</template>
